import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const SAMPLE_TRANSCRIPT = `Priya: Good morning everyone! Let's kick off our weekly product sync. First item — Rahul, can you give us the engineering update?

Rahul: Sure thing. We shipped the new authentication system last Tuesday, zero downtime. The API response times are down 40% after the caching layer went live. On the negative side, we found a memory leak in the background jobs — Aditya is leading the fix.

Aditya: Yeah, the fix is about 80% done. I'll have it in staging by Thursday and prod by Friday EOD.

Priya: Perfect. What's our risk there if it slips?

Aditya: If it slips past Friday, background email jobs could fail for enterprise users. We should alert customer success just in case.

Sneha: I'll reach out to Deepa on the CS team today and draft a contingency communication just in case.

Priya: Great proactive thinking. Now — the enterprise dashboard feature. Rahul, where does that stand?

Rahul: Design is finalized. Dev starts Monday. We're targeting a 3-week sprint to MVP.

Priya: Okay. We need to align that with the Nexus Corp pilot starting in 5 weeks. That gives us 2 weeks of QA buffer. That's tight but workable.

Aditya: I'll make sure the database schema is done by end of this week so Rahul's team can start clean on Monday.

Priya: Excellent. Last item — we need to decide on the pricing for the enterprise tier. Sneha, what's marketing's recommendation?

Sneha: Based on competitor analysis, we suggest $299/month for up to 50 users, $599 for unlimited. We could offer 20% off for annual commitments.

Priya: I like it. Let's go with that. Can you prepare the pricing page copy and run it by legal by Wednesday?

Sneha: Done.

Priya: Perfect. To summarize action items: Aditya ships the memory leak fix by Friday, Sneha loops in CS and drafts contingency comms today, Aditya finishes DB schema by Friday, Rahul's team starts enterprise dashboard Monday, and Sneha prepares pricing copy for legal by Wednesday. Any blockers?

All: No blockers.

Priya: Awesome. Talk next week, everyone!`;

export default function MeetingUpload() {
  const navigate = useNavigate();
  const { addMeeting, analyzeMeeting, apiKey } = useApp();

  const [title, setTitle] = useState('');
  const [transcript, setTranscript] = useState('');
  const [participants, setParticipants] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  const loadSample = () => {
    setTitle('Weekly Product Sync — Engineering & Growth');
    setTranscript(SAMPLE_TRANSCRIPT);
    setParticipants('Priya, Rahul, Aditya, Sneha');
    setDuration('45 min');
    toast.success('Sample transcript loaded!');
  };

  const handleAnalyze = useCallback(async () => {
    if (!title.trim()) { toast.error('Please enter a meeting title'); return; }
    if (!transcript.trim()) { toast.error('Please paste a meeting transcript'); return; }
    if (!apiKey) { toast.error('Set your OpenRouter API key in Settings first'); return; }

    setLoading(true);
    setLoadingMsg('Parsing transcript...');

    try {
      setTimeout(() => setLoadingMsg('Running AI analysis with GPT-4o...'), 1200);
      setTimeout(() => setLoadingMsg('Extracting action items & risks...'), 2800);
      setTimeout(() => setLoadingMsg('Building your meeting intelligence...'), 4500);

      const analysis = await analyzeMeeting(transcript, title);

      const participantList = participants
        .split(',')
        .map(p => p.trim())
        .filter(Boolean);

      const now = new Date();
      const newMeeting = {
        id: Date.now().toString(),
        title: title.trim(),
        date: now.toISOString(),
        duration: duration || 'Unknown',
        participants: participantList.length ? participantList : ['Team'],
        status: 'analyzed',
        transcript,
        summary: analysis.summary,
        keyDecisions: analysis.keyDecisions || [],
        actionItems: (analysis.actionItems || []).map((a, i) => ({
          id: `new-${Date.now()}-${i}`,
          text: a.text,
          assignee: a.assignee,
          deadline: a.deadline
            ? new Date(Date.now() + parseDays(a.deadline) * 86400000).toISOString()
            : null,
          priority: a.priority || 'medium',
          done: false,
        })),
        risks: analysis.risks || [],
        sentiment: analysis.sentiment,
        topics: analysis.topics || [],
      };

      addMeeting(newMeeting);
      toast.success('Meeting analyzed successfully!');
      navigate(`/meeting/${newMeeting.id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Analysis failed. Check your API key.');
    } finally {
      setLoading(false);
    }
  }, [title, transcript, participants, duration, apiKey, analyzeMeeting, addMeeting, navigate]);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Analyze Meeting</h1>
          <p style={styles.pageSub}>Paste your transcript — AI extracts everything automatically</p>
        </div>
        <button onClick={loadSample} className="btn btn-secondary">
          ⊡ Load Sample
        </button>
      </div>

      {/* Upload area */}
      <div style={styles.uploadCard}>
        <div style={styles.uploadIcon}>◎</div>
        <div style={styles.uploadTitle}>Paste Meeting Transcript</div>
        <div style={styles.uploadSub}>Supports raw text transcripts from Zoom, Teams, Google Meet, Otter.ai, and more</div>
      </div>

      <div style={styles.formGrid}>
        {/* Left: Metadata */}
        <div style={styles.metaCol}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Meeting Title *</label>
            <input
              className="input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Q2 Sprint Planning"
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Participants</label>
            <input
              className="input"
              value={participants}
              onChange={e => setParticipants(e.target.value)}
              placeholder="e.g. Priya, Rahul, Aditya"
            />
            <span style={styles.fieldHint}>Comma-separated names</span>
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Duration</label>
            <input
              className="input"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="e.g. 45 min"
            />
          </div>

          <div style={styles.divider} />

          <div style={styles.aiCapabilities}>
            <div style={styles.capTitle}>AI will extract:</div>
            {[
              ['⬡', 'Meeting summary', 'var(--accent-blue)'],
              ['◷', 'Action items + deadlines', 'var(--accent-purple)'],
              ['◈', 'Key decisions', 'var(--accent-cyan)'],
              ['⚠', 'Risk alerts', 'var(--accent-orange)'],
              ['⊕', 'Assigned members', 'var(--accent-green)'],
              ['◎', 'Sentiment analysis', 'var(--accent-red)'],
            ].map(([icon, label, color]) => (
              <div key={label} style={styles.capItem}>
                <span style={{ color, fontSize: 14 }}>{icon}</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Transcript */}
        <div style={styles.transcriptCol}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Meeting Transcript *</label>
            <textarea
              className="input"
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              placeholder={`Paste your transcript here...\n\nExample:\nPriya: Let's discuss the Q2 roadmap...\nRahul: Engineering is on track for...`}
              style={styles.textarea}
            />
            {transcript && (
              <span style={styles.fieldHint}>
                ~{Math.round(transcript.split(' ').length)} words · ~{Math.round(transcript.split('\n').filter(Boolean).length)} lines
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Analyze button */}
      <div style={styles.analyzeSection}>
        {!apiKey && (
          <div style={styles.apiWarning}>
            <span>⚠</span>
            <span>⚠ OpenRouter API key not set — <a href="/settings" style={{ color: 'var(--accent-blue)' }}>go to Settings</a> to add it</span>
          </div>
        )}
        <button
          onClick={handleAnalyze}
          disabled={loading || !title || !transcript}
          className="btn btn-primary"
          style={{ padding: '14px 36px', fontSize: 15, opacity: (!title || !transcript) ? 0.5 : 1 }}
        >
          {loading ? (
            <>
              <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>◌</span>
              {loadingMsg}
            </>
          ) : (
            <>◎ Analyze with AI</>
          )}
        </button>
        {loading && (
          <div style={styles.loadingBar}>
            <div style={styles.loadingFill} />
          </div>
        )}
      </div>
    </div>
  );
}

function parseDays(str) {
  if (!str) return 7;
  const n = parseInt(str);
  if (!isNaN(n)) return n;
  if (str.includes('week')) return 7;
  if (str.includes('month')) return 30;
  return 7;
}

const styles = {
  page: { padding: '32px 36px', maxWidth: 960, margin: '0 auto', animation: 'fadeUp 0.4s ease' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  pageTitle: { fontSize: 28, fontWeight: 800 },
  pageSub: { fontSize: 13, color: 'var(--text-muted)', marginTop: 4 },

  uploadCard: {
    background: 'linear-gradient(135deg, rgba(99,179,237,0.06), rgba(183,148,244,0.06))',
    border: '1px dashed rgba(99,179,237,0.25)',
    borderRadius: 20,
    padding: '28px 32px',
    textAlign: 'center',
    marginBottom: 28,
  },
  uploadIcon: { fontSize: 32, marginBottom: 10, color: 'var(--accent-blue)' },
  uploadTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 6 },
  uploadSub: { fontSize: 12, color: 'var(--text-muted)' },

  formGrid: { display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, marginBottom: 28 },
  metaCol: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 18,
    padding: '24px 20px',
  },
  transcriptCol: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 18,
    padding: '24px 20px',
  },

  fieldGroup: { marginBottom: 18 },
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 },
  fieldHint: { fontSize: 11, color: 'var(--text-muted)', marginTop: 6, display: 'block' },
  textarea: { resize: 'vertical', minHeight: 380, fontFamily: 'var(--font-body)', lineHeight: 1.6 },

  divider: { height: 1, background: 'var(--border)', margin: '20px 0' },
  aiCapabilities: { display: 'flex', flexDirection: 'column', gap: 10 },
  capTitle: { fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 },
  capItem: { display: 'flex', alignItems: 'center', gap: 10 },

  analyzeSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 },
  apiWarning: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 20px',
    background: 'rgba(246,173,85,0.08)',
    border: '1px solid rgba(246,173,85,0.2)',
    borderRadius: 10,
    color: 'var(--accent-orange)',
    fontSize: 13,
  },
  loadingBar: {
    width: 300, height: 3,
    background: 'var(--border)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))',
    borderRadius: 2,
    animation: 'shimmer 1.5s infinite',
    backgroundSize: '200% 100%',
    width: '60%',
  },
};
