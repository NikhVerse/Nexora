import React from 'react';
import { Sun, Moon, Monitor, Key, BrainCircuit, Gauge } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Row: React.FC<{ label: string; description?: string; children: React.ReactNode }> = ({ label, description, children }) => (
  <div className="flex items-start justify-between gap-6 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
    <div>
      <p className="text-base font-medium" style={{ color: 'var(--text)' }}>{label}</p>
      {description && <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{description}</p>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

export const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themeOptions: { value: 'light' | 'dark' | 'system'; label: string; Icon: React.FC<any> }[] = [
    { value: 'light', label: 'Light', Icon: Sun },
    { value: 'dark',  label: 'Dark',  Icon: Moon },
    { value: 'system',label: 'System', Icon: Monitor },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8" style={{ background: 'var(--bg)' }}>
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text)' }}>Settings</h1>
        <p className="text-base mb-8" style={{ color: 'var(--text-muted)' }}>Manage preferences and AI configuration.</p>

        {/* Appearance */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <div className="px-5 py-4" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Appearance</p>
          </div>
          <div className="px-5" style={{ background: 'var(--bg)' }}>
            <Row label="Theme" description="Choose your preferred color scheme.">
              <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                {themeOptions.map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all"
                    style={{
                      background: theme === value ? 'var(--bg)' : 'transparent',
                      color: theme === value ? 'var(--text)' : 'var(--text-muted)',
                      fontWeight: theme === value ? 500 : 400,
                      boxShadow: theme === value ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </Row>
          </div>
        </div>

        {/* AI Model */}
        <div className="rounded-2xl overflow-hidden mt-5" style={{ border: '1px solid var(--border)' }}>
          <div className="px-5 py-4" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>AI Model</p>
          </div>
          <div className="px-5" style={{ background: 'var(--bg)' }}>
            <Row label="OpenAI API Key" description="Required for live AI research. Stored only in your .env file.">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <span className="text-sm px-3 py-1.5 rounded-lg" style={{ background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                  Configured in .env
                </span>
              </div>
            </Row>
            <Row label="Model" description="The AI model used for research and synthesis.">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <span className="text-sm" style={{ color: 'var(--text-2)' }}>gpt-4o-mini</span>
              </div>
            </Row>
            <Row label="Fallback Engine" description="Used when OpenAI is unavailable — no API key required.">
              <span className="text-sm px-2.5 py-1 rounded-full" style={{ background: 'var(--badge-verified-bg)', color: 'var(--badge-verified-text)' }}>
                Active
              </span>
            </Row>
          </div>
        </div>

        {/* Research */}
        <div className="rounded-2xl overflow-hidden mt-5" style={{ border: '1px solid var(--border)' }}>
          <div className="px-5 py-4" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Research</p>
          </div>
          <div className="px-5" style={{ background: 'var(--bg)' }}>
            <Row label="Default Depth" description="How thorough the research pipeline is by default.">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <span className="text-sm" style={{ color: 'var(--text-2)' }}>Standard</span>
              </div>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};
