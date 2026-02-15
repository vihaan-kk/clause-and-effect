# Project Structure Guide: Clause and Effect

## Overview
**Clause and Effect** is a Chrome extension that analyzes legal documents (TOS, contracts, privacy policies) and provides risk scoring, flag detection, and plain English summaries using Google Gemini AI and Backboard.io memory.

**Current State:** Early MVP foundation - Extension framework is complete but core features are not yet implemented.

---

## Current File Structure

```
clause-and-effect/
├── manifest.json          # Chrome extension config (23 lines) ✅ COMPLETE
├── background.js          # Service worker template (20 lines) 🚧 NEEDS IMPLEMENTATION
├── content.js             # Content script template (14 lines) 🚧 NEEDS IMPLEMENTATION
├── content.css            # Panel styling (4 lines) 🚧 NEEDS IMPLEMENTATION
├── popup.html             # Settings UI (205 lines) ✅ COMPLETE
├── popup.js               # Settings logic (14 lines) 🚧 NEEDS IMPLEMENTATION
├── .env                   # API keys ✅ CONFIGURED
├── COPILOT_CONTEXT.md     # Technical specs (725 lines) ✅ REFERENCE DOC
└── README.md              # Documentation (279 lines) ✅ COMPLETE
```

---

## Where to Make Your Edits

### 1. Adding Core Features (API Integration)

**Goal:** Integrate Gemini AI and Backboard.io APIs

**Files to Create:**
- `api/gemini.js` - Gemini API wrapper with prompt templates
- `api/backboard.js` - Backboard.io client for memory/RAG

**Files to Edit:**
- `background.js` - Import and orchestrate API calls
  ```javascript
  // Add imports for API wrappers
  import { analyzeWithGemini } from './api/gemini.js';
  import BackboardAPI from './api/backboard.js';
  ```

**Reference:** See COPILOT_CONTEXT.md lines 215-244 (Gemini implementation) and lines 310-334 (Backboard implementation)

---

### 2. Implementing Text Extraction

**Goal:** Extract legal text from web pages and PDFs

**Files to Create:**
- `utils/extractor.js` - Text extraction utilities
  - `extractPageText()` - Cleans web page HTML
  - `extractPDFText()` - Parses PDF documents
  - `getSelectedText()` - Captures user selection

**Files to Edit:**
- `content.js` - Call extraction functions when user triggers analysis
- `manifest.json` - May need to add PDF.js library permission

**Reference:** See COPILOT_CONTEXT.md lines 342-391 (extraction strategies)

---

### 3. Building Risk Scoring & Flag Detection

**Goal:** Analyze legal clauses and calculate risk scores

**Files to Create:**
- `utils/analyzer.js` - Risk scoring algorithms
  - Calculate 0-100 risk score based on dangerous clauses
  - Detect red flags (critical issues)
  - Detect yellow flags (concerns)

**Integration Point:**
- Called by `background.js` after Gemini returns analysis
- Augments Gemini's response with additional scoring logic

**Reference:** See COPILOT_CONTEXT.md lines 35-98 (risk rating algorithm and flag categories)

---

### 4. Creating the Analysis UI Panel

**Goal:** Display analysis results as an injected sliding panel

**Files to Edit:**
- `content.css` - Complete styling for the analysis panel
  - Risk score gauge
  - Color-coded flags (red/yellow)
  - Collapsible sections
  - Action buttons

- `content.js` - Inject and populate the panel with analysis data
  - Create DOM elements for the panel
  - Display risk score, summary, flags
  - Add interactivity (highlight clauses, copy, export)

**Reference:** See COPILOT_CONTEXT.md lines 397-440 (UI/UX design spec)

---

### 5. Adding Context Menu Integration

**Goal:** Allow users to right-click and analyze documents

**Files to Edit:**
- `manifest.json` - Add `contextMenus` permission
  ```json
  "permissions": ["activeTab", "storage", "contextMenus"]
  ```

- `background.js` - Create context menu item
  ```javascript
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: 'simplify-legal',
      title: 'Simplify Legal Document',
      contexts: ['page', 'selection']
    });
  });
  ```

**Reference:** See COPILOT_CONTEXT.md lines 144-151 (user interaction flow)

---

### 6. Implementing Settings & API Key Management

**Goal:** Allow users to configure API keys and preferences

**Files to Edit:**
- `popup.js` - Add functionality to:
  - Save API keys to Chrome storage (`chrome.storage.sync`)
  - Validate API keys
  - Display usage statistics
  - Load saved settings on popup open

**Current State:** Popup UI is styled but not functional

**Reference:** See popup.html for existing UI structure

---

### 7. Adding Clause Highlighting

**Goal:** Highlight flagged clauses directly on the webpage

**Files to Create:**
- `utils/highlighter.js` - Page highlighting logic
  - Find specific clause text on page
  - Apply yellow/red background styling
  - Scroll to flagged sections

**Files to Edit:**
- `content.js` - Call highlighter when user clicks "Highlight on Page"
- `content.css` - Define `.clause-highlight-red` and `.clause-highlight-yellow` styles

**Reference:** See COPILOT_CONTEXT.md lines 438-439

---

### 8. Adding PDF Support

**Goal:** Analyze PDF documents in addition to web pages

**Files to Add:**
- `libs/pdf.min.js` - PDF.js library (download from Mozilla)

**Files to Edit:**
- `utils/extractor.js` - Implement `extractPDFText()` function
- `manifest.json` - Add script reference if needed
- `content.js` - Detect PDF pages and trigger PDF extraction

**Reference:** See COPILOT_CONTEXT.md lines 369-383 (PDF extraction)

---

## 24-HOUR HACKATHON IMPLEMENTATION PLAN 🚀

**Goal:** Working demo with API integration, basic UI, and Backboard.io bonus points

---

### Step 1: Create API Directory & Gemini Integration (2-3 hours)
**Priority: CRITICAL - Core functionality**

**Create: `api/gemini.js`**
- Copy prompt template from COPILOT_CONTEXT.md:159-213
- Implement `analyzeWithGemini(text)` function
- Use fetch API with Gemini endpoint
- Parse JSON response (handle markdown wrapping)
- Test with sample TOS text using console logs

**Key implementation points:**
```javascript
// Load API key from environment or Chrome storage
const GEMINI_KEY = 'your-key-from-env';

// Main analysis function
async function analyzeWithGemini(text) {
  // POST to: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
  // Return parsed JSON with: riskScore, summary, redFlags, yellowFlags, negotiationAdvice
}
```

**Files affected:**
- Create: `api/gemini.js` (new directory needed)
- Reference: COPILOT_CONTEXT.md:216-244

---

### Step 2: Create Backboard.io Integration (1-2 hours)
**Priority: HIGH - Bonus points feature**

**Create: `api/backboard.js`**
- Implement BackboardAPI class with methods:
  - `store()` - Save document analysis
  - `query()` - Retrieve past analyses
  - `semanticSearch()` - Find similar clauses (RAG)
- Use Backboard.io API endpoint with Authorization header

**Key implementation points:**
```javascript
class BackboardAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.backboard.io/v1';
  }

  async store(collection, document) { /* ... */ }
  async query(collection, filter) { /* ... */ }
  async semanticSearch(collection, query, topK) { /* ... */ }
}

export default BackboardAPI;
```

**Files affected:**
- Create: `api/backboard.js`
- Reference: COPILOT_CONTEXT.md:310-334

---

### Step 3: Update Background Service Worker (1 hour)
**Priority: CRITICAL - Orchestration layer**

**Edit: `background.js`**
- Import API wrappers (add `type="module"` to manifest if needed)
- Create context menu item for "Simplify Legal Doc"
- Add message listener to receive text from content script
- Call Gemini API with extracted text
- Store results in Backboard.io
- Return analysis to content script

**Key implementation points:**
```javascript
import { analyzeWithGemini } from './api/gemini.js';
import BackboardAPI from './api/backboard.js';

// Create context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'simplify-legal',
    title: 'Simplify Legal Document',
    contexts: ['page', 'selection']
  });
});

// Handle analysis requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyze') {
    analyzeDocument(request.text).then(sendResponse);
    return true; // Keep channel open for async response
  }
});

async function analyzeDocument(text) {
  const analysis = await analyzeWithGemini(text);
  // Store in Backboard
  await backboardClient.store('user-analyses', {
    url: sender.tab.url,
    riskScore: analysis.riskScore,
    timestamp: Date.now()
  });
  return analysis;
}
```

**Files affected:**
- Edit: `background.js`
- Edit: `manifest.json` (add `contextMenus` to permissions, ensure service worker can use modules)

---

### Step 4: Implement Text Extraction (1-2 hours)
**Priority: HIGH - Data gathering**

**Create: `utils/extractor.js`**
- Implement `extractPageText()` - Clean web page HTML
- Implement `getSelectedText()` - Capture user selections
- Remove noise (scripts, styles, nav, footer)
- Handle truncation for large documents (>30k chars)

**Key implementation points:**
```javascript
export function extractPageText() {
  const clone = document.body.cloneNode(true);
  clone.querySelectorAll('script, style, nav, header, footer').forEach(el => el.remove());
  let text = clone.innerText.replace(/\n{3,}/g, '\n\n').trim();

  if (text.length > 30000) {
    text = text.substring(0, 30000) + '\n[Truncated...]';
  }

  return text;
}

export function getSelectedText() {
  return window.getSelection().toString().trim();
}
```

**Edit: `content.js`**
- Import extractor functions
- Listen for context menu clicks
- Extract text and send to background.js
- Handle response and trigger UI display

**Files affected:**
- Create: `utils/extractor.js` (new directory)
- Edit: `content.js`
- Reference: COPILOT_CONTEXT.md:342-391

---

### Step 5: Build Analysis Panel UI (2-3 hours)
**Priority: HIGH - Demo visibility**

**Edit: `content.css`**
- Create sliding panel styles (fixed position, right side)
- Risk score gauge with color coding
- Red/yellow flag sections with severity indicators
- Collapsible sections
- Action buttons (Highlight, Copy, Export)

**Edit: `content.js`**
- Create panel DOM structure dynamically
- Inject panel into page when analysis completes
- Populate with results (risk score, summary, flags)
- Add slide-in animation
- Handle panel close button

**Key implementation points:**
```javascript
function createAnalysisPanel(analysis) {
  const panel = document.createElement('div');
  panel.id = 'legalese-panel';
  panel.innerHTML = `
    <div class="panel-header">
      <h2>⚖️ Legalese Analysis</h2>
      <button class="close-btn">×</button>
    </div>
    <div class="risk-score" style="background: ${getRiskColor(analysis.riskScore)}">
      RISK SCORE: ${analysis.riskScore}/100
    </div>
    <div class="summary">${analysis.summary}</div>
    <!-- Red flags, yellow flags, etc. -->
  `;
  document.body.appendChild(panel);
}

function getRiskColor(score) {
  if (score < 31) return '#10b981'; // Green
  if (score < 61) return '#f59e0b'; // Yellow
  if (score < 86) return '#f97316'; // Orange
  return '#ef4444'; // Red
}
```

**Files affected:**
- Edit: `content.css` (major additions)
- Edit: `content.js` (UI injection logic)
- Reference: COPILOT_CONTEXT.md:397-440

---

### Step 6: Connect the Full Flow (1 hour)
**Priority: CRITICAL - End-to-end testing**

**Integration checklist:**
- [ ] User right-clicks → Context menu appears
- [ ] Clicking menu triggers text extraction
- [ ] Content script sends text to background.js
- [ ] Background.js calls Gemini API
- [ ] Background.js stores in Backboard.io
- [ ] Results sent back to content script
- [ ] Panel appears with analysis
- [ ] Error handling for API failures

**Testing steps:**
1. Load extension in `chrome://extensions/` (developer mode)
2. Navigate to TikTok TOS or similar page
3. Right-click → Select "Simplify Legal Document"
4. Check console logs in content script and service worker
5. Verify panel appears with real data

**Files affected:**
- All files created/edited above
- Add error handling and loading states

---

### Step 7: Polish & Demo Prep (1-2 hours)
**Priority: MEDIUM - Presentation quality**

**Quick wins for demo:**
- Add loading spinner while analyzing
- Cache results (if same page analyzed twice, show cached)
- Add "Copy Analysis" button that copies summary to clipboard
- Test on 3-4 different documents (TikTok, Facebook, GitHub, Zoom)
- Prepare demo script (see COPILOT_CONTEXT.md:562-594)

**Optional if time allows:**
- Implement basic clause highlighting
- Complete popup.js settings save/load
- Add usage statistics to popup

---

## Implementation Order Summary

1. ✅ `api/gemini.js` - Core AI analysis
2. ✅ `api/backboard.js` - Memory/RAG (bonus points!)
3. ✅ `background.js` - Orchestration + context menu
4. ✅ `utils/extractor.js` - Text extraction
5. ✅ `content.js` - Extraction triggers + panel injection
6. ✅ `content.css` - Panel styling
7. ✅ Integration testing
8. ✅ Demo polish

**Total estimated time: 10-14 hours** (leaves buffer for debugging/testing)

---

## Critical Files Reference

| File | Current Status | Next Steps |
|------|---------------|------------|
| `manifest.json` | ✅ Complete | Add `contextMenus` permission later |
| `background.js` | 🚧 Template only | Add API orchestration, context menu |
| `content.js` | 🚧 Template only | Add text extraction, panel injection |
| `content.css` | 🚧 Minimal | Design full analysis panel styles |
| `popup.js` | 🚧 Demo button only | Implement settings save/load |
| `api/gemini.js` | ❌ Doesn't exist | **CREATE FIRST** - Core feature |
| `api/backboard.js` | ❌ Doesn't exist | **CREATE SECOND** - Memory layer |
| `utils/extractor.js` | ❌ Doesn't exist | **CREATE THIRD** - Text extraction |
| `utils/analyzer.js` | ❌ Doesn't exist | Optional - Gemini handles most analysis |

---

## Quick Start: Your First Edit

**If you want to start implementing features:**

1. **Create the Gemini API wrapper:**
   - Create file: `api/gemini.js`
   - Copy template from COPILOT_CONTEXT.md lines 216-244
   - Load API key from `.env`

2. **Update background.js:**
   - Import Gemini wrapper
   - Add message listener that calls Gemini
   - Return results to content script

3. **Test:**
   - Load extension in Chrome (`chrome://extensions/`)
   - Check service worker console logs
   - Send test message from popup

**If you want to modify the UI:**
- Edit `popup.html` for settings UI changes
- Edit `content.css` for analysis panel styling
- Edit `content.js` to inject/update panel DOM

---

## Important Notes

- The `.env` file contains your API keys - keep this secure
- `COPILOT_CONTEXT.md` is your **technical blueprint** - reference it constantly
- All directories (`api/`, `utils/`, `icons/`, `libs/`) need to be created
- Extension must be reloaded in Chrome after each code change

---

---

## Verification & Testing

### End-to-End Test Flow
1. **Load Extension**
   - Go to `chrome://extensions/`
   - Enable Developer mode
   - Click "Load unpacked"
   - Select project folder

2. **Test Basic Flow**
   - Navigate to https://www.tiktok.com/legal/page/us/terms-of-service
   - Right-click anywhere on page
   - Verify "Simplify Legal Document" appears in context menu
   - Click menu item
   - Check content script console for extracted text
   - Check service worker console for API call logs

3. **Verify API Integration**
   - Confirm Gemini API returns JSON response
   - Verify response contains: riskScore, summary, redFlags, yellowFlags
   - Check Backboard.io storage confirmation
   - Ensure no CORS errors

4. **Verify UI Display**
   - Panel should slide in from right side
   - Risk score should display with appropriate color
   - Red flags section should show critical issues
   - Yellow flags section should show concerns
   - Close button should work

### Common Issues & Debugging

**Issue:** Context menu doesn't appear
- Check manifest.json has `contextMenus` permission
- Verify background.js creates menu on install
- Reload extension

**Issue:** API calls fail with CORS
- Chrome extensions can make cross-origin requests if permissions are set
- Check `host_permissions` in manifest
- Use background.js for API calls, not content.js

**Issue:** Content script can't receive messages
- Ensure message passing uses correct format
- Check sendResponse is called correctly
- Verify async callback returns `true`

**Issue:** JSON parsing fails
- Gemini may wrap JSON in markdown code blocks
- Use regex to extract JSON: `/\{[\s\S]*\}/`
- Add fallback parsing logic

### Test Documents

Suggested documents for testing (in order of complexity):

1. **GitHub TOS** (Low risk ~25/100) - Developer-friendly terms
2. **Spotify TOS** (Moderate risk ~45/100) - Standard consumer terms
3. **TikTok TOS** (High risk ~87/100) - Extensive data collection
4. **Facebook Privacy Policy** (High risk ~75/100) - Complex data usage

---

## Files Summary - Where You'll Make Your Edits

### NEW Files to Create:
| File | Purpose | Lines Est. | Priority |
|------|---------|-----------|----------|
| `api/gemini.js` | Gemini API integration | 80-100 | CRITICAL |
| `api/backboard.js` | Backboard.io client | 60-80 | HIGH |
| `utils/extractor.js` | Text extraction utilities | 40-60 | HIGH |

### EXISTING Files to Edit:
| File | Current State | Changes Needed | Priority |
|------|--------------|---------------|----------|
| `background.js` | 20 line template | Add API orchestration, context menu (~100 lines) | CRITICAL |
| `content.js` | 14 line template | Add extraction trigger, panel injection (~150 lines) | CRITICAL |
| `content.css` | 4 line placeholder | Add full panel styling (~200 lines) | HIGH |
| `manifest.json` | 23 lines complete | Add `contextMenus` permission (1 line) | MEDIUM |
| `popup.js` | 14 line demo | Optional: Add settings save/load (~50 lines) | LOW |

### REFERENCE Files (Read-only):
- `COPILOT_CONTEXT.md` - Your technical blueprint (725 lines)
- `.env` - API keys (DO NOT COMMIT to git)
- `README.md` - Project documentation

---

## Quick Reference: Key Code Locations

**Gemini Prompt Template:** COPILOT_CONTEXT.md:159-213
**Gemini API Implementation:** COPILOT_CONTEXT.md:216-244
**Backboard.io Examples:** COPILOT_CONTEXT.md:250-296
**Backboard.io API Wrapper:** COPILOT_CONTEXT.md:310-334
**Page Text Extraction:** COPILOT_CONTEXT.md:342-365
**UI Design Spec:** COPILOT_CONTEXT.md:397-440
**Color Scheme:** COPILOT_CONTEXT.md:429-434
**Error Handling:** COPILOT_CONTEXT.md:443-488
**Demo Script:** COPILOT_CONTEXT.md:562-594
