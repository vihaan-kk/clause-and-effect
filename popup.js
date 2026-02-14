// Popup script for Clause & Effect Legal Document Analyzer
console.log('Popup script loaded');

document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById('analyze-btn');
  const loading = document.getElementById('loading');
  const results = document.getElementById('results');
  
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', async () => {
      console.log('Analyze button clicked!');
      
      // Show loading, hide results
      loading.style.display = 'block';
      results.style.display = 'none';
      analyzeBtn.disabled = true;
      analyzeBtn.textContent = 'Analyzing...';
      
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const tab = tabs[0];
        console.log('Active tab:', tab);
        
        // Check if tab exists
        if (!tab) {
          hideLoading();
          alert('No active tab found');
          return;
        }
        
        // Check if it's a restricted page
        if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://')) {
          hideLoading();
          alert('Cannot analyze Chrome internal pages. Please try on a regular webpage!');
          return;
        }
        
        console.log('Sending message to tab:', tab.id);
        
        // Step 1: Extract text from page
        chrome.tabs.sendMessage(tab.id, { action: 'extractText' }, async (response) => {
          console.log('Response received:', response);
          
          // Check for errors
          if (chrome.runtime.lastError) {
            console.error('Error:', chrome.runtime.lastError.message);
            hideLoading();
            alert('Error: Content script not ready. Try refreshing the page and try again.');
            return;
          }
          
          // Check if response is valid
          if (response && response.success && response.text) {
            console.log('Text extracted, character count:', response.text.length);
            
            // Step 2: Analyze the extracted text using Gemini AI
            try {
              const analysisResult = await analyzeLegalDocument(response.text);
              
              hideLoading();
              
              if (analysisResult.success) {
                // Display the analysis results
                results.textContent = analysisResult.analysis;
                results.style.display = 'block';
                
                if (analysisResult.metadata.truncated) {
                  results.textContent += '\n\n⚠️ Note: Input text was truncated due to length limits.';
                }
                
                console.log('Analysis complete!');
              } else {
                alert(`Analysis failed: ${analysisResult.error}`);
              }
            } catch (error) {
              hideLoading();
              console.error('Analysis error:', error);
              alert(`Error during analysis: ${error.message}`);
            }
          } else {
            hideLoading();
            alert('Failed to extract text from page');
          }
        });
      });
    });
  } else {
    console.error('Analyze button not found in popup HTML!');
  }
  
  function hideLoading() {
    loading.style.display = 'none';
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = 'Analyze Current Page';
  }
});