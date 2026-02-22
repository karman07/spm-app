import axios from 'axios';

export const fetchRiddle = async () => {
  const response = await axios.post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAK-IqE2Jt0O_8zy2JNl2fl0wHfbFu3chM',
    {
      contents: [{
        parts: [{
          text: 'Generate a short math riddle for kids with 4 options. Return ONLY a JSON object: {"riddle": "...", "options": ["A", "B", "C", "D"], "answer": "exact_string_from_options", "explanation": "..."}. Ensure the answer is exactly one of the options.'
        }]
      }],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
        responseMimeType: "application/json"
      }
    }
  );

  const content = response.data.candidates[0].content.parts[0].text;
  console.log("Gemini Raw Response:", content);

  // Robustly extract JSON even if AI includes markdown backticks or extra text
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("Failed to find JSON in response:", content);
    throw new Error("AI returned invalid format");
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    console.log("Gemini Parsed Response:", parsed);
    return parsed;
  } catch (e) {
    console.error("Parse Error Content:", content);
    throw new Error("Failed to parse AI response");
  }
};
