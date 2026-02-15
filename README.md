# Clause & Effect

**AI-powered Chrome Extension for Legal Document Analysis**

Hack_NCState2026 Project by Vihaan, Aadhya, and Vedant

---

## Overview

Clause & Effect is a Chrome extension that translates complex legal documents (Terms of Service, contracts, privacy policies) into plain English with AI-powered risk analysis, flag detection, and negotiation advice.

**Current Status:** 🚧 **Foundation Complete - Core Features In Development**

- ✅ Chrome extension framework configured
- ✅ Settings popup UI designed and styled
- ✅ API keys configured
- ✅ Technical specifications documented
- 🚧 API integration in progress
- 🚧 Text extraction needs implementation
- 🚧 Analysis panel UI needs implementation

Never unknowingly sign away your rights again!

---

## Features (Planned)

- 🎯 **Risk Score Analysis** - 0-100 risk rating for any legal document
- 🚨 **Red Flag Detection** - Identifies critical issues like data selling, forced arbitration, IP rights transfer
- ⚠️ **Yellow Flag Warnings** - Highlights concerning but negotiable clauses
- 💡 **Negotiation Advice** - Get specific recommendations on what to push back on
- 🔍 **Plain English Summaries** - Understand what you're actually agreeing to
- 💾 **Memory Layer** - Remember past analyses with Backboard.io integration

---

## Tech Stack

- **Chrome Extension** (Manifest V3)
- **Google Gemini API** - AI-powered legal analysis (free tier: 1500 req/day)
- **Backboard.io API** - Memory layer and RAG for legal clause database
- **Vanilla JavaScript** - No frameworks for maximum performance

---

## Current Project Structure

```
clause-and-effect/
├── manifest.json              # ✅ Extension configuration (complete)
├── background.js              # 🚧 Service worker template (needs implementation)
├── content.js                 # 🚧 Content script template (needs implementation)
├── content.css                # 🚧 Panel styling (minimal placeholder)
├── popup.html                 # ✅ Settings popup UI (complete)
├── popup.js                   # 🚧 Settings logic (needs implementation)
├── .env                       # ✅ API keys configured
├── COPILOT_CONTEXT.md         # ✅ Technical specifications (725 lines)
├── README.md                  # This file
└── IMPLEMENTATION_PLAN.md     # 24-hour hackathon implementation guide
```

### Files to Create:

```
api/
├── gemini.js                  # ❌ Gemini API wrapper (TO BE CREATED)
└── backboard.js               # ❌ Backboard.io client (TO BE CREATED)

utils/
├── extractor.js               # ❌ Text extraction utilities (TO BE CREATED)
├── analyzer.js                # ❌ Risk scoring logic (optional)
└── highlighter.js             # ❌ Clause highlighting (optional)
```

---

## Quick Start

### 1. Get API Keys

**Gemini API (Required):**
1. Visit [Google AI Studio](https://ai.google.dev/)
2. Create a new API key
3. Free tier: 1500 requests/day
4. Already configured in `.env`

**Backboard.io API (Recommended for bonus points):**
1. Visit [Backboard.io](https://backboard.io/)
2. Sign up and get your API key
3. Enables memory and comparative analysis features
4. Already configured in `.env`

### 2. Load the Extension (Current State)

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `clause-and-effect` folder

**Current Behavior:** Extension loads successfully but does not yet analyze documents (core features not implemented).

### 3. Implement Core Features

See **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** for the complete 24-hour hackathon implementation guide with:
- Step-by-step instructions
- Code examples and templates
- File-by-file breakdown
- Testing procedures
- Debugging tips

---

## Implementation Roadmap

### Priority 1: Core API Integration ⚡ CRITICAL

1. **Create `api/gemini.js`** - Gemini API wrapper
   - Implement `analyzeWithGemini(text)` function
   - Use prompt template from COPILOT_CONTEXT.md
   - Handle JSON response parsing

2. **Create `api/backboard.js`** - Backboard.io client
   - Implement `store()`, `query()`, `semanticSearch()` methods
   - Enable memory/RAG features

3. **Update `background.js`** - Service worker orchestration
   - Import API wrappers
   - Create context menu item
   - Handle message passing

### Priority 2: Text Extraction 📄

4. **Create `utils/extractor.js`** - Text extraction
   - `extractPageText()` - Clean web page HTML
   - `getSelectedText()` - Capture user selections
   - Handle large documents (>30k chars)

5. **Update `content.js`** - Content script
   - Trigger extraction on context menu click
   - Send extracted text to background worker

### Priority 3: UI Display 🎨

6. **Update `content.css`** - Analysis panel styling
   - Sliding panel layout (right side)
   - Risk score gauge with color coding
   - Red/yellow flag sections

7. **Update `content.js`** - Panel injection
   - Create DOM structure dynamically
   - Populate with analysis results
   - Add interactivity (close, copy, export)

### Priority 4: Polish ✨

8. **Update `popup.js`** - Settings functionality (optional)
   - Save API keys to Chrome storage
   - Display usage statistics

9. **Testing** - End-to-end validation
   - Test on multiple documents (TikTok, GitHub, Facebook TOS)
   - Verify API integration
   - Debug common issues

---

## How It Will Work (When Complete)

1. User navigates to a legal document webpage
2. User right-clicks → Selects "Simplify Legal Document"
3. `content.js` extracts text from the page
4. Text sent to `background.js` service worker
5. `background.js` calls Gemini API for analysis
6. Analysis stored in Backboard.io for memory
7. Results sent back to `content.js`
8. Sliding panel appears with risk score, flags, and advice

---

## Risk Score Guide

- **0-30 (Green)** - Consumer-friendly, low risk
- **31-60 (Yellow)** - Standard terms, some concerns
- **61-85 (Orange)** - Unfavorable, multiple red flags
- **86-100 (Red)** - Predatory, dangerous terms

---

## Testing Documents (When Ready)

Test the extension on these documents (in order of complexity):

1. **GitHub TOS** - Low risk (~25/100), developer-friendly
2. **Spotify TOS** - Moderate risk (~45/100), standard consumer terms
3. **TikTok TOS** - High risk (~87/100), extensive data collection
4. **Facebook Privacy Policy** - High risk (~75/100), complex data usage

---

## Development Resources

- **[COPILOT_CONTEXT.md](COPILOT_CONTEXT.md)** - Comprehensive technical specifications (725 lines)
  - Gemini prompt templates (lines 159-213)
  - Gemini API implementation guide (lines 216-244)
  - Backboard.io examples (lines 250-296)
  - Text extraction strategies (lines 342-391)
  - UI/UX design spec (lines 397-440)
  - Error handling patterns (lines 443-488)

- **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** - Step-by-step hackathon guide
  - 7 prioritized implementation steps
  - Time estimates (10-14 hours total)
  - Code templates and examples
  - Testing and debugging guide

---

## Debugging

**View Console Logs:**

1. **Service Worker Logs:**
   - Go to `chrome://extensions/`
   - Find "Clause and Effect"
   - Click "Inspect views: background page"

2. **Content Script Logs:**
   - Open any webpage
   - Right-click → Inspect → Console

**Common Issues:**

- **Extension not loading**: Check manifest.json syntax at jsonlint.com
- **Context menu not appearing**: Verify `contextMenus` permission in manifest.json
- **API calls fail**: Check API keys in `.env` file
- **CORS errors**: Use background.js for API calls (not content.js)
- **JSON parsing fails**: Gemini may wrap JSON in markdown code blocks

---

## Security Notes

⚠️ **Development/Hackathon Setup:**
- API keys are stored in `.env` file
- This is acceptable for hackathon/demo purposes
- Do NOT commit `.env` to public repositories

🔒 **For Production:**
- Implement proper API key management
- Use Chrome storage with encryption
- Consider backend proxy for API calls
- Add rate limiting and usage tracking

---

## Project Timeline

- **Day 0 (Current):** Foundation complete, core features ready for implementation
- **Day 1:** API integration + text extraction + basic UI
- **Day 2:** Polish, testing, demo preparation
- **Demo Day:** Present working MVP at Hack_NCState2026

**Estimated Implementation Time:** 10-14 hours (with buffer for debugging)

---

## Contributing

This is a hackathon project for Hack_NCState2026. Team members:
- **Vihaan** - [Role/Focus]
- **Aadhya** - [Role/Focus]
- **Vedant** - [Role/Focus]

---

## License

MIT License - See LICENSE file for details

---

## Acknowledgments

- Google Gemini API for AI-powered analysis
- Backboard.io for memory and RAG capabilities
- Chrome Extensions documentation and community
- All the legal documents we never actually read... until now!

---

**Team:** Vihaan, Aadhya, Vedant
**Event:** Hack_NCState2026
**Status:** 🚧 Foundation Complete - Implementation In Progress
**Built with:** ☕ Coffee, 💻 Code, and ⚖️ Justice
