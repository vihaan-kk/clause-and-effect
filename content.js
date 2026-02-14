// import { extractPageText, extractPageData } from './utils/extractor.js';

// Content script - runs on web pages
  console.log('Extension content script loaded');

// Function to extract page text
function extractPageText() {
  // Clone the body to avoid modifying the actual page
  const bodyClone = document.body.cloneNode(true);
  
  // Remove script, style, and other non-text elements
  const elementsToRemove = bodyClone.querySelectorAll('script, style, noscript, iframe, svg');
  elementsToRemove.forEach(el => el.remove());
  
  // Get the text content
  const text = bodyClone.innerText || bodyClone.textContent || '';
  
  // Clean up extra whitespace
  return text.trim().replace(/\s+/g, ' ');
}

// Function to extract selected text or page data
function extractPageData() {
  const selection = window.getSelection();
  return selection ? selection.toString() : '';
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received:', request);
    
    if (request.action === 'extractText') {
        console.log('Extracting text...');
        const data = extractPageText();
        console.log('Extracted text length:', data.length);
        console.log('Text preview:', data.substring(0, 100));
        sendResponse({ success: true, text: data });
    }
    else if (request.action === 'extractData') {
        const selectedText = extractPageData();
        sendResponse({ success: true, selectedText });
    }
    
      return true; // Keep message channel open for async responses
  });
