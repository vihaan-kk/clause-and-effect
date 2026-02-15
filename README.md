# Clause & Effect

**AI-powered Chrome Extension for Legal Document Analysis**

**Theme: Urban Noir**

**Track: Siren's Call**

**Challenge: Gemini API Integration**

Hack_NCState2026 Project by Vihaan Kerekatte, Aadhya Mittapalli, and Vedant Chaudhari

---

## Overview

Clause & Effect is a Chrome extension that analyzes legal documents — Terms of Service, privacy policies, contracts, and agreements — directly from live web pages or uploaded PDFs using Google's Gemini AI. It assigns a 0–100 risk score, flags concerning clauses by severity (red / yellow / green), provides a plain-English summary, and offers negotiation advice.

Never unknowingly sign away your rights again.

---

## Features

- **Risk Score (0–100)** — Calculated with a detailed rubric: critical issues (+15–20 pts), high-risk clauses (+10–14 pts), moderate concerns (+5–9 pts), minor issues (+1–4 pts)
- **Red / Yellow / Green Flags** — Each clause is categorized by severity with a short explanation
- **Plain English Summary** — 3 sentence overview of what the document actually says (legalese translation)
- **Negotiation Advice** — Actionable recommendations on what to push back on
- **PDF Upload** — Analyze any PDF document directly from the extension popup
- **Scan History** — Tracks your last 100 analyses using Chrome local storage

---

## Tech Stack

| Layer       | Technology                                  |
| ----------- | ------------------------------------------- |
| Platform    | Chrome Extension (Manifest V3)              |
| AI Model    | Google Gemini API(`gemini-3-flash-preview`) |
| PDF Parsing | PDF.js 3.11.174 (bundled locally)           |
| Storage     | `chrome.storage.local`                      |
| Language    | Vanilla JavaScript, HTML — no frameworks    |

---

## Project Structure

```
clause-and-effect/
├── manifest.json          # Extension config (Manifest V3)
├── popup.html             # Main UI — HTML + inline CSS
├── popup.js               # UI logic, PDF upload, display results
├── content.js             # Content script — extracts text from web pages
├── background.js          # Service worker (onInstalled listener)
├── config.js              # Your Gemini API key (gitignored)
├── config.example.js      # Template — copy to config.js
├── api/
│   └── gemini.js          # Gemini API wrapper (temperature 0.3)
├── utils/
│   ├── analyzer.js        # Orchestrates prompt building + API call
│   └── prompts.js         # Loads prompt templates from prompts/
├── prompts/
│   └── legal-analysis.txt # Detailed scoring rubric + output schema
├── lib/
│   ├── pdf.min.js         # PDF.js library
│   └── pdf.worker.min.js  # PDF.js web worker
├── media/
│   └── logo.png           # Extension icon
├── .gitignore
└── README.md
```

---

## Setup

### Prerequisites

- Google Chrome (or any Chromium-based browser)
- A Gemini API key from [Google AI Studio](https://ai.google.dev/) (free tier: 1,500 requests/day)

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/clause-and-effect.git
cd clause-and-effect
```

### 2. Configure Your API Key

```bash
cp config.example.js config.js
```

Open `config.js` and replace the placeholder with your actual key:

```javascript
const CONFIG = {
  GEMINI_API_KEY: "YOUR_GEMINI_API_KEY_HERE",
};
```

> `config.js` is gitignored and will never be committed.

### 3. Load the Extension in Chrome

1. Navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top right)
3. Click **Load unpacked**
4. Select the `clause-and-effect/` folder from your local machine

The Clause & Effect icon will appear in your browser toolbar. Click it to open the popup and start analyzing legal documents!

---

## Usage

### Analyze a Web Page

1. Navigate to any websites legal document(Terms of Service, Privacy Policy, etc.)
2. Click the **Clause & Effect** extension icon
3. Click **Analyze Current Page**
4. View the risk score, flags, summary, and negotiation advice

### Analyze a PDF

1. Click the extension icon
2. Click **Upload PDF** and select a PDF file of your legal document
3. Click **Analyze PDF**
4. Results appear in the same format as web page analysis

---

## How It Works

1. **Text Extraction** — The content script clones the page DOM, strips non-text elements (`script`, `style`, `noscript`, `iframe`, `svg`), and returns clean text. For PDFs, PDF.js extracts text client-side.
2. **Prompt Construction** — The extracted text is inserted into the scoring rubric template (`prompts/legal-analysis.txt`).
3. **AI Analysis** — The prompt is sent to Gemini with tuned parameters (`temperature: 0.3`, `topK: 20`, `topP: 0.85`) for consistent, reproducible scoring.
4. **Display** — The popup parses the JSON response and renders the risk score, flag cards, summary, and advice.

---

## Risk Score Guide

| Score  | Level    | Color  | Meaning                         |
| ------ | -------- | ------ | ------------------------------- |
| 0–20   | Minimal  | Green  | Very consumer-friendly          |
| 21–40  | Low      | Green  | Generally fair terms            |
| 41–60  | Moderate | Yellow | Some concerning clauses         |
| 61–80  | High     | Orange | Multiple red flags, unfavorable |
| 81–100 | Critical | Red    | Predatory or dangerous terms    |

---

## Debugging

### Extension Popup Console

1. Right-click the extension popup → **Inspect**
2. Check the Console tab for prompt/response debug logs and to see the prompt and response from Gemini

### Service Worker Logs

1. Go to `chrome://extensions/`
2. Find **Clause & Effect** → click **Inspect views: service worker**

### Content Script Logs

1. Open any webpage → right-click → **Inspect** → Console
2. Filter by `content script` messages

### Common Issues

| Problem                              | Fix                                                       |
| ------------------------------------ | --------------------------------------------------------- |
| Popup shows "API key not configured" | Ensure `config.js` exists and has a valid key             |
| "Cannot analyze this page"           | Extension cannot run on `chrome://` or `edge://` URLs     |
| Risk scores seem off                 | Check the console for the full prompt/response to debug   |
| PDF upload not working               | Ensure `lib/pdf.min.js` and `lib/pdf.worker.min.js` exist |
| API calls failing with 403 or 401    | Verify your Gemini API key and quota in Google AI Studio  |

---

## Security

- **API key** is stored in `config.js`, which is gitignored — never committed to version control
- `config.example.js` is the safe template checked into Git
- All API calls happen in the popup context (extension origin), not from content scripts

---

**Event:** Hack_NCState2026

---

## License

MIT License

---

To all the legal documents we blindly accepted... until now.