import axios from 'axios';

export const fetchRiddle = async () => {
  const response = await axios.post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDDuCc_V3eZavSm91--KyZcjaPToF_MCPU',
    {
      contents: [{ parts: [{ text: 'Give me one math riddle with four options and the correct answer in JSON format.' }] }],
    }
  );
  const content = response.data.candidates[0].content.parts[0].text;
  const jsonMatch = content.match(/```json([\s\S]*?)```/);
  return JSON.parse(jsonMatch ? jsonMatch[1] : content);
};
