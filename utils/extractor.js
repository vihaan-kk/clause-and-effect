// Return a string of just the policy text
function extractPageText() {
    // Use gemini API to extract specific policy text from the current page
    const clone = document.body.cloneNode(true);
    
    // Remove noisy elements
  const noiseSelectors = [
    'script', 'style', 'nav', 'header', 
    'footer', 'iframe', 'noscript', 'aside'
  ];
  noiseSelectors.forEach(selector => {
    clone.querySelectorAll(selector).forEach(el => el.remove());
  });

  let text = clone.innerText;

  text = text.replace(/\n{3,}/g, '\n\n');  // Max 2 newlines
  text = text.replace(/[ \t]{2,}/g, ' ');   // Single spaces
  text = text.trim();

  return text;
}
export function getSelectedText(){
    return window.getSelection().toString().trim();
}

export function extractPageData(){
    return {
        text: extractPageText(),
        title: document.title,
        url: window.location.href,
        timestamp: Date.now()
    };
}

// No AI needed - can be implemented later
// function extractPDFText() {

// }

// function getSelectedText() {

// }