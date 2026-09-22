# YouTube Knowledge & Content Generator 🚀

> Turn any public YouTube video into structured executive notes and 5 actionable, original content ideas powered by Groq AI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![React](https://img.shields.io/badge/React-18-cyan)
![Vite](https://img.shields.io/badge/Vite-6-purple)
![Groq AI](https://img.shields.io/badge/Groq%20AI-qwen%2Fqwen3.8--27b-orange)

---

## 🌟 Features

- **Instant YouTube Transcript Fetching**: Automatically extracts transcripts from public YouTube videos, shorts, embeds, and live streams.
- **Executive Summaries**: Generates a 5–8 sentence high-level summary of key video concepts.
- **Key Takeaways & Structured Notes**: Formats core insights into digestible bullet points categorized by topic.
- **5 Original Content Ideas**: Converts video takeaways into ready-to-produce formats (Instagram Reels, YouTube Shorts, Threads, LinkedIn Posts, Blog Articles).
- **One-Click Copy**: Copy summaries, notes, or individual content hooks with a single click.
- **Privacy & Security First**: Keeps your `GROQ_API_KEY` on the backend server—never exposed to the client browser.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Lucide Icons, Modern CSS
- **Backend API**: Express.js, TypeScript, Zod Schema Validation
- **AI Engine**: Groq API using `qwen/qwen3.8-27b`
- **Transcript Extraction**: `youtube-transcript` library
- **Package Manager & Workspaces**: `pnpm` Monorepo

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- A free [Groq API Key](https://console.groq.com/)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/janhavinaidu/YouTube-Knowledge-Content.git
cd YouTube-Knowledge-Content
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the project root:

```env
GROQ_API_KEY=gsk_your_free_groq_api_key_here
GROQ_MODEL=qwen/qwen3.8-27b
```

### 4. Running Locally

Start the dev server (runs both API server and frontend concurrently):

```bash
pnpm dev
```

- **Frontend Application**: `http://localhost:5173`
- **API Server**: `http://localhost:5000`

---

## 📁 Repository Structure

```
YouTube-Knowledge-Content/
├── artifacts/
│   ├── api-server/           # Express backend handling YouTube fetching & Groq AI
│   └── youtube-knowledge/    # React + Vite frontend user interface
├── lib/
│   ├── api-client-react/     # Generated React Query API hooks
│   ├── api-spec/             # OpenAPI specification schema
│   └── api-zod/              # Zod validation schemas
├── .env                      # Local environment variables (Git ignored)
├── package.json              # Monorepo root scripts
└── pnpm-workspace.yaml       # Monorepo workspace config
```

---

## ⚠️ Known Limitations

- The video must be public and have captions/transcripts enabled.
- Extremely long transcripts are automatically truncated with a visual indicator to stay within model token limits.
- Subject to free-tier rate limits from Groq Cloud.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
