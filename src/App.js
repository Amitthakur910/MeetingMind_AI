import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MeetingUpload from './pages/MeetingUpload';
import MeetingDetail from './pages/MeetingDetail';
import CatchMeUp from './pages/CatchMeUp';
import TeamChat from './pages/TeamChat';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#12121f',
              color: '#f0f0f8',
              border: '1px solid rgba(255,255,255,0.06)',
              fontFamily: "'DM Mono', monospace",
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#68d391', secondary: '#07070f' } },
            error: { iconTheme: { primary: '#fc8181', secondary: '#07070f' } },
          }}
        />
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<MeetingUpload />} />
            <Route path="/meeting/:id" element={<MeetingDetail />} />
            <Route path="/catch-me-up" element={<CatchMeUp />} />
            <Route path="/team-chat" element={<TeamChat />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}
