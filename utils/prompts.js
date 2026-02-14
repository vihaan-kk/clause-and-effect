// Prompts for AI analysis
// Prompts are loaded from text files in the prompts/ directory

// Cache for loaded prompts
const promptCache = {};

/**
 * Load a prompt template from a text file
 * @param {string} promptName - Name of the prompt file (without .txt extension)
 * @returns {Promise<string>} The prompt template
 */
async function loadPromptTemplate(promptName) {
  if (promptCache[promptName]) {
    return promptCache[promptName];
  }

  try {
    const response = await fetch(chrome.runtime.getURL(`prompts/${promptName}.txt`));
    if (!response.ok) {
      throw new Error(`Failed to load prompt: ${promptName}`);
    }
    const template = await response.text();
    promptCache[promptName] = template;
    return template;
  } catch (error) {
    console.error('Error loading prompt template:', error);
    throw error;
  }
}

/**
 * Generate a legal document analysis prompt
 * @param {string} legalText - The legal text to analyze
 * @returns {Promise<string>} The complete prompt with text inserted
 */
async function getLegalAnalysisPrompt(legalText) {
  const template = await loadPromptTemplate('legal-analysis');
  // Replace placeholder with actual legal text
  return template.replace('{{LEGAL_TEXT}}', legalText);
}
