// Gemini API Integration
// API key loaded from config.js

// Check if config.js is loaded and API key is available
if (typeof CONFIG === 'undefined' || !CONFIG.GEMINI_API_KEY) {
  console.error('❌ CONFIG not loaded or API key missing. Make sure config.js is loaded before this script.');
}

const GEMINI_API_KEY = typeof CONFIG !== 'undefined' ? CONFIG.GEMINI_API_KEY : '';
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';

/**
 * Call Gemini API with a prompt
 * @param {string} prompt - The prompt to send to Gemini
 * @returns {Promise<Object>} Result with success status and response text or error
 */
async function callGeminiAPI(prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Please ensure config.js exists with your API key.');
  }
  
  if (!prompt || prompt.trim().length === 0) {
    throw new Error('Prompt is required');
  }

  try {
    console.log('=== GEMINI API DEBUG ===');
    console.log('📤 PROMPT BEING SENT:');
    console.log(prompt);
    console.log('========================');
    
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 20,
          topP: 0.85,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_ONLY_HIGH"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    const analysisText = data.candidates[0].content.parts[0].text;

    console.log('Gemini API call successful');
    console.log('=== GEMINI API DEBUG ===');
    console.log('📥 RESPONSE RECEIVED:');
    console.log(analysisText);
    console.log('========================');

    return {
      success: true,
      text: analysisText
    };

  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
