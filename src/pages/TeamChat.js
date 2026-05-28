import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

export default function TeamChat() {
  const { chatMessages, summarizeChat, apiKey } = useApp();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!apiKey) { toast.error('Set your OpenRouter API key in Settings'); return; }
    setLoading(true);
    try {
      const result = await summarizeChat();
      setSummary(result);
      toast.success('Chat summarized!');
    } catch (err) {
      toast.error(err.message || 'Failed to summarize');
    } finally {
      setLoading(false);
    }
  };

  const avatarColors = {
    'PS': 'linear-gradient(135deg, #63b3ed, #4299e1)',
    'RM': 'linear-gradient(135deg, #b794f4, #9f7aea)',
    'AK': 'linear-gradient(135deg, #4fd1c5, #38b2ac)',
    'ST': 'linear-gradient(135deg, #f6ad55, #ed8936)',
    'DT': 'linear-gradient(135deg, #fc8181, #f56565)',
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>◈ TEAM INTELLIGENCE</div>
          <h1 style={styles.pageTitle}>Team Chat</h1>
          <p style={styles.pageSub}>Catch up on team conversations and get AI-powered summaries</p>
        </div>
        <button
          onClick={handleSummarize}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? (
            <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>◌</span> Summarizing...</>
          ) : (
            <>◈ AI Summarize Chat</>
          )}
        </button>
      </div>

      <div style={styles.layout}>
        {/* Chat feed */}
        <div style={styles.chatPanel}>
          <div style={styles.chatHeader}>
            <span style={styles.channelName}># general</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{chatMessages.length} messages today</span>
          </div>
          <div style={styles.chatMessages}>
            {chatMessages.map((msg, i) => {
              const initials = msg.avatar;
              const avatarBg = avatarColors[initials] || 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))';
              const showDate = i === 0 || chatMessages[i - 1].sender !== msg.sender;

              return (
                <div key={msg.id} style={{ ...styles.messageGroup, marginTop: showDate && i > 0 ? 20 : 6 }}>
                  {showDate && (
                    <div style={styles.messageMeta}>
                      <div style={{ ...styles.chatAvatar, background: avatarBg }}>
                        {initials}
                      </div>
                      <div style={styles.senderInfo}>
                        <span style={styles.senderName}>{msg.sender}</span>
                        <span style={styles.messageTime}>{msg.time}</span>
                      </div>
                    </div>
                  )}
                  <div style={styles.messageBubble}>
                    <span style={styles.messageText}>{msg.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary panel */}
        <div style={styles.summaryPanel}>
          {!summary && !loading && (
            <div style={styles.summaryEmpty}>
              <div style={styles.summaryEmptyIcon}>◈</div>
              <div style={styles.summaryEmptyTitle}>AI Chat Intelligence</div>
              <p style={styles.summaryEmptyText}>
                Click <strong>AI Summarize Chat</strong> to instantly get the key points, decisions, and follow-ups from your team's conversations.
              </p>
              <div style={styles.capList}>
                {['Key discussion points', 'Team decisions made', 'Follow-up actions', 'Important mentions'].map(c => (
                  <div key={c} style={styles.capChip}>✓ {c}</div>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div style={styles.summaryLoading}>
              <div style={styles.loadingRing} />
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>Analyzing conversations...</div>
            </div>
          )}

          {summary && !loading && (
            <div style={styles.summaryContent}>
              <div style={styles.summaryLabel}>
                <span className="badge badge-blue">◈ AI Summary</span>
              </div>

              <div style={styles.summaryBlock}>
                <div style={styles.blockTitle}>Overview</div>
                <p style={styles.blockText}>{summary.summary}</p>
              </div>

              {summary.keyPoints?.length > 0 && (
                <div style={styles.summaryBlock}>
                  <div style={styles.blockTitle}>Key Points</div>
                  <div style={styles.pointList}>
                    {summary.keyPoints.map((p, i) => (
                      <div key={i} style={styles.pointItem}>
                        <span style={{ color: 'var(--accent-blue)', fontSize: 14 }}>◷</span>
                        <span style={styles.blockText}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {summary.decisions?.length > 0 && (
                <div style={styles.summaryBlock}>
                  <div style={styles.blockTitle}>Decisions Made</div>
                  <div style={styles.pointList}>
                    {summary.decisions.map((d, i) => (
                      <div key={i} style={styles.pointItem}>
                        <span style={{ color: 'var(--accent-green)', fontSize: 14 }}>✓</span>
                        <span style={styles.blockText}>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {summary.followUps?.length > 0 && (
                <div style={styles.summaryBlock}>
                  <div style={styles.blockTitle}>Follow-ups Needed</div>
                  <div style={styles.pointList}>
                    {summary.followUps.map((f, i) => (
                      <div key={i} style={styles.pointItem}>
                        <span style={{ color: 'var(--accent-orange)', fontSize: 14 }}>⚡</span>
                        <span style={styles.blockText}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '32px 36px', maxWidth: 1200, margin: '0 auto', animation: 'fadeUp 0.4s ease' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  eyebrow: { fontSize: 11, color: 'var(--accent-purple)', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 8 },
  pageTitle: { fontSize: 28, fontWeight: 800, marginBottom: 8 },
  pageSub: { fontSize: 13, color: 'var(--text-secondary)' },

  layout: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 },

  chatPanel: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  chatHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-secondary)',
  },
  channelName: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' },
  chatMessages: { flex: 1, overflow: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', maxHeight: 600 },
  messageGroup: { display: 'flex', flexDirection: 'column', gap: 4 },
  messageMeta: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 },
  chatAvatar: { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#07070f', flexShrink: 0 },
  senderInfo: { display: 'flex', alignItems: 'baseline', gap: 8 },
  senderName: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' },
  messageTime: { fontSize: 11, color: 'var(--text-muted)' },
  messageBubble: { paddingLeft: 42 },
  messageText: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 },

  summaryPanel: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    overflow: 'hidden',
    height: 'fit-content',
  },
  summaryEmpty: { padding: '36px 24px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', textAlign: 'center' },
  summaryEmptyIcon: { fontSize: 40, color: 'var(--accent-purple)' },
  summaryEmptyTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 },
  summaryEmptyText: { fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 },
  capList: { display: 'flex', flexDirection: 'column', gap: 8, width: '100%' },
  capChip: { padding: '8px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, color: 'var(--accent-green)', textAlign: 'left' },

  summaryLoading: { padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 },
  loadingRing: {
    width: 48, height: 48,
    border: '3px solid var(--border)',
    borderTopColor: 'var(--accent-purple)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },

  summaryContent: { padding: 24, display: 'flex', flexDirection: 'column', gap: 20 },
  summaryLabel: { marginBottom: 4 },
  summaryBlock: { display: 'flex', flexDirection: 'column', gap: 10 },
  blockTitle: { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  blockText: { fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 },
  pointList: { display: 'flex', flexDirection: 'column', gap: 8 },
  pointItem: { display: 'flex', gap: 8, alignItems: 'flex-start' },
};
