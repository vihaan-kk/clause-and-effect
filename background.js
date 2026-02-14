// import './api/backboard.js';
// import './api/gemini.js';

// Background service worker
console.log('Extension background script loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  
  if (request.action === 'analyzeCurrentPage') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        console.error('No active tab found');
        return;
      }
      
      // Check if the URL is supported (not chrome://, chrome-extension://, etc.)
      const url = tabs[0].url;
      if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('edge://')) {
        console.error('Cannot inject content script into this page:', url);
        return;
      }
      
      chrome.tabs.sendMessage(tabs[0].id, { action: 'extractText' }, (response) => {
        // Check for errors
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError.message);
          return;
        }
        
        if (response && response.text) {
          console.log('Extracted text:', response.text.substring(0, 100) + '...');
        }
      });
    });
  }
  
  return true;
});