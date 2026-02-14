// Background service worker
console.log('Extension background script loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  
  // Handle different message types here
  if (request.action === 'example') {
    sendResponse({ success: true });
  }
  
  return true; // Keep message channel open for async responses
});
