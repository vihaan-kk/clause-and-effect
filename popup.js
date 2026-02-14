// Popup script
console.log('Popup script loaded');

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('extract-btn');
  
  if (button) {
    button.addEventListener('click', () => {
      console.log('Button clicked!');
      
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        console.log('Active tab:', tab);
        
        // Check if tab exists
        if (!tab) {
          console.error('No active tab found');
          alert('No active tab found');
          return;
        }
        
        // Check if it's a restricted page
        if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://')) {
          console.warn('Restricted page:', tab.url);
          alert('Cannot extract text from Chrome internal pages. Please try on a regular webpage!');
          return;
        }
        
        console.log('Sending message to tab:', tab.id);
        // Send message to content script
        chrome.tabs.sendMessage(tab.id, { action: 'extractText' }, (response) => {
          console.log('Response received:', response);
          
          // Check for errors
          if (chrome.runtime.lastError) {
            console.error('Error:', chrome.runtime.lastError.message);
            alert('Error: Content script not ready. Try refreshing the page and try again.');
            return;
          }
          
          // Check if response is valid
          if (response && response.success && response.text) {
            console.log('=== EXTRACTED TEXT ===');
            console.log(response.text);
            console.log('======================');
            console.log(`Total characters: ${response.text.length}`);
            alert(`Success! Extracted ${response.text.length} characters! Check console for full text.`);
          } else {
            console.error('Invalid response:', response);
            alert('Failed to extract text from page');
          }
        });
      });
    });
  } else {
    console.error('Extract button not found in popup HTML!');
  }
});