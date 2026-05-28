# MeetingMind AI 🧠

> Your AI teammate for productive teams — built for hackathons, designed to win.

## Features

- 📋 **Meeting Transcript Analysis** — Paste any transcript, get summaries, action items, decisions & risks instantly
- ⚡ **Catch Me Up** — AI summarizes everything you missed while you were away
- ◈ **Team Chat Summarizer** — Get an AI digest of team conversations
- 📊 **Productivity Dashboard** — Live view of all actions, risks, and team activity
- ✅ **Action Item Tracker** — Track who's doing what and when

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6 |
| Styling | CSS Variables, custom design system |
| AI | OpenRouter via API |
| State | React Context API |
| Animations | CSS keyframes |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm start

# 3. Open http://localhost:3000
# 4. Go to Settings and add your OpenAI API key
```

## Getting an API Key

1. Go to [openrouter.ai/workspaces/default/keys](https://openrouter.ai/workspaces/default/keys)
2. Create a new secret key
3. Paste it in MeetingMind Settings page

## Project Structure

```
meetingmind/
├── public/
│   └── index.html
├── src/
│   ├── index.js          # Entry point
│   ├── index.css         # Global styles & design tokens
│   ├── App.js            # Router setup
│   ├── context/
│   │   └── AppContext.js # Global state + OpenAI calls
│   ├── components/
│   │   └── Layout.js     # Sidebar navigation
│   └── pages/
│       ├── Dashboard.js      # Main overview
│       ├── MeetingUpload.js  # Upload & analyze transcripts
│       ├── MeetingDetail.js  # Full meeting analysis view
│       ├── CatchMeUp.js      # AI catch-up generator
│       ├── TeamChat.js       # Chat + AI summarizer
│       └── Settings.js       # API key & config
└── package.json
```

## How to Demo (Hackathon Tips)

1. **Load the sample transcript** on the Upload page — instant wow factor
2. **Show the Dashboard** first — judges love the clean data overview
3. **Use Catch Me Up** — most relatable feature for any professional
4. **Highlight action item tracking** — solves a real problem everyone has

---

Built with ❤️ using React + OpenRouter AI
