import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Settings,
  Sun,
  Moon,
  Monitor,
  PanelLeftClose,
  PanelLeft,
  Clock,
  Search,
  X,
  Compass,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { ResearchSession } from '../../types';
import { listResearch, deleteResearch } from '../../lib/api';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
  currentSessionId: string | null;
  onNewResearch: () => void;
  onSelectSession: (id: string) => void;
  onOpenSettings: () => void;
  onOpenHistory?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

function groupSessions(sessions: ResearchSession[]) {
  const today: ResearchSession[] = [];
  const yesterday: ResearchSession[] = [];
  const older: ResearchSession[] = [];
  const now = new Date();
  for (const s of sessions) {
    const d = new Date(s.created_at);
    const diff = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
    if (diff === 0) today.push(s);
    else if (diff === 1) yesterday.push(s);
    else older.push(s);
  }
  return { today, yesterday, older };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSessionId,
  onNewResearch,
  onSelectSession,
  onOpenSettings,
  onOpenHistory,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [sessions, setSessions] = useState<ResearchSession[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const { theme, setTheme } = useTheme();

  const load = useCallback(async () => {
    try {
      const data = await listResearch();
      setSessions(data);
    } catch {}
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [load]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteResearch(id);
      setSessions((p) => p.filter((s) => s.id !== id));
    } catch {}
  };

  const filteredSessions = useMemo(() => {
    if (!filterQuery.trim()) return sessions;
    const q = filterQuery.toLowerCase();
    return sessions.filter(
      (s) =>
        s.question.toLowerCase().includes(q) ||
        (s.title && s.title.toLowerCase().includes(q))
    );
  }, [sessions, filterQuery]);

  const { today, yesterday, older } = useMemo(
    () => groupSessions(filteredSessions),
    [filteredSessions]
  );

  const themeIcons: { value: 'light' | 'dark' | 'system'; Icon: React.FC<any> }[] = [
    { value: 'light', Icon: Sun },
    { value: 'dark', Icon: Moon },
    { value: 'system', Icon: Monitor },
  ];

  const getStatusIcon = (status: string) => {
    if (status === 'completed') {
      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
    }
    if (status === 'researching') {
      return <Loader2 className="w-3.5 h-3.5 text-sky-500 animate-spin shrink-0" />;
    }
    return <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />;
  };

  // Collapsed Sidebar View
  if (isCollapsed) {
    return (
      <aside
        className="w-14 flex-shrink-0 flex flex-col h-full items-center py-3 select-none transition-all duration-200 z-30"
        style={{
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
        }}
        aria-label="Collapsed Sidebar"
      >
        {/* Expand toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          title="Expand sidebar (Ctrl+B)"
          className="p-2 rounded-lg transition-colors mb-2"
          style={{ color: 'var(--sidebar-text)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        {/* New Research Button */}
        <button
          type="button"
          onClick={onNewResearch}
          title="New Research"
          className="p-2 rounded-lg transition-colors mb-2"
          style={{
            background: 'var(--surface-2)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
          }}
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* History Button */}
        {onOpenHistory && (
          <button
            type="button"
            onClick={onOpenHistory}
            title="All Research History"
            className="p-2 rounded-lg transition-colors mb-4"
            style={{ color: 'var(--sidebar-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <Clock className="w-4 h-4" />
          </button>
        )}

        {/* Recent sessions icon rail */}
        <div className="flex-1 w-full overflow-y-auto px-1 space-y-1.5 flex flex-col items-center">
          {sessions.slice(0, 8).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectSession(s.id)}
              title={s.question}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all relative group"
              style={{
                background: currentSessionId === s.id ? 'var(--sidebar-active)' : 'transparent',
                border: currentSessionId === s.id ? '1px solid var(--border-strong)' : '1px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (currentSessionId !== s.id)
                  e.currentTarget.style.background = 'var(--sidebar-hover)';
              }}
              onMouseLeave={(e) => {
                if (currentSessionId !== s.id)
                  e.currentTarget.style.background = 'transparent';
              }}
            >
              {getStatusIcon(s.status)}
            </button>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto flex flex-col items-center gap-2 pt-2 border-t w-full" style={{ borderColor: 'var(--sidebar-border)' }}>
          <button
            type="button"
            onClick={onOpenSettings}
            title="Settings"
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--sidebar-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </aside>
    );
  }

  // Expanded Sidebar View
  const renderGroup = (label: string, items: ResearchSession[]) => {
    if (!items.length) return null;
    return (
      <div className="mb-2">
        <p className="px-3 pt-3 pb-1 text-[11px] font-semibold tracking-wider uppercase text-[--sidebar-muted] opacity-75">
          {label}
        </p>
        <div className="space-y-0.5">
          {items.map((s) => {
            const isSelected = currentSessionId === s.id;
            return (
              <div
                key={s.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectSession(s.id)}
                onKeyDown={(e) => e.key === 'Enter' && onSelectSession(s.id)}
                className="w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between gap-2 group transition-all cursor-pointer relative"
                style={{
                  background: isSelected ? 'var(--sidebar-active)' : 'transparent',
                  color: isSelected ? 'var(--text)' : 'var(--sidebar-text)',
                  fontWeight: isSelected ? 500 : 400,
                  border: isSelected ? '1px solid var(--border)' : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'var(--sidebar-hover)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {getStatusIcon(s.status)}
                  <span className="truncate leading-snug">{s.question}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDelete(s.id, e)}
                  title="Delete research"
                  className="opacity-0 group-hover:opacity-100 shrink-0 p-1 rounded transition-all hover:text-red-500 hover:bg-red-500/10"
                  style={{ color: 'var(--sidebar-muted)' }}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <aside
      className="w-64 flex-shrink-0 flex flex-col h-full select-none transition-all duration-200 z-30"
      style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }}
      aria-label="Main Sidebar"
    >
      {/* Top Header: Logo + Collapse Button */}
      <div
        className="px-3.5 py-3 flex items-center justify-between gap-2"
        style={{ borderBottom: '1px solid var(--sidebar-border)' }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 font-bold text-xs"
            style={{ background: 'var(--text)', color: 'var(--bg)' }}
          >
            N
          </div>
          <span className="font-semibold text-sm tracking-tight truncate" style={{ color: 'var(--sidebar-text)' }}>
            Nexora
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onNewResearch}
            title="New Research"
            className="p-1.5 rounded-md transition-colors"
            style={{ color: 'var(--sidebar-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <Plus className="w-4 h-4" />
          </button>
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Collapse sidebar (Ctrl+B)"
              className="p-1.5 rounded-md transition-colors"
              style={{ color: 'var(--sidebar-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Buttons: New Research & All History */}
      <div className="p-2 space-y-1">
        <button
          type="button"
          onClick={onNewResearch}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <Plus className="w-3.5 h-3.5 shrink-0" />
          <span>New Research</span>
        </button>

        {onOpenHistory && (
          <button
            type="button"
            onClick={onOpenHistory}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors"
            style={{ color: 'var(--sidebar-text)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span className="flex items-center gap-2.5">
              <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--sidebar-muted)' }} />
              <span>All History</span>
            </span>
            {sessions.length > 0 && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
              >
                {sessions.length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Search Filter for Sessions */}
      {sessions.length > 3 && (
        <div className="px-2 pb-1">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <Search className="w-3.5 h-3.5 shrink-0 opacity-50" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search investigations..."
              className="bg-transparent flex-1 focus:outline-none text-xs"
              style={{ color: 'var(--text)' }}
            />
            {filterQuery && (
              <button
                type="button"
                onClick={() => setFilterQuery('')}
                className="opacity-50 hover:opacity-100"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Session List */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {filteredSessions.length === 0 ? (
          <div className="px-3 py-8 text-center text-xs space-y-1" style={{ color: 'var(--sidebar-muted)' }}>
            <Compass className="w-5 h-5 mx-auto opacity-40 mb-2" />
            <p className="font-medium">
              {filterQuery ? 'No matches found' : 'No research yet'}
            </p>
            <p className="text-[11px] opacity-75">
              {filterQuery ? 'Try another search term.' : 'Start an inquiry above.'}
            </p>
          </div>
        ) : (
          <>
            {renderGroup('Today', today)}
            {renderGroup('Yesterday', yesterday)}
            {renderGroup('Previous', older)}
          </>
        )}
      </div>

      {/* Bottom Footer: Theme Switcher & Settings */}
      <div
        className="p-2.5 flex items-center gap-2"
        style={{ borderTop: '1px solid var(--sidebar-border)' }}
      >
        {/* Theme switcher */}
        <div
          className="flex items-center gap-1 flex-1 p-1 rounded-lg"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {themeIcons.map(({ value, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              title={`${value.charAt(0).toUpperCase() + value.slice(1)} theme`}
              className="flex-1 flex items-center justify-center py-1 rounded transition-all"
              style={{
                background: theme === value ? 'var(--bg)' : 'transparent',
                color: theme === value ? 'var(--text)' : 'var(--text-muted)',
                boxShadow: theme === value ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>

        {/* Settings button */}
        <button
          type="button"
          onClick={onOpenSettings}
          title="Settings"
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--sidebar-muted)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
