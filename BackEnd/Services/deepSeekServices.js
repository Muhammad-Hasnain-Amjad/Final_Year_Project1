// Services/legalChatService.js
const axios = require('axios');

const API_KEY = process.env.API_KEY;

const getLegalAdvice = async (userQuestion, lawyerData = []) => {
  try {
    // System Prompt
    let systemPrompt = `
You are a legal assistant for a Pakistani legal platform.

RULES:
1. ONLY answer law-related questions about Pakistan
2. If question is NOT about law, say:
   "I can only help with legal questions about Pakistan law."
3. Keep answers short and simple
4. Always add:
   "⚠️ This is general information. Please consult a lawyer for your specific case."
5. Use simple Urdu/English mix if helpful
6. Do NOT give medical, financial, coding, or personal advice.
`;

    // Add lawyers info from DB if available
    if (lawyerData && lawyerData.length > 0) {
      systemPrompt += `\n\nAvailable lawyers:\n`;
      lawyerData.slice(0, 3).forEach((lawyer) => {
        systemPrompt += `
- ${lawyer.registration.fullName}
  Specialization: ${lawyer.registration.practiceAreas?.join(", ")}\n`;
      });
    }
    console.log(API_KEY);

    // Gemini API Request
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser Question: ${userQuestion}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500
        }
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // Extract Gemini response
    const aiReply = response.data.candidates[0].content.parts[0].text;

    // Return the response object (not calling res.json)
    return {
      success: true,
      reply: aiReply
    };

  } catch (error) {
    console.error("Gemini Error:", error.response?.data || error.message);
    
    // Return error object
    return {
      success: false,
      reply: "Sorry, AI service is currently unavailable."
    };
  }
};

module.exports = { getLegalAdvice };