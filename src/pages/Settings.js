import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

export default function Settings() {
  const { apiKey, saveApiKey } = useApp();
  const [key, setKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);

  const handleSave = () => {
    if (!key.trim()) { toast.error('API key cannot be empty'); return; }
    saveApiKey(key.trim());
    toast.success('OpenRouter API key saved!');
  };

  const handleTest = async () => {
    if (!key.trim()) { toast.error('Enter an API key first'); return; }
    setTesting(true);
    try {
      // OpenRouter exposes a /models endpoint just like OpenAI
      const res = await fetch('https://openrouter.ai/api/v1/models', {
        headers: { 'Authorization': `Bearer ${key.trim()}` }
      });
      if (res.ok) {
        toast.success('✓ OpenRouter API key is valid!');
      } else {
        const err = await res.json();
        toast.error(`Invalid key: ${err.error?.message || 'Unknown error'}`);
      }
    } catch (e) {
      toast.error('Connection failed. Check your key and network.');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Settings</h1>
        <p style={styles.pageSub}>Configure MeetingMind AI</p>
      </div>

      {/* API Key Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionIcon}>⊙</span>
          <div>
            <h2 style={styles.sectionTitle}>OpenRouter API Key</h2>
            <p style={styles.sectionDesc}>
              Required for AI analysis, catch-up generation, and chat summarization.
              OpenRouter gives you access to GPT-4o, Claude, Gemini, and 200+ models with one key.
            </p>
          </div>
          {apiKey && <span className="badge badge-green">✓ Connected</span>}
        </div>

        <div style={styles.keyInput}>
          <input
            className="input"
            type={showKey ? 'text' : 'password'}
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="sk-or-v1-..."
            style={{ fontFamily: 'monospace', letterSpacing: showKey ? 0 : '0.15em' }}
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="btn btn-secondary"
            style={{ flexShrink: 0 }}
          >
            {showKey ? '◎ Hide' : '◷ Show'}
          </button>
        </div>

        <div style={styles.keyActions}>
          <button onClick={handleSave} className="btn btn-primary">Save Key</button>
          <button onClick={handleTest} disabled={testing} className="btn btn-secondary">
            {testing ? '◌ Testing...' : '⊕ Test Connection'}
          </button>
        </div>

        <div style={styles.keyNote}>
          <span style={{ color: 'var(--accent-orange)' }}>⚠</span>
          <span>
            Your API key is stored locally in your browser and never sent anywhere except directly to{' '}
            <a href="https://openrouter.ai" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)' }}>openrouter.ai</a>.
            Get your free key at{' '}
            <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)' }}>openrouter.ai/keys</a>.
          </span>
        </div>
      </div>

      {/* Model Info */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionIcon}>◎</span>
          <div>
            <h2 style={styles.sectionTitle}>Active Model</h2>
            <p style={styles.sectionDesc}>The model used for all AI operations (set in AppContext.js)</p>
          </div>
        </div>
        <div style={styles.modelCard}>
          <div style={styles.modelName}>openai/gpt-4o <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 400 }}>via OpenRouter</span></div>
          <div style={styles.modelDesc}>
            OpenRouter routes your request to OpenAI's GPT-4o — the same model, same quality, with the added
            flexibility to switch to Claude 3.5 Sonnet, Gemini 1.5 Pro, or any other model by changing one
            line in <code style={{ color: 'var(--accent-blue)' }}>AppContext.js</code>.
          </div>
          <div style={styles.modelTags}>
            <span className="badge badge-blue">128k context</span>
            <span className="badge badge-green">JSON mode</span>
            <span className="badge badge-purple">200+ models available</span>
            <span className="badge badge-orange">Pay-per-use</span>
          </div>
        </div>

        {/* Model switcher hint */}
        <div style={styles.switcherHint}>
          <div style={styles.switcherTitle}>Want to switch models? Edit one line:</div>
          <div style={styles.codeBlock}>
            <span style={{ color: 'var(--text-muted)' }}>// AppContext.js  →  line 4</span>{'\n'}
            <span style={{ color: 'var(--accent-cyan)' }}>const</span>{' '}
            <span style={{ color: 'var(--text-primary)' }}>OPENROUTER_MODEL</span>{' '}
            <span style={{ color: 'var(--accent-blue)' }}>=</span>{' '}
            <span style={{ color: 'var(--accent-green)' }}>'openai/gpt-4o'</span>
            <span style={{ color: 'var(--text-muted)' }}>;</span>
          </div>
          <div style={styles.modelOptions}>
            {[
              ['openai/gpt-4o', 'Best overall'],
              ['anthropic/claude-3.5-sonnet', 'Great for summaries'],
              ['google/gemini-pro-1.5', 'Large context'],
              ['meta-llama/llama-3.1-70b-instruct', 'Free tier'],
            ].map(([model, label]) => (
              <div key={model} style={styles.modelOption}>
                <span style={{ color: 'var(--accent-green)', fontSize: 11 }}>◷</span>
                <code style={{ fontSize: 11, color: 'var(--accent-blue)' }}>{model}</code>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>— {label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Status */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionIcon}>⬡</span>
          <div>
            <h2 style={styles.sectionTitle}>Features</h2>
            <p style={styles.sectionDesc}>Available capabilities in MeetingMind AI</p>
          </div>
        </div>
        <div style={styles.featureList}>
          {[
            { name: 'Meeting Transcript Analysis', desc: 'Extract summaries, action items, decisions', status: 'active', icon: '◎' },
            { name: 'Risk Detection', desc: 'Identify risks and blockers automatically', status: 'active', icon: '⚠' },
            { name: 'Catch Me Up', desc: 'Personalized catch-up for absent members', status: 'active', icon: '⚡' },
            { name: 'Chat Summarization', desc: 'AI digest of team conversations', status: 'active', icon: '◈' },
            { name: 'Smart Reminders', desc: 'Deadline tracking and notifications', status: 'coming', icon: '◷' },
            { name: 'Voice Recording (Whisper)', desc: 'Record and transcribe meetings directly', status: 'coming', icon: '⊕' },
            { name: 'Slack / Teams Integration', desc: 'Sync with your existing tools', status: 'coming', icon: '⬡' },
          ].map(f => (
            <div key={f.name} style={styles.featureItem}>
              <span style={{ fontSize: 18, color: f.status === 'active' ? 'var(--accent-blue)' : 'var(--text-muted)' }}>{f.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>{f.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{f.desc}</div>
              </div>
              <span className={`badge badge-${f.status === 'active' ? 'green' : 'orange'}`}>
                {f.status === 'active' ? '✓ Active' : '⧖ Coming Soon'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div style={styles.aboutCard}>
        <div style={styles.aboutLogo}>◎</div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, marginBottom: 6 }}>MeetingMind AI</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Your AI teammate for productive teams. Built with React, OpenRouter (GPT-4o), and designed to turn
            meeting chaos into structured, actionable intelligence.
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['React 18', 'OpenRouter API', 'GPT-4o', 'Node.js', 'Firebase'].map(t => (
              <span key={t} className="badge badge-blue">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '32px 36px', maxWidth: 760, margin: '0 auto', animation: 'fadeUp 0.4s ease' },
  header: { marginBottom: 32 },
  pageTitle: { fontSize: 28, fontWeight: 800 },
  pageSub: { fontSize: 13, color: 'var(--text-muted)', marginTop: 4 },

  section: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, marginBottom: 20 },
  sectionHeader: { display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 },
  sectionIcon: { fontSize: 22, color: 'var(--accent-blue)', flexShrink: 0, marginTop: 2 },
  sectionTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 4 },
  sectionDesc: { fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 },

  keyInput: { display: 'flex', gap: 10, marginBottom: 16 },
  keyActions: { display: 'flex', gap: 10, marginBottom: 16 },
  keyNote: {
    display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-muted)',
    background: 'rgba(246,173,85,0.05)', border: '1px solid rgba(246,173,85,0.1)',
    borderRadius: 10, padding: '12px 14px', lineHeight: 1.6,
  },

  modelCard: { background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginBottom: 16 },
  modelName: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, marginBottom: 8 },
  modelDesc: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 },
  modelTags: { display: 'flex', gap: 8, flexWrap: 'wrap' },

  switcherHint: {
    background: 'rgba(99,179,237,0.04)',
    border: '1px solid rgba(99,179,237,0.15)',
    borderRadius: 12,
    padding: '16px 20px',
  },
  switcherTitle: { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 },
  codeBlock: {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    background: 'var(--bg-primary)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '10px 14px',
    marginBottom: 14,
    whiteSpace: 'pre',
  },
  modelOptions: { display: 'flex', flexDirection: 'column', gap: 8 },
  modelOption: { display: 'flex', alignItems: 'center', gap: 8 },

  featureList: { display: 'flex', flexDirection: 'column', gap: 4 },
  featureItem: {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '14px 0',
    borderBottom: '1px solid var(--border)',
  },

  aboutCard: {
    display: 'flex', gap: 20, alignItems: 'flex-start',
    background: 'linear-gradient(135deg, rgba(99,179,237,0.06), rgba(183,148,244,0.06))',
    border: '1px solid rgba(99,179,237,0.15)',
    borderRadius: 20,
    padding: 28,
  },
  aboutLogo: {
    width: 56, height: 56,
    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
    borderRadius: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 26, color: '#07070f',
    flexShrink: 0,
  },
};
