import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { path: '/', icon: '⬡', label: 'Dashboard' },
  { path: '/upload', icon: '⊕', label: 'New Meeting' },
  { path: '/catch-me-up', icon: '⚡', label: 'Catch Me Up' },
  { path: '/team-chat', icon: '◈', label: 'Team Chat' },
  { path: '/settings', icon: '⊙', label: 'Settings' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const { apiKey } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, width: collapsed ? 64 : 220 }}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoMark}>
            <span style={styles.logoIcon}>◎</span>
          </div>
          {!collapsed && (
            <div>
              <div style={styles.logoText}>MeetingMind</div>
              <div style={styles.logoSub}>AI Teammate</div>
            </div>
          )}
        </div>

        <div style={styles.divider} />

        {/* Nav */}
        <nav style={styles.nav}>
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.navItem,
                  ...(active ? styles.navItemActive : {}),
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
                title={collapsed ? item.label : ''}
              >
                <span style={styles.navIcon}>{item.icon}</span>
                {!collapsed && <span style={styles.navLabel}>{item.label}</span>}
                {active && <div style={styles.navActiveBar} />}
              </Link>
            );
          })}
        </nav>

        <div style={styles.sidebarBottom}>
          {!collapsed && !apiKey && (
            <Link to="/settings" style={styles.apiWarning}>
              <span>⚠</span>
              <span style={{ fontSize: 11 }}>Set OpenRouter Key</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={styles.collapseBtn}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
}

const styles = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg-primary)',
  },
  sidebar: {
    background: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 0',
    position: 'sticky',
    top: 0,
    height: '100vh',
    flexShrink: 0,
    transition: 'width 0.2s ease',
    overflow: 'hidden',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '0 16px 16px',
  },
  logoMark: {
    width: 36,
    height: 36,
    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoIcon: {
    fontSize: 18,
    color: '#07070f',
    fontWeight: 'bold',
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 15,
    color: 'var(--text-primary)',
    lineHeight: 1.2,
  },
  logoSub: {
    fontSize: 10,
    color: 'var(--text-muted)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    background: 'var(--border)',
    margin: '0 16px 16px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: '0 8px',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 12px',
    borderRadius: 10,
    color: 'var(--text-secondary)',
    fontSize: 13,
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    transition: 'all 0.15s ease',
    position: 'relative',
    textDecoration: 'none',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
  },
  navItemActive: {
    background: 'rgba(99, 179, 237, 0.1)',
    color: 'var(--accent-blue)',
    border: '1px solid rgba(99, 179, 237, 0.15)',
  },
  navIcon: {
    fontSize: 16,
    flexShrink: 0,
  },
  navLabel: {
    flex: 1,
  },
  navActiveBar: {
    position: 'absolute',
    right: 0,
    top: '25%',
    bottom: '25%',
    width: 3,
    background: 'var(--accent-blue)',
    borderRadius: 2,
  },
  sidebarBottom: {
    padding: '8px 8px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  apiWarning: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    background: 'rgba(246, 173, 85, 0.08)',
    border: '1px solid rgba(246, 173, 85, 0.2)',
    borderRadius: 8,
    color: 'var(--accent-orange)',
    textDecoration: 'none',
    fontSize: 12,
  },
  collapseBtn: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text-muted)',
    padding: '8px',
    fontSize: 14,
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.15s ease',
  },
  main: {
    flex: 1,
    overflow: 'auto',
    minHeight: '100vh',
  },
};
