// Background service worker
console.log('Extension background script loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});