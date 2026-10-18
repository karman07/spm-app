import axios from 'axios';

const GEMINI_MODEL = 'gemini-3.8-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export type Riddle = {
  riddle: string;
  options: string[];
  answer: string;
  explanation: string;
};

export const fetchRiddle = async (): Promise<Riddle> => {
  // Set in .env (see .env.example). EXPO_PUBLIC_ variables are inlined into the app bundle at build time.
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing EXPO_PUBLIC_GEMINI_API_KEY. Add it to .env and restart the dev server.');
  }

  const response = await axios.post(
    GEMINI_URL,
    {
      contents: [{
        parts: [{
          text: 'Generate a short math riddle for kids with 4 options. Return ONLY a JSON object: {"riddle": "...", "options": ["A", "B", "C", "D"], "answer": "exact_string_from_options", "explanation": "..."}. Ensure the answer is exactly one of the options.'
        }]
      }],
      generationConfig: {
        // Gemini 3 models spend part of this budget on internal thinking, so keep it generous.
        maxOutputTokens: 2048,
        temperature: 0.9,
        responseMimeType: "application/json"
      }
    },
    { headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' }, timeout: 30000 }
  );

  const content = response.data.candidates?.[0]?.content?.parts?.find((p: any) => typeof p.text === 'string')?.text;
  if (!content) {
    throw new Error("AI returned an empty response");
  }

  // Robustly extract JSON even if AI includes markdown backticks or extra text
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("Failed to find JSON in response:", content);
    throw new Error("AI returned invalid format");
  }

  let parsed: Riddle;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("Parse Error Content:", content);
    throw new Error("Failed to parse AI response");
  }

  if (!parsed.riddle || !Array.isArray(parsed.options) || parsed.options.length < 2 || !parsed.options.includes(parsed.answer)) {
    throw new Error("AI returned an incomplete riddle");
  }

  return parsed;
};
