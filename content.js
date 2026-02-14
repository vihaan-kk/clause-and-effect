// Content script - runs on web pages
console.log('Extension content script loaded');

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received:', request);
  
  // Handle different message types here
  if (request.action === 'example') {
    sendResponse({ success: true });
  }
  
  return true;
