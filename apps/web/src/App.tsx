import React, { useState, useCallback, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Home } from './pages/Home';
import { Research } from './pages/Research';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { createResearch } from './lib/api';
import { ResearchDepth } from './types';

type View = 'home' | 'research' | 'history' | 'settings';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nexora_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('nexora_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  }, []);

  // Keyboard shortcut Ctrl+B / Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  const startResearch = useCallback(async (question: string, depth: ResearchDepth) => {
    setIsCreating(true);
    try {
      const session = await createResearch({ question, depth });
      setSessionId(session.id);
      setView('research');
    } catch (err) {
      console.error('Failed to create research session', err);
    } finally {
      setIsCreating(false);
    }
  }, []);

  const openSession = useCallback((id: string) => {
    setSessionId(id);
    setView('research');
  }, []);

  const newResearch = useCallback(() => {
    setSessionId(null);
    setView('home');
  }, []);

  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
        {/* Sidebar */}
        <Sidebar
          currentSessionId={sessionId}
          onNewResearch={newResearch}
          onSelectSession={openSession}
          onOpenSettings={() => setView('settings')}
          onOpenHistory={() => setView('history')}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleSidebar}
        />

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden relative" style={{ background: 'var(--bg)' }}>
          {/* Header */}
          <Header
            currentPage={view}
            onNavigate={(page) => {
              if (page === 'home') newResearch();
              else setView(page);
            }}
            onBackToHome={newResearch}
            isCollapsed={isCollapsed}
            onToggleSidebar={toggleSidebar}
          />

          {view === 'home' && (
            <div className="flex-1 flex flex-col overflow-y-auto">
              <Home onSubmit={startResearch} isLoading={isCreating} />
            </div>
          )}

          {view === 'research' && sessionId && (
            <Research key={sessionId} sessionId={sessionId} />
          )}

          {view === 'history' && (
            <div className="flex-1 flex flex-col overflow-y-auto">
              <History
                onSelectSession={openSession}
                onNewResearch={newResearch}
              />
            </div>
          )}

          {view === 'settings' && (
            <div className="flex-1 flex flex-col overflow-y-auto">
              <Settings />
            </div>
          )}
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App;
