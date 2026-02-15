// Legal Document Analyzer
// Uses Gemini API (via api/gemini.js) to analyze extracted legal text

/**
 * Analyze legal document text
 * @param {string} extractedText - The text extracted from the page
 * @returns {Promise<Object>} Analysis results
 */
async function analyzeLegalDocument(extractedText) {
  console.log('Starting legal document analysis...');
  
  // Validate input
  if (!extractedText || extractedText.trim().length === 0) {
    return {
      success: false,
      error: 'No text provided for analysis'
    };
  }

  if (extractedText.length < 100) {
    return {
      success: false,
      error: 'Text too short - this doesn\'t appear to be a legal document'
    };
  }

  try {
    // Prepare text for analysis (truncate if needed)
    const maxChars = 500000;
    const textToAnalyze = extractedText.length > maxChars 
      ? extractedText.substring(0, maxChars) 
      : extractedText;

    // Build prompt for legal document analysis (from prompts.js)
    const prompt = await getLegalAnalysisPrompt(textToAnalyze);

    // Call Gemini API (function from api/gemini.js)
    const geminiResult = await callGeminiAPI(prompt);

    if (!geminiResult.success) {
      throw new Error(geminiResult.error);
    }

    console.log('Analysis complete!');

    return {
      success: true,
      analysis: geminiResult.text,
      metadata: {
        characterCount: extractedText.length,
        truncated: extractedText.length > maxChars,
        timestamp: Date.now()
      }
    };

  } catch (error) {
    console.error('Analysis error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
