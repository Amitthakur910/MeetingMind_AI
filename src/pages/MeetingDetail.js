import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const TABS = ['Summary', 'Action Items', 'Risks', 'Transcript'];

export default function MeetingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { meetings, toggleActionItem } = useApp();
  const [activeTab, setActiveTab] = useState('Summary');
  const [search, setSearch] = useState('');

  const meeting = meetings.find(m => m.id === id);

  if (!meeting) {
    return (
      <div style={styles.notFound}>
        <div style={{ fontSize: 48 }}>◈</div>
        <h2>Meeting not found</h2>
        <Link to="/" className="btn btn-secondary">← Back to Dashboard</Link>
      </div>
    );
  }

  const pendingCount = meeting.actionItems?.filter(a => !a.done).length || 0;
  const doneCount = meeting.actionItems?.filter(a => a.done).length || 0;

  const filteredItems = (meeting.actionItems || []).filter(a =>
    !search || a.text.toLowerCase().includes(search.toLowerCase()) || a.assignee.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (actionId) => {
    toggleActionItem(id, actionId);
    toast.success('Action item updated');
  };

  return (
    <div style={styles.page}>
      {/* Back button */}
      <Link to="/" style={styles.backBtn}>← Dashboard</Link>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          {meeting.sentiment && (
            <span className={`badge badge-${sentimentColor(meeting.sentiment)}`}>
              {sentimentEmoji(meeting.sentiment)} {meeting.sentiment}
            </span>
          )}
          <h1 style={styles.title}>{meeting.title}</h1>
          <div style={styles.meta}>
            <span>📅 {format(new Date(meeting.date), 'MMM d, yyyy · h:mm a')}</span>
            <span>·</span>
            <span>⏱ {meeting.duration}</span>
            <span>·</span>
            <span>👥 {meeting.participants.join(', ')}</span>
          </div>
        </div>
        <div style={styles.headerStats}>
          <div style={styles.miniStat}>
            <div style={styles.miniStatVal}>{pendingCount}</div>
            <div style={styles.miniStatLabel}>Open Actions</div>
          </div>
          <div style={styles.miniStat}>
            <div style={{ ...styles.miniStatVal, color: 'var(--accent-green)' }}>{doneCount}</div>
            <div style={styles.miniStatLabel}>Completed</div>
          </div>
          <div style={styles.miniStat}>
            <div style={{ ...styles.miniStatVal, color: 'var(--accent-red)' }}>
              {meeting.risks?.filter(r => r.severity === 'high').length || 0}
            </div>
            <div style={styles.miniStatLabel}>High Risks</div>
          </div>
        </div>
      </div>

      {/* Topics */}
      {meeting.topics?.length > 0 && (
        <div style={styles.topics}>
          {meeting.topics.map(t => (
            <span key={t} className="badge badge-blue">{t}</span>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.tabActive : {}),
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={styles.content}>
        {activeTab === 'Summary' && (
          <div style={styles.tabPanel}>
            {/* Summary */}
            <div style={styles.summaryCard}>
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>◎</span>
                <h3 style={styles.cardTitle}>Meeting Summary</h3>
              </div>
              <p style={styles.summaryText}>{meeting.summary}</p>
            </div>

            {/* Key Decisions */}
            {meeting.keyDecisions?.length > 0 && (
              <div style={styles.decisionCard}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardIcon}>⬡</span>
                  <h3 style={styles.cardTitle}>Key Decisions</h3>
                  <span className="badge badge-blue">{meeting.keyDecisions.length}</span>
                </div>
                <div style={styles.decisionList}>
                  {meeting.keyDecisions.map((d, i) => (
                    <div key={i} style={styles.decisionItem}>
                      <div style={styles.decisionNum}>{String(i + 1).padStart(2, '0')}</div>
                      <div style={styles.decisionText}>{d}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Participants */}
            <div style={styles.participantsCard}>
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>◈</span>
                <h3 style={styles.cardTitle}>Participants</h3>
              </div>
              <div style={styles.participantGrid}>
                {meeting.participants.map((p, i) => (
                  <div key={i} style={styles.participantItem}>
                    <div style={styles.participantAvatar}>
                      {p.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span style={{ fontSize: 13 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Action Items' && (
          <div style={styles.tabPanel}>
            <div style={styles.actionHeader}>
              <div style={{ display: 'flex', gap: 10 }}>
                <span className="badge badge-orange">{pendingCount} pending</span>
                <span className="badge badge-green">{doneCount} done</span>
              </div>
              <input
                className="input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search actions or assignees..."
                style={{ width: 240 }}
              />
            </div>

            <div style={styles.actionGrid}>
              {filteredItems.map(a => (
                <div
                  key={a.id}
                  style={{
                    ...styles.actionCard,
                    opacity: a.done ? 0.5 : 1,
                    borderColor: a.done ? 'var(--border)' :
                      a.priority === 'high' ? 'rgba(252,129,129,0.2)' :
                      a.priority === 'medium' ? 'rgba(246,173,85,0.15)' : 'var(--border)',
                  }}
                >
                  <div style={styles.actionCardTop}>
                    <span className={`badge badge-${priorityColor(a.priority)}`}>{a.priority}</span>
                    <button
                      onClick={() => handleToggle(a.id)}
                      style={{
                        ...styles.checkBtn,
                        background: a.done ? 'var(--accent-green)' : 'transparent',
                        borderColor: a.done ? 'var(--accent-green)' : 'var(--border)',
                      }}
                    >
                      {a.done ? '✓' : ''}
                    </button>
                  </div>
                  <div style={{ ...styles.actionCardText, textDecoration: a.done ? 'line-through' : 'none' }}>
                    {a.text}
                  </div>
                  <div style={styles.actionCardMeta}>
                    <div style={styles.assigneeChip}>
                      <div style={styles.avatarSmall}>
                        {a.assignee.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span>{a.assignee}</span>
                    </div>
                    {a.deadline && (
                      <div style={{
                        ...styles.deadlineChip,
                        color: isPast(new Date(a.deadline)) && !a.done ? 'var(--accent-red)' : 'var(--text-muted)',
                      }}>
                        {isPast(new Date(a.deadline)) && !a.done ? '⚠ ' : '⏳ '}
                        {formatDistanceToNow(new Date(a.deadline), { addSuffix: true })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Risks' && (
          <div style={styles.tabPanel}>
            {meeting.risks?.length > 0 ? (
              <div style={styles.riskGrid}>
                {meeting.risks.map((r, i) => (
                  <div key={i} style={{
                    ...styles.riskCard,
                    borderColor: r.severity === 'high' ? 'rgba(252,129,129,0.25)' :
                      r.severity === 'medium' ? 'rgba(246,173,85,0.2)' : 'rgba(104,211,145,0.2)',
                    background: r.severity === 'high' ? 'rgba(252,129,129,0.04)' :
                      r.severity === 'medium' ? 'rgba(246,173,85,0.04)' : 'rgba(104,211,145,0.04)',
                  }}>
                    <div style={styles.riskHeader}>
                      <span style={{
                        fontSize: 28,
                        color: r.severity === 'high' ? 'var(--accent-red)' :
                          r.severity === 'medium' ? 'var(--accent-orange)' : 'var(--accent-green)',
                      }}>
                        {r.severity === 'high' ? '⚠' : r.severity === 'medium' ? '◷' : '✓'}
                      </span>
                      <span className={`badge badge-${r.severity === 'high' ? 'red' : r.severity === 'medium' ? 'orange' : 'green'}`}>
                        {r.severity} severity
                      </span>
                    </div>
                    <div style={styles.riskText}>{r.text}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <div style={{ fontSize: 48 }}>✓</div>
                <div>No risks detected in this meeting</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Transcript' && (
          <div style={styles.tabPanel}>
            <div style={styles.transcriptCard}>
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>◷</span>
                <h3 style={styles.cardTitle}>Full Transcript</h3>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                  ~{meeting.transcript?.split(' ').length || 0} words
                </span>
              </div>
              <div style={styles.transcriptContent}>
                {(meeting.transcript || '').split('\n').filter(Boolean).map((line, i) => {
                  const colonIdx = line.indexOf(':');
                  if (colonIdx > 0 && colonIdx < 30) {
                    const speaker = line.slice(0, colonIdx);
                    const text = line.slice(colonIdx + 1).trim();
                    return (
                      <div key={i} style={styles.transcriptLine}>
                        <span style={styles.speaker}>{speaker}</span>
                        <span style={styles.speechText}>{text}</span>
                      </div>
                    );
                  }
                  return <div key={i} style={styles.transcriptLine}><span style={styles.speechText}>{line}</span></div>;
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function sentimentColor(s) {
  return { positive: 'green', neutral: 'blue', mixed: 'orange', tense: 'red' }[s] || 'blue';
}
function sentimentEmoji(s) {
  return { positive: '😊', neutral: '😐', mixed: '🤔', tense: '😬' }[s] || '😐';
}
function priorityColor(p) {
  return { high: 'red', medium: 'orange', low: 'green' }[p] || 'blue';
}

const styles = {
  page: { padding: '28px 36px', maxWidth: 1100, margin: '0 auto', animation: 'fadeUp 0.4s ease' },
  notFound: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 20, color: 'var(--text-secondary)' },
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', marginBottom: 24, transition: 'color 0.15s' },

  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  headerLeft: { flex: 1 },
  title: { fontSize: 26, fontWeight: 800, lineHeight: 1.2, margin: '10px 0 8px' },
  meta: { display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-secondary)', flexWrap: 'wrap' },
  headerStats: { display: 'flex', gap: 20, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px 24px' },
  miniStat: { textAlign: 'center' },
  miniStatVal: { fontSize: 24, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent-blue)' },
  miniStatLabel: { fontSize: 10, color: 'var(--text-muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.05em' },

  topics: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 },

  tabs: { display: 'flex', gap: 4, marginBottom: 24, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 6, width: 'fit-content' },
  tab: { padding: '8px 20px', borderRadius: 10, border: 'none', background: 'transparent', color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s ease' },
  tabActive: { background: 'rgba(99,179,237,0.12)', color: 'var(--accent-blue)', border: '1px solid rgba(99,179,237,0.2)' },

  content: { animation: 'fadeUp 0.3s ease' },
  tabPanel: { display: 'flex', flexDirection: 'column', gap: 16 },

  cardHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 },
  cardIcon: { fontSize: 18, color: 'var(--accent-blue)' },
  cardTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 },

  summaryCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 24 },
  summaryText: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 },

  decisionCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 24 },
  decisionList: { display: 'flex', flexDirection: 'column', gap: 12 },
  decisionItem: { display: 'flex', gap: 16, alignItems: 'flex-start' },
  decisionNum: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'var(--border)', lineHeight: 1, flexShrink: 0, width: 36 },
  decisionText: { fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5, paddingTop: 4 },

  participantsCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 24 },
  participantGrid: { display: 'flex', flexWrap: 'wrap', gap: 12 },
  participantItem: { display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px' },
  participantAvatar: { width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#07070f' },

  actionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  actionGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 },
  actionCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, transition: 'all 0.15s ease' },
  actionCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  checkBtn: { width: 24, height: 24, borderRadius: 6, border: '1px solid', color: '#07070f', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' },
  actionCardText: { fontSize: 13, lineHeight: 1.5, color: 'var(--text-primary)', marginBottom: 14 },
  actionCardMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  assigneeChip: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: 'var(--text-secondary)' },
  avatarSmall: { width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#07070f' },
  deadlineChip: { fontSize: 11 },

  riskGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 },
  riskCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 24 },
  riskHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  riskText: { fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 },

  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 16, color: 'var(--accent-green)', fontSize: 14 },

  transcriptCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 24 },
  transcriptContent: { display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 600, overflow: 'auto' },
  transcriptLine: { display: 'flex', gap: 12, alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' },
  speaker: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, color: 'var(--accent-blue)', minWidth: 80, flexShrink: 0, paddingTop: 2 },
  speechText: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 },
};
