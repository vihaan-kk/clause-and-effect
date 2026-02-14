# COPILOT CONTEXT: Legalese Simplifier Project

## PROJECT OVERVIEW
Build an AI-powered Chrome extension that translates legal documents (TOS, contracts, privacy policies) into plain English with risk analysis, flag detection, and negotiation advice.

**Timeline**: 24 hours (hackathon)
**Primary Goal**: Working demo with Backboard.io integration (bonus points)

---

## TECH STACK

### Required Technologies:
- **Chrome Extension** (Manifest V3, unpacked/developer mode)
- **Gemini API** (free tier: 1500 req/day) - PRIMARY AI MODEL
- **Backboard.io API** - Memory layer + RAG for legal clause database
- **PDF.js** - For PDF document parsing
- **Vanilla JavaScript** - No frameworks (faster for hackathon)

### API Endpoints:
```javascript
// Gemini API
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
Header: x-goog-api-key: YOUR_KEY

// Backboard.io API  
POST https://api.backboard.io/v1/
Header: Authorization: Bearer YOUR_KEY
```

---

## CORE FEATURES (Priority Order)

### 1. Risk Rating (0-100 scale) ⭐ MUST HAVE
**Algorithm Factors**:
- Unilateral termination rights
- Binding arbitration clauses
- Jurisdiction restrictions
- Data usage/selling rights
- Automatic renewals
- Liability limitations
- IP rights transfers
- Indemnification clauses
- Privacy violations
- Hidden fees/charges
- Class action waivers
- Consent to monitoring
- Unilateral modification rights
- Unreasonable restrictions

**Scoring Logic**:
- 0-30: Consumer-friendly, low risk
- 31-60: Standard terms, some concerns
- 61-85: Unfavorable, multiple red flags
- 86-100: Predatory, dangerous terms

### 2. Flag Highlighting ⭐ MUST HAVE

**RED FLAGS (Critical)** - Deal breakers:
- Waiving fundamental legal rights
- Unlimited liability exposure
- Forced arbitration with no opt-out
- Automatic IP ownership transfer
- Cannot delete data
- Surveillance/monitoring consent
- Class action waiver
- Unrestricted data selling

**YELLOW FLAGS (Concerns)** - Negotiable issues:
- Vague terminology
- One-sided clauses
- Privacy concerns
- Hidden fees
- Short cancellation windows
- Automatic renewals
- Broad indemnification
- Restrictive NDAs

**Output Format for Each Flag**:
```javascript
{
  clause: "exact text from document",
  concern: "why this is problematic",
  location: "Section 4.2" or "paragraph 15",
  severity: 1-10,
  category: "privacy|financial|legal|data|terms"
}
```

### 3. Negotiation Advice ⭐ MUST HAVE
**Provide**:
- Top 3-5 must-fix items (prioritized)
- Suggested alternative language for each
- Leverage points ("Industry standard is...")
- Email template for pushback
- "Walk away" threshold advice

---

## CHROME EXTENSION ARCHITECTURE

### File Structure:
```
legalese-simplifier/
├── manifest.json              # Extension config (Manifest V3)
├── background.js              # Service worker - API orchestration
├── content.js                 # Page injection - text extraction, UI
├── content.css                # Styling for injected panel
├── popup.html                 # Extension popup - settings
├── popup.js                   # Settings logic
├── api/
│   ├── gemini.js             # Gemini API wrapper
│   └── backboard.js          # Backboard.io API wrapper
├── utils/
│   ├── extractor.js          # Text extraction (web + PDF)
│   ├── analyzer.js           # Risk scoring logic
│   └── highlighter.js        # In-page clause highlighting
├── libs/
│   └── pdf.min.js            # PDF.js library
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### Key Extension Components:

**manifest.json** - Permissions needed:
```json
{
  "manifest_version": 3,
  "permissions": ["activeTab", "scripting", "storage", "contextMenus"],
  "host_permissions": ["<all_urls>"],
  "background": {"service_worker": "background.js"},
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "css": ["content.css"]
  }]
}
```

**User Interaction Flow**:
1. User right-clicks on page → Context menu "Simplify Legal Doc"
2. Content script extracts text from page/selection
3. Sends to background worker
4. Background calls Gemini API → gets analysis
5. Background calls Backboard.io → stores + retrieves context
6. Content script displays sliding panel with results
7. User can highlight flags on page, copy analysis, export

---

## GEMINI API INTEGRATION

### Prompt Engineering (CRITICAL)

**Main Analysis Prompt Template**:
```
You are an expert contract lawyer. Analyze this legal document thoroughly.

IMPORTANT: Return response as valid JSON only. No markdown, no code blocks, no preamble.

Required JSON structure:
{
  "riskScore": <number 0-100>,
  "riskLevel": "<Low|Moderate|High|Critical>",
  "summary": "<2-3 sentence plain English summary>",
  "redFlags": [
    {
      "clause": "<exact quoted text>",
      "concern": "<why dangerous>",
      "location": "<section reference>",
      "severity": <1-10>,
      "category": "<privacy|financial|legal|data|terms>"
    }
  ],
  "yellowFlags": [<same structure>],
  "negotiationAdvice": {
    "mustFix": ["<priority item 1>", "<item 2>", "<item 3>"],
    "suggestedLanguage": [
      {
        "original": "<problematic clause>",
        "suggested": "<better alternative>",
        "rationale": "<why this is better>"
      }
    ],
    "leveragePoints": ["<argument 1>", "<argument 2>"],
    "walkAwayThreshold": "<when to reject deal>"
  },
  "keyTerms": {
    "termination": "<how/when can terminate>",
    "dataUsage": "<what they do with data>",
    "liability": "<who is liable for what>",
    "modifications": "<can they change terms?>",
    "jurisdiction": "<where disputes handled>"
  }
}

Scoring criteria for riskScore:
- Data selling/sharing: +15-25 points
- Forced arbitration: +10-20 points
- Class action waiver: +10-15 points
- Unilateral termination: +10-15 points
- IP rights transfer: +15-25 points
- Unlimited liability: +20-30 points
- No data deletion: +10-15 points
- Auto-renewal no cancel: +10-15 points

DOCUMENT TEXT:
{documentText}
```

### API Call Implementation:
```javascript
async function analyzeWithGemini(text) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: PROMPT_TEMPLATE.replace('{documentText}', text) }]
        }],
        generationConfig: {
          temperature: 0.3,  // Lower = more consistent
          maxOutputTokens: 4096,
          topP: 0.8,
          topK: 40
        }
      })
    }
  );
  
  const data = await response.json();
  const textResponse = data.candidates[0].content.parts[0].text;
  
  // Parse JSON (handle potential markdown wrapping)
  const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch[0]);
}
```

---

## BACKBOARD.IO INTEGRATION

### Use Cases:

**1. Document Memory** - Remember past analyses:
```javascript
// Store analysis
await backboard.store({
  collection: 'user-analyses',
  document: {
    id: documentHash,
    url: currentUrl,
    title: documentTitle,
    riskScore: analysis.riskScore,
    redFlags: analysis.redFlags,
    timestamp: Date.now(),
    userId: userId
  }
});

// Retrieve history
const history = await backboard.query({
  collection: 'user-analyses',
  filter: { userId: userId },
  limit: 10
});
```

**2. Legal Clause Database (RAG)** - Find similar problematic clauses:
```javascript
// Store known bad clauses
await backboard.store({
  collection: 'legal-clauses',
  document: {
    clause: "We may modify these terms at any time without notice",
    category: "unilateral-modification",
    severity: 8,
    commonIn: ["SaaS", "Social Media"],
    betterAlternative: "We will notify you 30 days before any material changes"
  }
});

// Query similar clauses
const similar = await backboard.semanticSearch({
  collection: 'legal-clauses',
  query: extractedClause,
  topK: 5
});
```

**3. Comparative Analysis** - Compare to user's history:
```javascript
// "You accepted better terms from Spotify"
const comparison = {
  current: currentAnalysis,
  previous: await backboard.query({
    collection: 'user-analyses',
    filter: { category: 'music-streaming' }
  })
};
```

### Backboard API Wrapper:
```javascript
class BackboardAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.backboard.io/v1';
  }
  
  async store(collection, document) {
    // Store document with vector embeddings
  }
  
  async query(collection, filter) {
    // Retrieve documents
  }
  
  async semanticSearch(collection, query, topK = 5) {
    // RAG - find similar content
  }
  
  async getContext(userId) {
    // Get full user context
  }
}
```

---

## TEXT EXTRACTION STRATEGIES

### Web Page Extraction:
```javascript
function extractPageText() {
  // Clone body to avoid modifying live page
  const clone = document.body.cloneNode(true);
  
  // Remove noise
  clone.querySelectorAll('script, style, nav, header, footer, iframe, noscript').forEach(el => el.remove());
  
  // Get clean text
  let text = clone.innerText;
  
  // Clean whitespace
  text = text.replace(/\n{3,}/g, '\n\n').trim();
  
  // Preserve structure hints
  const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
    .map(h => h.innerText);
  
  // Limit size (Gemini token limits)
  if (text.length > 30000) {
    text = text.substring(0, 30000) + '\n\n[Document truncated...]';
  }
  
  return { text, headings, url: window.location.href };
}
```

### PDF Extraction:
```javascript
async function extractPDFText(file) {
  const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += `\n--- Page ${i} ---\n${pageText}`;
  }
  
  return fullText;
}
```

### Selection Extraction:
```javascript
function getSelectedText() {
  const selection = window.getSelection();
  return selection.toString().trim();
}
```

---

## UI/UX DESIGN

### Sliding Panel (Injected into Page):
```
┌─────────────────────────────────────┐
│  ⚖️ Legalese Analysis          [×]  │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │      RISK SCORE: 73/100     │   │
│  │         🔴 HIGH RISK         │   │
│  └─────────────────────────────┘   │
│                                     │
│  📝 Summary:                        │
│  This TOS grants broad data rights │
│  and limits your legal options...  │
│                                     │
│  🚨 RED FLAGS (3)                   │
│  ┌─────────────────────────────┐   │
│  │ "We may sell your data..."  │   │
│  │ 📍 Section 4.2              │   │
│  │ ⚠️ Severity: 9/10            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ⚠️ YELLOW FLAGS (5)               │
│  [Collapsible sections...]         │
│                                     │
│  💡 NEGOTIATION ADVICE              │
│  • Request data deletion rights    │
│  • Push back on arbitration        │
│                                     │
│  [Highlight on Page] [Copy] [PDF]  │
└─────────────────────────────────────┘
```

### Color Scheme:
- **Green** (0-30): #10b981
- **Yellow** (31-60): #f59e0b
- **Orange** (61-85): #f97316
- **Red** (86-100): #ef4444

### Animations:
- Risk score gauge fills on load
- Flags slide in one by one
- Highlight clauses on page with yellow/red background
- Smooth scrolling to flagged sections

---

## ERROR HANDLING

### Common Errors to Handle:

**1. API Failures**:
```javascript
try {
  const analysis = await analyzeWithGemini(text);
} catch (error) {
  if (error.status === 429) {
    // Rate limit - show cached result or retry
  } else if (error.status === 401) {
    // Invalid API key
  } else {
    // Generic error - show user-friendly message
  }
}
```

**2. Large Documents**:
```javascript
// Split into chunks if > 30k chars
if (text.length > 30000) {
  const chunks = splitIntoChunks(text, 30000);
  const analyses = await Promise.all(chunks.map(analyzeWithGemini));
  const merged = mergeAnalyses(analyses);
}
```

**3. Malformed Input**:
```javascript
// Validate before sending
if (!text || text.length < 100) {
  throw new Error('Document too short to analyze');
}
```

**4. JSON Parsing**:
```javascript
// Gemini might wrap JSON in markdown
function extractJSON(response) {
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid response format');
  return JSON.parse(jsonMatch[0]);
}
```

---

## PERFORMANCE OPTIMIZATION

### Caching Strategy:
```javascript
// Cache analyses by document hash
const docHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
const cached = await chrome.storage.local.get(docHash);

if (cached && Date.now() - cached.timestamp < 86400000) {
  // Use cached result (24hr expiry)
  return cached.analysis;
}
```

### Request Batching:
```javascript
// Batch multiple small analyses
const queue = [];
const BATCH_SIZE = 5;

function addToQueue(text) {
  queue.push(text);
  if (queue.length >= BATCH_SIZE) {
    processBatch();
  }
}
```

### Progressive Loading:
```javascript
// Show results as they come in
async function analyzeProgressive(text) {
  showLoadingState();
  
  // Quick analysis first (risk score only)
  const quickAnalysis = await getQuickScore(text);
  updateUI({ riskScore: quickAnalysis.score });
  
  // Detailed analysis
  const fullAnalysis = await getFullAnalysis(text);
  updateUI(fullAnalysis);
}
```

---

## TESTING DOCUMENTS

### Must-Test On:
1. **TikTok TOS** - Extreme data collection
2. **Zoom TOS** - AI training controversy
3. **Facebook Privacy Policy** - Complex data usage
4. **GitHub TOS** - Developer-friendly (low risk)
5. **Robinhood TOS** - Financial disclaimers
6. **Apartment Lease** - Real-world contract
7. **Gym Membership** - Hidden fees/auto-renewal
8. **Credit Card Agreement** - Dense legal language

### Test Cases:
- ✅ Short document (1 page)
- ✅ Long document (50+ pages)
- ✅ PDF upload
- ✅ Selected text only
- ✅ Non-English text (error handling)
- ✅ Malformed HTML
- ✅ Rate limiting (rapid requests)
- ✅ Offline mode

---

## DEMO SCRIPT

### 3-Minute Demo Flow:

**1. Hook (15 sec)**:
"Raise your hand if you've actually read a Terms of Service. Nobody does. We click 'Agree' to everything. Let me show you why that's dangerous."

**2. Problem Demo (45 sec)**:
[Navigate to TikTok TOS]
"This is TikTok's TOS. 16,000 words. Would take 45 minutes to read. Let's see what we're actually agreeing to..."
[Right-click → Simplify Legal Doc]

**3. Solution Demo (90 sec)**:
[Panel appears]
"In 15 seconds, our AI found:
- Risk Score: 87/100 - CRITICAL
- 12 red flags including:
  • TikTok can sell your data to anyone
  • You give them unlimited IP rights to your content
  • Forced arbitration - you can't sue
  
Here's the plain English: 'You're giving TikTok ownership of everything you post, they can sell your personal data, and you have no legal recourse.'

Our AI even suggests how to push back:
[Show negotiation advice]"

**4. Technology (30 sec)**:
"Powered by Google Gemini for analysis and Backboard.io for memory - it remembers what you've agreed to before and warns you when terms get worse."

**5. Vision (15 sec)**:
"Imagine: never unknowingly signing away your rights again. That's our mission."

---

## DEVELOPMENT PRIORITIES

### MVP (Minimum Viable Product):
1. ✅ Text extraction from web pages
2. ✅ Gemini API integration with good prompts
3. ✅ Risk score calculation
4. ✅ Red flag detection
5. ✅ Basic UI panel
6. ✅ Chrome extension working (unpacked)

### Nice-to-Have (if time):
- ⭐ Backboard.io memory integration
- ⭐ PDF support
- ⭐ Highlight clauses on page
- ⭐ Negotiation advice
- ⭐ Export to PDF
- ⭐ Comparative analysis

### Stretch Goals:
- 🚀 Bookmarklet version
- 🚀 Multi-language support
- 🚀 Crowdsourced flag database
- 🚀 Email alerts for TOS changes

---

## CODING CONVENTIONS

### Style:
- Use async/await (not promises)
- ES6+ features (arrow functions, destructuring)
- Descriptive variable names
- Comments on complex logic only

### Example Code Style:
```javascript
// Good
async function analyzeDocument(text) {
  const { riskScore, flags } = await callGeminiAPI(text);
  return { riskScore, flags };
}

// Bad
function analyze(t) {
  return new Promise((resolve) => {
    callAPI(t).then(r => resolve(r));
  });
}
```

---

## DEBUGGING TIPS

### Chrome Extension Debugging:
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" → select project folder
4. Click "Inspect views: background page" for service worker logs
5. Right-click on page → Inspect → Console for content script logs

### Common Issues:
- **CORS errors**: Use Chrome extension permissions, not fetch from web page
- **Manifest errors**: Validate JSON at jsonlint.com
- **API key not working**: Check it's not rate limited
- **Content script not injecting**: Check matches in manifest
- **Storage not persisting**: Use chrome.storage.sync not localStorage

---

## RESOURCES & LINKS

### API Documentation:
- Gemini API: https://ai.google.dev/tutorials/rest_quickstart
- Backboard.io: https://docs.backboard.io
- Chrome Extensions: https://developer.chrome.com/docs/extensions/mv3/

### Example Projects:
- Similar extension: Plainly Legal (for reference, don't copy)
- TOS;DR (Terms of Service; Didn't Read) - inspiration

### Libraries:
- PDF.js: https://mozilla.github.io/pdf.js/
- DOMPurify: For sanitizing extracted HTML

---

## FINAL CHECKLIST

Before demo:
- [ ] Extension loads without errors
- [ ] API keys are set (not hardcoded!)
- [ ] Tested on 3+ real documents
- [ ] UI is responsive and polished
- [ ] Error messages are user-friendly
- [ ] Demo flow is practiced
- [ ] README has setup instructions
- [ ] GitHub repo is public
- [ ] Backboard.io integration is visible in demo
- [ ] Have backup plan if internet fails

---

## COPILOT PROMPTS TO USE

When coding, ask Copilot:

1. "Create a Chrome extension manifest.json with context menu support for Manifest V3"

2. "Write a function to extract clean text from a webpage, removing scripts, styles, and navigation"

3. "Build a Gemini API wrapper function that sends a prompt and returns parsed JSON response with error handling"

4. "Create a Backboard.io client class with methods for storing and retrieving document analyses"

5. "Design a sliding panel UI component that displays risk scores and color-coded flags"

6. "Write a risk scoring algorithm that analyzes legal clauses and returns 0-100 score"

7. "Implement text highlighting that finds and highlights specific clauses on the current webpage"

8. "Create a Chrome extension settings popup with API key input and validation"

9. "Build a PDF text extractor using PDF.js that handles multi-page documents"

10. "Write unit tests for the risk scoring algorithm with sample legal clauses"

---

Use this context to build the complete project. Ask Copilot to generate specific components as you work through the 24-hour plan!
