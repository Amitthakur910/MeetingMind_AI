import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

const SAMPLE_MEETINGS = [
  {
    id: '1',
    title: 'Q1 Product Roadmap Review',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    duration: '52 min',
    participants: ['Priya S.', 'Rahul M.', 'Aditya K.', 'Sneha T.'],
    status: 'analyzed',
    summary: 'The team reviewed Q1 progress against OKRs and aligned on the new feature prioritization framework. Key decisions were made around the mobile-first strategy and the delayed launch of the analytics dashboard.',
    actionItems: [
      { id: 'a1', text: 'Finalize mobile wireframes for onboarding flow', assignee: 'Priya S.', deadline: new Date(Date.now() + 86400000 * 3).toISOString(), priority: 'high', done: false },
      { id: 'a2', text: 'Set up A/B testing infrastructure for homepage', assignee: 'Rahul M.', deadline: new Date(Date.now() + 86400000 * 7).toISOString(), priority: 'medium', done: false },
      { id: 'a3', text: 'Write technical spec for analytics dashboard v2', assignee: 'Aditya K.', deadline: new Date(Date.now() + 86400000 * 5).toISOString(), priority: 'high', done: true },
      { id: 'a4', text: 'Coordinate with marketing on Q2 launch calendar', assignee: 'Sneha T.', deadline: new Date(Date.now() + 86400000 * 10).toISOString(), priority: 'low', done: false },
    ],
    risks: [
      { text: 'Analytics dashboard delay may impact Q2 investor demo', severity: 'high' },
      { text: 'Mobile dev capacity stretched — only 2 engineers assigned', severity: 'medium' },
    ],
    keyDecisions: [
      'Postpone analytics dashboard launch to Q2',
      'Adopt mobile-first design strategy across all new features',
      'Weekly sync cadence increased to 3x per week for engineering',
    ],
    transcript: `Priya: Alright everyone, let's kick off the Q1 roadmap review. Rahul, can you start with the engineering update?\n\nRahul: Sure. So we've completed the core API refactor, which is a huge win. The mobile team is about 60% done with the new onboarding flow. The analytics dashboard, however — we're running about two weeks behind.\n\nAditya: The delay on analytics is on my radar. I think we need to push it to Q2 and be honest with stakeholders.\n\nPriya: Agreed. Let's make that call official. Sneha, can you loop in marketing so they adjust the launch calendar?\n\nSneha: On it. I'll set up a sync with them this week.\n\nPriya: Great. One more thing — I want us to formally commit to mobile-first as a design principle going forward, not just for this sprint. All new features should be designed mobile-first.\n\nAll: Agreed.`,
  },
  {
    id: '2',
    title: 'Sprint Planning — Week 18',
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    duration: '38 min',
    participants: ['Rahul M.', 'Aditya K.', 'Dev Team'],
    status: 'analyzed',
    summary: 'Sprint 18 planning session. Team committed to 34 story points. Focus areas: API performance optimization, bug fixes from QA backlog, and beginning work on notification system.',
    actionItems: [
      { id: 'b1', text: 'Optimize database queries for user listing endpoint', assignee: 'Aditya K.', deadline: new Date(Date.now() + 86400000 * 2).toISOString(), priority: 'high', done: false },
      { id: 'b2', text: 'Fix payment flow crash on Android 13', assignee: 'Dev Team', deadline: new Date(Date.now() + 86400000 * 1).toISOString(), priority: 'high', done: false },
      { id: 'b3', text: 'Draft notification system architecture doc', assignee: 'Rahul M.', deadline: new Date(Date.now() + 86400000 * 6).toISOString(), priority: 'medium', done: false },
    ],
    risks: [
      { text: 'Payment crash affects 12% of Android users — needs immediate fix', severity: 'high' },
    ],
    keyDecisions: [
      'Committed to 34 story points for Sprint 18',
      'Payment crash is P0 — top priority over all planned work',
    ],
    transcript: `Rahul: Let's start with velocity. Last sprint was 31 points. Can we stretch to 34?\n\nAditya: If we don't get blocked on QA, yes.\n\nRahul: Alright. Top priority — the payment crash on Android 13. QA confirmed it affects about 12% of Android users. That's a P0.\n\nDev Team: We can have a fix by tomorrow EOD.\n\nRahul: Perfect. Next, DB optimization. Aditya, that user listing query is timing out for enterprise accounts.\n\nAditya: I'll get that done by Wednesday.\n\nRahul: And let's start scoping the notification system. I'll write the arch doc this week.`,
  },
];

const SAMPLE_CHAT_MESSAGES = [
  { id: 1, sender: 'Priya S.', time: '9:02 AM', text: 'Morning team! Quick reminder — the investor demo is this Friday at 3pm IST.', avatar: 'PS' },
  { id: 2, sender: 'Rahul M.', time: '9:14 AM', text: 'Got it. The API rate limits have been bumped up. Should be smooth for the demo.', avatar: 'RM' },
  { id: 3, sender: 'Aditya K.', time: '9:31 AM', text: 'I\'ve prepared the analytics mock data. Sneha, can you review the dashboard slides?', avatar: 'AK' },
  { id: 4, sender: 'Sneha T.', time: '10:05 AM', text: 'On it! Will have feedback by noon. Also — the marketing launch blog post is ready for review.', avatar: 'ST' },
  { id: 5, sender: 'Priya S.', time: '10:22 AM', text: 'Perfect. Everyone please update your Jira tickets before the demo so we look good 😄', avatar: 'PS' },
  { id: 6, sender: 'Rahul M.', time: '11:45 AM', text: 'Android payment crash fix is live in staging. QA please verify before EOD.', avatar: 'RM' },
  { id: 7, sender: 'Dev Team', time: '12:30 PM', text: 'Verified and approved. Shipping to prod at 2pm.', avatar: 'DT' },
  { id: 8, sender: 'Aditya K.', time: '2:10 PM', text: 'Payment fix is live on prod. Issue resolved ✅', avatar: 'AK' },
  { id: 9, sender: 'Sneha T.', time: '2:45 PM', text: 'Blog post is updated. Rahul — the notification system doc needs your sign-off.', avatar: 'ST' },
  { id: 10, sender: 'Rahul M.', time: '3:00 PM', text: 'Signing off on it now. Great work everyone, solid day!', avatar: 'RM' },
];

// OpenRouter config — swap model slug here if needed
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL   = 'openai/gpt-4o';            // or 'anthropic/claude-3.5-sonnet', etc.
const OPENROUTER_SITE_URL = 'http://localhost:3000';   // shown in openrouter.ai/activity
const OPENROUTER_SITE_NAME = 'MeetingMind AI';

export function AppProvider({ children }) {
  const [apiKey, setApiKey] = useState(localStorage.getItem('openrouter_key') || '');
  const [meetings, setMeetings] = useState(SAMPLE_MEETINGS);
  const [chatMessages] = useState(SAMPLE_CHAT_MESSAGES);
  const [isProcessing, setIsProcessing] = useState(false);

  const saveApiKey = useCallback((key) => {
    setApiKey(key);
    localStorage.setItem('openrouter_key', key);
  }, []);

  const addMeeting = useCallback((meeting) => {
    setMeetings(prev => [meeting, ...prev]);
  }, []);

  const updateMeeting = useCallback((id, updates) => {
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  const toggleActionItem = useCallback((meetingId, actionId) => {
    setMeetings(prev => prev.map(m => {
      if (m.id !== meetingId) return m;
      return {
        ...m,
        actionItems: m.actionItems.map(a =>
          a.id === actionId ? { ...a, done: !a.done } : a
        )
      };
    }));
  }, []);

  const callOpenAI = useCallback(async (messages, systemPrompt) => {
    const key = apiKey || localStorage.getItem('openrouter_key');
    if (!key) throw new Error('OpenRouter API key not set. Go to Settings to add your key.');

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        'HTTP-Referer': OPENROUTER_SITE_URL,
        'X-Title': OPENROUTER_SITE_NAME,
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'OpenRouter API error');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }, [apiKey]);

  const analyzeMeeting = useCallback(async (transcript, title) => {
    const systemPrompt = `You are MeetingMind AI, an expert meeting analyst. Analyze the meeting transcript and return a JSON object with EXACTLY this structure (no markdown, pure JSON):
{
  "summary": "2-3 sentence summary of the meeting",
  "keyDecisions": ["decision 1", "decision 2"],
  "actionItems": [
    {"text": "action item description", "assignee": "Person Name or 'Team'", "deadline": "3 days", "priority": "high|medium|low"}
  ],
  "risks": [
    {"text": "risk description", "severity": "high|medium|low"}
  ],
  "sentiment": "positive|neutral|mixed|tense",
  "topics": ["topic1", "topic2", "topic3"]
}`;

    const content = await callOpenAI(
      [{ role: 'user', content: `Meeting Title: ${title}\n\nTranscript:\n${transcript}` }],
      systemPrompt
    );

    const clean = content.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  }, [callOpenAI]);

  const generateCatchMeUp = useCallback(async (days) => {
    const recentMeetings = meetings.slice(0, 3);
    const recentChats = chatMessages.slice(-10);

    const systemPrompt = `You are MeetingMind AI. You help team members catch up on what they missed. Be warm, concise, and action-oriented. Format your response in clear sections.`;

    const content = await callOpenAI(
      [{
        role: 'user',
        content: `I was away for ${days} days. Summarize what happened:

MEETINGS:
${recentMeetings.map(m => `- ${m.title}: ${m.summary}
  Action items: ${m.actionItems.map(a => a.text).join(', ')}`).join('\n')}

TEAM CHAT (recent messages):
${recentChats.map(c => `${c.sender}: ${c.text}`).join('\n')}

Give me:
1. TL;DR (2-3 sentences)
2. What I need to know
3. My pending action items
4. What needs my immediate attention`
      }],
      systemPrompt
    );

    return content;
  }, [meetings, chatMessages, callOpenAI]);

  const summarizeChat = useCallback(async () => {
    const systemPrompt = `You are MeetingMind AI. Summarize the team chat conversation. Return JSON with: {"summary": "...", "keyPoints": ["..."], "decisions": ["..."], "followUps": ["..."]}`;

    const chatText = chatMessages.map(c => `${c.sender}: ${c.text}`).join('\n');
    const content = await callOpenAI(
      [{ role: 'user', content: `Summarize this team chat:\n${chatText}` }],
      systemPrompt
    );

    const clean = content.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  }, [chatMessages, callOpenAI]);

  return (
    <AppContext.Provider value={{
      apiKey, saveApiKey,
      meetings, addMeeting, updateMeeting, toggleActionItem,
      chatMessages,
      isProcessing, setIsProcessing,
      callOpenAI, analyzeMeeting, generateCatchMeUp, summarizeChat,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
