# Clause & Effect

**AI-powered Chrome Extension for Legal Document Analysis**

Hack_NCState2026 Project by Vihaan, Aadhya, and Vedant.

## Overview

Clause & Effect is a Chrome extension that uses Google's Gemini AI to analyze legal documents directly in your browser. Navigate to any legal document (terms of service, privacy policy, contract, etc.) and get instant AI-powered analysis highlighting key clauses, risk assessments, and concerning terms.

## Features

- 🔍 **One-click Analysis**: Analyze any legal document on any webpage
- 🤖 **AI-Powered**: Uses Google Gemini Pro for intelligent document analysis
- ⚠️ **Risk Assessment**: Automatically identifies risk levels (Low/Medium/High)
- 📋 **Key Clauses**: Extracts and highlights the most important clauses
- 🎯 **Concerning Terms**: Flags potentially unfavorable or risky terms
- 📊 **Document Summaries**: Provides clear, concise summaries of legal documents

## File Structure

```
├── manifest.json           # Extension configuration
├── background.js           # Background service worker
├── content.js              # Content script (runs on web pages, extracts text)
├── content.css             # Styles for content script
├── popup.html              # Extension popup UI
├── popup.js                # Popup logic and analysis orchestration
├── api/
│   └── gemini.js          # Gemini API integration (contains API key)
├── prompts/
│   └── legal-analysis.txt # Legal analysis prompt template
└── utils/
    ├── extractor.js       # Text extraction utilities
    ├── prompts.js         # Prompt loader (loads .txt files)
    └── analyzer.js        # Legal document analysis logic
```

## How It Works

1. **Text Extraction** (`content.js`): Extracts clean text from the current webpage
2. **Analysis Request** (`popup.js`): User clicks "Analyze Current Page" button
3. **Prompt Loading** (`utils/prompts.js`): Loads prompt template from `prompts/legal-analysis.txt`
4. **Prompt Generation**: Replaces `{{LEGAL_TEXT}}` placeholder with actual extracted text
5. **AI Analysis** (`utils/analyzer.js`): Sends complete prompt to Gemini AI via API
6. **Results Display** (`popup.html`): Shows formatted analysis results in the popup

## Customizing Prompts

Prompts are stored as plain text files in the `prompts/` directory:

- **Edit existing prompts**: Open `prompts/legal-analysis.txt` and modify the prompt text
- **Use placeholders**: Use `{{LEGAL_TEXT}}` where you want the extracted text inserted
- **Add new prompts**: Create new `.txt` files in `prompts/` directory and load them using `loadPromptTemplate('your-prompt-name')`

No need to edit JavaScript code - just modify the text files and reload the extension!

## Setup

1. Clone this repository
2. Add your Gemini API key to `.env` file (already configured)
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" (toggle in top right)
5. Click "Load unpacked"
6. Select this folder

Your extension is now loaded!

## Usage

1. Navigate to any legal document webpage (e.g., terms of service, privacy policy)
2. Click the Clause & Effect extension icon in your Chrome toolbar
3. Click "Analyze Current Page"
4. Wait a few seconds while AI analyzes the document
5. Review the analysis results including:
   - Document type identification
   - Key clauses
   - Risk assessment
   - Concerning terms
   - Summary

## Development

### API Key Configuration

The Gemini API key is stored in:

- `.env` file (for reference)
- Hardcoded in `utils/analyzer.js` (Chrome extensions can't read .env files directly)

**Security Note**: For production, implement proper API key management. Current setup is for hackathon/demo purposes.

### Architecture

- **Content Script**: Runs on all web pages to extract text when requested
- **Popup**: User interface for triggering analysis and viewing results
- **Background Worker**: Minimal event handling (can be extended for future features)
- **Analyzer**: Contains the AI analysis logic using Gemini API

## Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/mv3/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)

---

**Team:** Vihaan, Aadhya, Vedant  
**Event:** Hack_NCState2026

## Overview

Clause and Effect is a Chrome extension that translates complex legal documents (Terms of Service, contracts, privacy policies) into plain English with AI-powered risk analysis, flag detection, and negotiation advice.

**Current Status:** ✅ Demo mode - Extension UI fully functional with mock data  
**Backend:** Ready for you to integrate (see [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md))

Never unknowingly sign away your rights again!

## Features

- 🎯 **Risk Score Analysis** - 0-100 risk rating for any legal document
- 🚨 **Red Flag Detection** - Identifies critical issues like data selling, forced arbitration, IP rights transfer
- ⚠️ **Yellow Flag Warnings** - Highlights concerning but negotiable clauses
- 💡 **Negotiation Advice** - Get specific recommendations on what to push back on
- 🔍 **Plain English Summaries** - Understand what you're actually agreeing to
- 💾 **Memory Layer** - Remember past analyses with Backboard.io integration

## Tech Stack

- **Chrome Extension** (Manifest V3)
- **Gemini API** - AI-powered legal analysis
- **Backboard.io API** - Memory layer and RAG for legal clause database
- **Vanilla JavaScript** - No frameworks for maximum performance

## Project Structure

```
clause-and-effect/
├── manifest.json              # Extension configuration
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
└── icons/
    ├── generator.html        # Icon generator tool
    └── README.md            # Icon creation instructions
```

## Setup Instructions

### 1. Get API Keys

**Gemini API (Required):**

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Create a new API key
3. Free tier: 1500 requests/day

**Backboard.io API (Optional but Recommended):**

1. Visit [Backboard.io](https://backboard.io/)
2. Sign up and get your API key
3. Enables memory and comparative analysis features

### 2. Create Icons

Before loading the extension, you need to create the icons:

1. Open `icons/generator.html` in your browser
2. Right-click on each canvas and "Save Image As"
3. Save them in the `icons/` folder as:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

See [icons/README.md](icons/README.md) for detailed instructions.

### 2. Load the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `clause-and-effect` folder
5. The extension should now appear in your extensions list

### 3. Test the Extension (Demo Mode)

1. Navigate to any webpage with text (try a Terms of Service page)
2. Right-click anywhere on the page
3. Select "Simplify Legal Document" from the context menu
4. See the demo analysis panel appear with mock data!

### 4. Add Your Backend (Optional)

The extension works in demo mode with mock data. To integrate your backend:

1. Read [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md)
2. Replace the mock data in [background.js](background.js) with your API calls
3. Test and deploy!

API keys can be stored in the extension popup, but they won't be used until you add your backend code.

## How to Use

1. Navigate to any webpage with a Terms of Service, Privacy Policy, or legal document
2. Right-click anywhere on the page
3. Select "Simplify Legal Document" from the context menu
4. Wait for the AI analysis to complete
5. Review the risk score, flags, and negotiation advice in the sliding panel

### What Gets Analyzed

The extension can analyze:

- Terms of Service (TOS)
- Privacy Policies
- User Agreements
- Contracts
- End User License Agreements (EULA)
- Any other legal document on a webpage

## Risk Score Guide

- **0-30 (Green)** - Consumer-friendly, low risk
- **31-60 (Yellow)** - Standard terms, some concerns
- **61-85 (Orange)** - Unfavorable, multiple red flags
- **86-100 (Red)** - Predatory, dangerous terms

## Development

### File Explanations

**Core Extension Files:**

- `manifest.json` - Chrome extension configuration and permissions
- `background.js` - Service worker that handles API calls and orchestration
- `content.js` - Injected script that extracts text and displays UI
- `content.css` - Styling for the analysis panel

**API Wrappers:**

- `api/gemini.js` - Handles Gemini API communication and prompt engineering
- `api/backboard.js` - Manages Backboard.io memory and RAG features

**Utilities:**

- `utils/extractor.js` - Text extraction from web pages and PDFs
- `utils/analyzer.js` - Risk scoring algorithms and analysis logic
- `utils/highlighter.js` - Clause highlighting on the page

**Settings:**

- `popup.html` - Extension settings popup UI
- `popup.js` - Settings management and statistics tracking

### Testing Recommendations

Test the extension on these documents:

- TikTok TOS (high risk - extreme data collection)
- Facebook Privacy Policy (complex data usage)
- GitHub TOS (low risk - developer-friendly)
- Zoom TOS (AI training concerns)
- Your gym membership agreement (hidden fees)

### Debugging

**View Console Logs:**

1. Go to `chrome://extensions/`
2. Find "Clause and Effect"
3. Click "Inspect views: background page" for service worker logs
4. Right-click on any page → Inspect → Console for content script logs

**Common Issues:**

- **Extension not loading**: Check manifest.json syntax at jsonlint.com
- **API not working**: Verify API keys in extension settings
- **Panel not appearing**: Check browser console for JavaScript errors
- **CORS errors**: Make sure you're using Chrome extension APIs, not direct fetch

## Roadmap

### MVP Features (Completed)

- ✅ Text extraction from web pages
- ✅ Gemini API integration
- ✅ Risk score calculation
- ✅ Red/yellow flag detection
- ✅ Settings popup
- ✅ Chrome extension scaffold

### Next Steps

- 🚧 Backboard.io memory integration
- 🚧 PDF document support
- 🚧 Clause highlighting on page
- 🚧 Export analysis to PDF
- 🚧 Comparative analysis features

### Future Ideas

- Browser notification for TOS changes
- Bookmarklet version for non-Chrome browsers
- Multi-language support
- Crowdsourced clause database
- Email alerts for documents you've analyzed

## Contributing

This is a hackathon project for Hack_NCState2026. Contributions, suggestions, and feedback are welcome!

## License

MIT License - See LICENSE file for details

## Acknowledgments

- Google Gemini API for AI-powered analysis
- Backboard.io for memory and RAG capabilities
- Chrome Extensions API documentation
- All the legal documents we never actually read

---

**Team:** Vihaan, Aadhya, Vedant  
**Event:** Hack_NCState2026  
**Built with:** ☕ Coffee and 💻 Code
