// Popup script for Clause & Effect Legal Document Analyzer
console.log('Popup script loaded');

// Storage management
async function getScanHistory() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['scanHistory'], (result) => {
      resolve(result.scanHistory || []);
    });
  });
}

async function saveScan(analysisData) {
  const history = await getScanHistory();
  history.push({
    timestamp: Date.now(),
    riskScore: analysisData.riskScore,
    documentType: analysisData.companyDocumentType || analysisData.documentType,
    riskLevel: analysisData.riskLevel
  });
  
  // Keep only last 100 scans
  if (history.length > 100) {
    history.shift();
  }
  
  await chrome.storage.local.set({ scanHistory: history });
  updateScanCount();
}

function updateScanCount() {
  getScanHistory().then(history => {
    document.getElementById('scan-count').textContent = history.length;
  });
}

// Display functions
function displayAnalysis(analysisData) {
  console.log('Displaying analysis:', analysisData);
  
  // Hide initial state
  document.getElementById('initial-state').style.display = 'none';
  
  // Show risk display
  const riskDisplay = document.getElementById('risk-display');
  riskDisplay.style.display = 'block';
  
  // Update document type (use companyDocumentType as title)
  document.getElementById('document-type').textContent = 
    (analysisData.companyDocumentType || analysisData.documentType || 'UNKNOWN').toUpperCase();
  
  // Update current risk score
  document.getElementById('current-risk').textContent = analysisData.riskScore || 0;
  document.getElementById('risk-level').textContent = 
    (analysisData.riskLevel || 'UNKNOWN').toUpperCase();
  
  // Update risk level color
  const riskLevelElement = document.getElementById('risk-level');
  const riskScore = analysisData.riskScore || 0;
  if (riskScore >= 70) {
    riskLevelElement.style.color = '#FF0000';
  } else if (riskScore >= 40) {
    riskLevelElement.style.color = '#FF6B35';
  } else {
    riskLevelElement.style.color = '#B8860B';
  }
  
  // Display felony warning (most critical red flag)
  if (analysisData.redFlags && analysisData.redFlags.length > 0) {
    const criticalFlag = analysisData.redFlags[0]; // First red flag is most critical
    const felonyWarning = document.getElementById('felony-warning');
    const felonyContent = document.getElementById('felony-content');
    
    felonyWarning.style.display = 'block';
    felonyContent.innerHTML = `<strong>${criticalFlag.clauseType || 'Critical Clause'}:</strong> ${criticalFlag.clause || criticalFlag.concern}`;
  }
  
  // Display summary
  if (analysisData.summary) {
    document.getElementById('summary-section').style.display = 'block';
    document.getElementById('summary-text').textContent = analysisData.summary;
  }
  
  // Display red flags
  displayFlags('red', analysisData.redFlags || []);
  
  // Display yellow flags
  displayFlags('yellow', analysisData.yellowFlags || []);
  
  // Display green flags
  displayFlags('green', analysisData.greenFlags || []);
  
  // Display negotiation advice
  if (analysisData.negotiationAdvice) {
    document.getElementById('negotiation-section').style.display = 'block';
    document.getElementById('negotiation-text').textContent = analysisData.negotiationAdvice;
  }
  
  // Show "Analyze Another" button
  document.getElementById('analyze-another-btn').style.display = 'block';
}

function displayFlags(type, flags) {
  const sectionId = `${type}-flags-section`;
  const listId = `${type}-flags-list`;
  const countId = `${type}-flags-count`;
  
  if (flags.length === 0) {
    document.getElementById(sectionId).style.display = 'none';
    return;
  }
  
  document.getElementById(sectionId).style.display = 'block';
  document.getElementById(countId).textContent = flags.length;
  
  const listElement = document.getElementById(listId);
  listElement.innerHTML = '';
  
  flags.forEach(flag => {
    const card = document.createElement('div');
    card.className = `flag-card ${type}`;
    
    const flagType = document.createElement('div');
    flagType.className = 'flag-type';
    flagType.textContent = flag.clauseType || flag.category || 'General';
    card.appendChild(flagType);
    
    const clause = document.createElement('div');
    clause.className = 'flag-clause';
    clause.textContent = flag.clause || flag.concern || 'No details provided';
    card.appendChild(clause);
    
    if (flag.concern && flag.clause !== flag.concern) {
      const concern = document.createElement('div');
      concern.className = 'flag-concern';
      concern.textContent = flag.concern;
      card.appendChild(concern);
    }
    
    listElement.appendChild(card);
  });
}

function showError(message) {
  const errorElement = document.getElementById('error-message');
  const errorText = document.getElementById('error-text');
  errorText.textContent = message;
  errorElement.style.display = 'block';
  
  setTimeout(() => {
    errorElement.style.display = 'none';
  }, 5000);
}

function resetUI() {
  document.getElementById('initial-state').style.display = 'flex';
  document.getElementById('risk-display').style.display = 'none';
  document.getElementById('felony-warning').style.display = 'none';
  document.getElementById('summary-section').style.display = 'none';
  document.getElementById('red-flags-section').style.display = 'none';
  document.getElementById('yellow-flags-section').style.display = 'none';
  document.getElementById('green-flags-section').style.display = 'none';
  document.getElementById('negotiation-section').style.display = 'none';
  document.getElementById('analyze-another-btn').style.display = 'none';
}

// Main analysis flow
async function performAnalysis() {
  console.log('Starting analysis...');
  
  // Show loading
  document.getElementById('initial-state').style.display = 'none';
  document.getElementById('loading').style.display = 'block';
  document.getElementById('analyze-btn').disabled = true;
  
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0];
    
    // Validation
    if (!tab) {
      hideLoading();
      showError('No active tab found');
      return;
    }
    
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://')) {
      hideLoading();
      showError('Cannot analyze Chrome internal pages. Please navigate to a regular webpage.');
      return;
    }
    
    // Extract text
    chrome.tabs.sendMessage(tab.id, { action: 'extractText' }, async (response) => {
      if (chrome.runtime.lastError) {
        hideLoading();
        showError('Content script not ready. Please refresh the page and try again.');
        return;
      }
      
      if (!response || !response.success || !response.text) {
        hideLoading();
        showError('Failed to extract text from page. The page might be empty or restricted.');
        return;
      }
      
      console.log('Text extracted:', response.text.length, 'characters');
      
      // Analyze with Gemini
      try {
        const analysisResult = await analyzeLegalDocument(response.text);
        
        hideLoading();
        
        if (analysisResult.success) {
          // Parse JSON response
          let analysisData;
          try {
            analysisData = JSON.parse(analysisResult.analysis);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            showError('Failed to parse analysis results. The AI response was not in the expected format.');
            return;
          }
          
          // Save to history
          await saveScan(analysisData);
          
          // Display results
          displayAnalysis(analysisData);
          
          console.log('Analysis complete!');
        } else {
          showError(`Analysis failed: ${analysisResult.error}`);
        }
      } catch (error) {
        hideLoading();
        console.error('Analysis error:', error);
        showError(`Error during analysis: ${error.message}`);
      }
    });
  });
}

function hideLoading() {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('initial-state').style.display = 'flex';
  document.getElementById('analyze-btn').disabled = false;
}

// PDF handling
async function extractTextFromPDF(file) {
  return new Promise(async (resolve, reject) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Check if PDF.js is loaded
      if (typeof pdfjsLib === 'undefined') {
        reject(new Error('PDF.js library not loaded. Please refresh the extension and try again.'));
        return;
      }
      
      // Load the PDF
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      console.log('PDF loaded, pages:', pdf.numPages);
      
      let fullText = '';
      
      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
      }
      
      resolve(fullText);
    } catch (error) {
      reject(error);
    }
  });
}

async function handlePDFUpload(file) {
  if (!file || file.type !== 'application/pdf') {
    showError('Please select a valid PDF file');
    return;
  }
  
  console.log('Processing PDF:', file.name);
  document.getElementById('pdf-filename').textContent = `Selected: ${file.name}`;
  
  // Show loading
  document.getElementById('initial-state').style.display = 'none';
  document.getElementById('loading').style.display = 'block';
  
  try {
    // Extract text from PDF
    const extractedText = await extractTextFromPDF(file);
    
    if (!extractedText || extractedText.trim().length === 0) {
      hideLoading();
      showError('No text found in PDF. The PDF might be image-based or empty.');
      return;
    }
    
    console.log('Text extracted from PDF:', extractedText.length, 'characters');
    
    // Analyze the extracted text
    const analysisResult = await analyzeLegalDocument(extractedText);
    
    hideLoading();
    
    if (analysisResult.success) {
      // Parse JSON response
      let analysisData;
      try {
        analysisData = JSON.parse(analysisResult.analysis);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        showError('Failed to parse analysis results. The AI response was not in the expected format.');
        return;
      }
      
      // Save to history
      await saveScan(analysisData);
      
      // Display results
      displayAnalysis(analysisData);
      
      console.log('PDF analysis complete!');
    } else {
      showError(`Analysis failed: ${analysisResult.error}`);
    }
  } catch (error) {
    hideLoading();
    console.error('PDF processing error:', error);
    showError(`Error processing PDF: ${error.message}`);
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  console.log('Popup loaded');
  
  // Update scan count on load
  updateScanCount();
  
  // Initialize PDF.js worker when available
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('lib/pdf.worker.min.js');
    console.log('PDF.js initialized');
  }
  
  // Analyze button
  document.getElementById('analyze-btn').addEventListener('click', performAnalysis);
  
  // PDF upload
  document.getElementById('pdf-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      handlePDFUpload(file);
    }
  });
  
  // Analyze another button
  document.getElementById('analyze-another-btn').addEventListener('click', () => {
    resetUI();
    // Reset file input
    document.getElementById('pdf-upload').value = '';
    document.getElementById('pdf-filename').textContent = '';
  });
});