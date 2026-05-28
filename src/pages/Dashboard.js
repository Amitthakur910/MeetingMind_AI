import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatDistanceToNow, isPast, isWithinInterval, subDays } from 'date-fns';

const StatCard = ({ label, value, sub, accent, icon }) => (
  <div style={{
    ...styles.statCard,
    borderColor: `${accent}22`,
    background: `linear-gradient(135deg, var(--bg-card), ${accent}08)`,
  }}>
    <div style={{ ...styles.statIcon, background: `${accent}15`, color: accent }}>{icon}</div>
    <div style={styles.statValue}>{value}</div>
    <div style={styles.statLabel}>{label}</div>
    {sub && <div style={styles.statSub}>{sub}</div>}
  </div>
);

const PriorityDot = ({ priority }) => {
  const colors = { high: '#fc8181', medium: '#f6ad55', low: '#68d391' };
  return (
    <span style={{
      width: 7, height: 7, borderRadius: '50%',
      background: colors[priority] || '#8888aa',
      display: 'inline-block',
      boxShadow: `0 0 6px ${colors[priority] || '#8888aa'}`,
      flexShrink: 0,
    }} />
  );
};

export default function Dashboard() {
  const { meetings } = useApp();

  const allActionItems = useMemo(() =>
    meetings.flatMap(m => m.actionItems.map(a => ({ ...a, meetingId: m.id, meetingTitle: m.title }))),
    [meetings]
  );

  const stats = useMemo(() => {
    const pending = allActionItems.filter(a => !a.done);
    const overdue = pending.filter(a => a.deadline && isPast(new Date(a.deadline)));
    const highRisk = meetings.flatMap(m => m.risks || []).filter(r => r.severity === 'high').length;
    const thisWeek = meetings.filter(m =>
      isWithinInterval(new Date(m.date), { start: subDays(new Date(), 7), end: new Date() })
    ).length;

    return { pending: pending.length, overdue: overdue.length, highRisk, thisWeek };
  }, [meetings, allActionItems]);

  const upcomingActions = useMemo(() =>
    allActionItems.filter(a => !a.done).sort((a, b) => {
      const pa = { high: 0, medium: 1, low: 2 };
      return (pa[a.priority] || 1) - (pa[b.priority] || 1);
    }).slice(0, 6),
    [allActionItems]
  );

  const allRisks = useMemo(() =>
    meetings.flatMap(m => (m.risks || []).map(r => ({ ...r, meetingId: m.id, meetingTitle: m.title }))).slice(0, 4),
    [meetings]
  );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Dashboard</h1>
          <p style={styles.pageSubtitle}>Your team's intelligence hub — live & updated</p>
        </div>
        <Link to="/upload" className="btn btn-primary">
          <span>⊕</span> Analyze Meeting
        </Link>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <StatCard icon="◈" label="Meetings This Week" value={stats.thisWeek} sub={`${meetings.length} total`} accent="#63b3ed" />
        <StatCard icon="◷" label="Pending Actions" value={stats.pending} sub="across all meetings" accent="#b794f4" />
        <StatCard icon="⚠" label="Overdue Items" value={stats.overdue} sub={stats.overdue > 0 ? 'needs attention' : 'all on track'} accent="#fc8181" />
        <StatCard icon="⬡" label="Active Risks" value={stats.highRisk} sub="high severity" accent="#f6ad55" />
      </div>

      <div style={styles.twoCol}>
        {/* Recent Meetings */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Recent Meetings</h2>
            <Link to="/upload" style={styles.seeAll}>+ New</Link>
          </div>
          <div style={styles.meetingList}>
            {meetings.map(m => (
              <Link to={`/meeting/${m.id}`} key={m.id} style={styles.meetingCard}>
                <div style={styles.meetingTop}>
                  <span className="badge badge-blue">{m.duration}</span>
                  <span style={styles.meetingDate}>
                    {formatDistanceToNow(new Date(m.date), { addSuffix: true })}
                  </span>
                </div>
                <div style={styles.meetingTitle}>{m.title}</div>
                <div style={styles.meetingSummary}>{m.summary?.slice(0, 100)}...</div>
                <div style={styles.meetingFooter}>
                  <div style={styles.participants}>
                    {m.participants.slice(0, 3).map((p, i) => (
                      <div key={i} style={{ ...styles.avatar, zIndex: 3 - i, marginLeft: i > 0 ? -10 : 0 }}>
                        {p.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                    {m.participants.length > 3 && (
                      <div style={{ ...styles.avatar, marginLeft: -10, fontSize: 10, background: 'var(--bg-card-hover)' }}>
                        +{m.participants.length - 3}
                      </div>
                    )}
                  </div>
                  <div style={styles.actionCount}>
                    {m.actionItems?.filter(a => !a.done).length || 0} open actions
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={styles.rightCol}>
          {/* Priority Actions */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Priority Actions</h2>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{upcomingActions.length} pending</span>
            </div>
            <div style={styles.actionList}>
              {upcomingActions.map(a => (
                <Link to={`/meeting/${a.meetingId}`} key={a.id} style={styles.actionItem}>
                  <PriorityDot priority={a.priority} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={styles.actionText}>{a.text}</div>
                    <div style={styles.actionMeta}>
                      <span style={{ color: 'var(--accent-blue)' }}>{a.assignee}</span>
                      {a.deadline && (
                        <span style={{ color: isPast(new Date(a.deadline)) ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                          {isPast(new Date(a.deadline)) ? '⚠ ' : ''}
                          {formatDistanceToNow(new Date(a.deadline), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Risks */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Risk Alerts</h2>
              <span className="badge badge-red">{allRisks.filter(r => r.severity === 'high').length} high</span>
            </div>
            <div style={styles.riskList}>
              {allRisks.map((r, i) => (
                <Link to={`/meeting/${r.meetingId}`} key={i} style={styles.riskItem}>
                  <div style={{
                    ...styles.riskSeverity,
                    background: r.severity === 'high' ? 'rgba(252,129,129,0.1)' : r.severity === 'medium' ? 'rgba(246,173,85,0.1)' : 'rgba(104,211,145,0.1)',
                    color: r.severity === 'high' ? 'var(--accent-red)' : r.severity === 'medium' ? 'var(--accent-orange)' : 'var(--accent-green)',
                    borderColor: r.severity === 'high' ? 'rgba(252,129,129,0.2)' : r.severity === 'medium' ? 'rgba(246,173,85,0.2)' : 'rgba(104,211,145,0.2)',
                  }}>
                    {r.severity}
                  </div>
                  <div style={styles.riskText}>{r.text}</div>
                </Link>
              ))}
              {allRisks.length === 0 && (
                <div style={styles.emptyState}>✓ No active risks detected</div>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div style={styles.quickLinks}>
            <Link to="/catch-me-up" style={styles.quickLink}>
              <span>⚡</span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>Catch Me Up</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>AI summary of what you missed</div>
              </div>
              <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>→</span>
            </Link>
            <Link to="/team-chat" style={styles.quickLink}>
              <span>◈</span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>Team Chat Summary</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>AI digest of recent conversations</div>
              </div>
              <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '32px 36px', maxWidth: 1200, margin: '0 auto', animation: 'fadeUp 0.4s ease' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  pageTitle: { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 },
  pageSubtitle: { fontSize: 13, color: 'var(--text-muted)', marginTop: 4 },

  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 },
  statCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: '20px 24px',
    transition: 'all 0.2s ease',
  },
  statIcon: { width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 16 },
  statValue: { fontSize: 32, fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, fontWeight: 500 },
  statSub: { fontSize: 11, color: 'var(--text-muted)', marginTop: 2 },

  twoCol: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 },
  section: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 24, marginBottom: 20 },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' },
  seeAll: { fontSize: 12, color: 'var(--accent-blue)', textDecoration: 'none' },
  rightCol: {},

  meetingList: { display: 'flex', flexDirection: 'column', gap: 12 },
  meetingCard: {
    display: 'block',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    padding: '16px 20px',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'all 0.15s ease',
    cursor: 'pointer',
  },
  meetingTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  meetingDate: { fontSize: 11, color: 'var(--text-muted)' },
  meetingTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 6 },
  meetingSummary: { fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 },
  meetingFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  participants: { display: 'flex', alignItems: 'center' },
  avatar: {
    width: 26, height: 26, borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 9, fontWeight: 700, color: '#07070f',
    border: '2px solid var(--bg-card)',
    position: 'relative',
    fontFamily: 'var(--font-display)',
  },
  actionCount: { fontSize: 11, color: 'var(--accent-blue)' },

  actionList: { display: 'flex', flexDirection: 'column', gap: 1 },
  actionItem: {
    display: 'flex', alignItems: 'flex-start', gap: 10,
    padding: '10px 0',
    borderBottom: '1px solid var(--border)',
    textDecoration: 'none', color: 'inherit',
  },
  actionText: { fontSize: 12, lineHeight: 1.4, color: 'var(--text-primary)', marginBottom: 4 },
  actionMeta: { display: 'flex', gap: 12, fontSize: 11 },

  riskList: { display: 'flex', flexDirection: 'column', gap: 10 },
  riskItem: {
    display: 'flex', alignItems: 'flex-start', gap: 10,
    textDecoration: 'none', color: 'inherit',
  },
  riskSeverity: {
    padding: '2px 8px',
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    border: '1px solid',
    flexShrink: 0,
    marginTop: 2,
  },
  riskText: { fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 },
  emptyState: { fontSize: 12, color: 'var(--accent-green)', padding: '8px 0' },

  quickLinks: { display: 'flex', flexDirection: 'column', gap: 10 },
  quickLink: {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '14px 18px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    textDecoration: 'none', color: 'inherit',
    fontSize: 18,
    transition: 'all 0.15s ease',
  },
};
