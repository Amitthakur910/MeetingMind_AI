import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

const DAY_OPTIONS = [1, 2, 3, 5, 7, 14];

export default function CatchMeUp() {
  const { generateCatchMeUp, apiKey, meetings, chatMessages } = useApp();
  const [selectedDays, setSelectedDays] = useState(3);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const handleGenerate = async () => {
    if (!apiKey) { toast.error('Set your OpenRouter API key in Settings'); return; }
    setLoading(true);
    setResult('');
    try {
      const summary = await generateCatchMeUp(selectedDays);
      setResult(summary);
    } catch (err) {
      toast.error(err.message || 'Failed to generate catch-up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>⚡ FEATURE</div>
          <h1 style={styles.pageTitle}>Catch Me Up</h1>
          <p style={styles.pageSub}>
            Missed a few days? AI instantly summarizes everything you need to know — meetings, decisions, action items, and chats.
          </p>
        </div>
      </div>

      <div style={styles.layout}>
        {/* Config panel */}
        <div style={styles.configPanel}>
          <div style={styles.configSection}>
            <label style={styles.label}>Your Name</label>
            <input
              className="input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
            />
          </div>

          <div style={styles.configSection}>
            <label style={styles.label}>I was away for...</label>
            <div style={styles.dayGrid}>
              {DAY_OPTIONS.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDays(d)}
                  style={{
                    ...styles.dayBtn,
                    ...(selectedDays === d ? styles.dayBtnActive : {}),
                  }}
                >
                  {d} {d === 1 ? 'day' : 'days'}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.configSection}>
            <label style={styles.label}>What AI will scan</label>
            <div style={styles.sourceList}>
              <div style={styles.sourceItem}>
                <span style={{ color: 'var(--accent-blue)' }}>◎</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 12 }}>Meetings ({meetings.length})</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>All analyzed meeting records</div>
                </div>
                <span style={{ marginLeft: 'auto' }} className="badge badge-green">ready</span>
              </div>
              <div style={styles.sourceItem}>
                <span style={{ color: 'var(--accent-purple)' }}>◈</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 12 }}>Team Chat ({chatMessages.length} msgs)</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Recent team conversations</div>
                </div>
                <span style={{ marginLeft: 'auto' }} className="badge badge-green">ready</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
          >
            {loading ? (
              <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>◌</span> Generating...</>
            ) : (
              <>⚡ Catch Me Up</>
            )}
          </button>

          {!apiKey && (
            <div style={styles.apiWarning}>⚠ Set OpenRouter API key in Settings to use this feature</div>
          )}
        </div>

        {/* Result panel */}
        <div style={styles.resultPanel}>
          {!result && !loading && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>⚡</div>
              <h3 style={styles.emptyTitle}>Ready to catch you up</h3>
              <p style={styles.emptyText}>
                Configure how many days you missed on the left, then hit <strong>Catch Me Up</strong>. AI will scan all your team's meetings and chat history to create a personalized briefing.
              </p>
              <div style={styles.featureGrid}>
                {[
                  ['TL;DR', 'The quick summary you need first'],
                  ['Key Events', 'Everything important that happened'],
                  ['Your Actions', 'Pending tasks assigned to you'],
                  ['Urgent Items', 'What needs attention immediately'],
                ].map(([title, desc]) => (
                  <div key={title} style={styles.featureCard}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, marginBottom: 4, color: 'var(--accent-blue)' }}>{title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div style={styles.loadingState}>
              <div style={styles.loadingOrb} />
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>
                Scanning {selectedDays} days of team activity...
              </div>
              <div style={styles.loadingSteps}>
                {['Reading meeting records', 'Analyzing team chats', 'Identifying your tasks', 'Generating personalized briefing'].map((s, i) => (
                  <div key={s} style={{ ...styles.loadingStep, animationDelay: `${i * 0.5}s` }}>
                    <span style={{ color: 'var(--accent-green)' }}>◷</span> {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && (
            <div style={styles.resultContent}>
              <div style={styles.resultHeader}>
                <span className="badge badge-green">✓ Catch-up generated</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {selectedDays} day{selectedDays !== 1 ? 's' : ''} of activity summarized
                </span>
                <button
                  onClick={() => { navigator.clipboard.writeText(result); toast.success('Copied!'); }}
                  className="btn btn-ghost"
                  style={{ marginLeft: 'auto', padding: '4px 10px', fontSize: 12 }}
                >
                  ⊡ Copy
                </button>
              </div>
              <div style={styles.resultBody}>
                <ReactMarkdown
                  components={{
                    h1: ({children}) => <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, marginBottom: 12, color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>{children}</h1>,
                    h2: ({children}) => <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginTop: 24, marginBottom: 10, color: 'var(--accent-blue)' }}>{children}</h2>,
                    h3: ({children}) => <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, marginTop: 16, marginBottom: 8, color: 'var(--text-primary)' }}>{children}</h3>,
                    p: ({children}) => <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 12 }}>{children}</p>,
                    li: ({children}) => <li style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 6 }}>{children}</li>,
                    strong: ({children}) => <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{children}</strong>,
                    ul: ({children}) => <ul style={{ paddingLeft: 20, marginBottom: 12 }}>{children}</ul>,
                    ol: ({children}) => <ol style={{ paddingLeft: 20, marginBottom: 12 }}>{children}</ol>,
                  }}
                >
                  {result}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '32px 36px', maxWidth: 1100, margin: '0 auto', animation: 'fadeUp 0.4s ease' },
  header: { marginBottom: 32 },
  eyebrow: { fontSize: 11, color: 'var(--accent-blue)', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 8 },
  pageTitle: { fontSize: 28, fontWeight: 800, marginBottom: 8 },
  pageSub: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 560 },

  layout: { display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 },

  configPanel: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    height: 'fit-content',
    position: 'sticky',
    top: 24,
  },
  configSection: {},
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 },

  dayGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 },
  dayBtn: {
    padding: '10px 4px',
    borderRadius: 10,
    border: '1px solid var(--border)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    textAlign: 'center',
  },
  dayBtnActive: {
    background: 'rgba(99,179,237,0.12)',
    borderColor: 'rgba(99,179,237,0.3)',
    color: 'var(--accent-blue)',
  },

  sourceList: { display: 'flex', flexDirection: 'column', gap: 10 },
  sourceItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 12px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    fontSize: 14,
  },

  apiWarning: { fontSize: 11, color: 'var(--accent-orange)', textAlign: 'center' },

  resultPanel: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    minHeight: 500,
    overflow: 'hidden',
  },

  emptyState: { padding: '48px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 },
  emptyIcon: { fontSize: 48, color: 'var(--accent-blue)' },
  emptyTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 },
  emptyText: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 400 },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, width: '100%', marginTop: 8 },
  featureCard: { background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, padding: 14, textAlign: 'left' },

  loadingState: { padding: '48px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 },
  loadingOrb: {
    width: 60, height: 60,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
    animation: 'pulse-glow 2s ease infinite',
  },
  loadingSteps: { display: 'flex', flexDirection: 'column', gap: 12 },
  loadingStep: { fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8, animation: 'fadeUp 0.5s ease forwards', opacity: 0, animationFillMode: 'both' },

  resultContent: { padding: 28 },
  resultHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' },
  resultBody: { background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px' },
};
