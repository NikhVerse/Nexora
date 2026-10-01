import React, { useState } from 'react';
import { ArrowRight, Loader2, Check, Edit2, Trash2, Plus } from 'lucide-react';
import { ResearchSession, ResearchTask } from '../../types';

interface ResearchPlannerProps {
  session: ResearchSession;
  onApprove: (tasks: ResearchTask[]) => Promise<void>;
  isLoading?: boolean;
}

export const ResearchPlanner: React.FC<ResearchPlannerProps> = ({ session, onApprove, isLoading = false }) => {
  const [tasks, setTasks] = useState<ResearchTask[]>(session.tasks || []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [newQ, setNewQ] = useState('');
  const [adding, setAdding] = useState(false);

  const startEdit = (t: ResearchTask) => { setEditingId(t.id); setEditText(t.question); };
  const saveEdit = (id: string) => {
    if (!editText.trim()) return;
    setTasks((p) => p.map((t) => t.id === id ? { ...t, question: editText.trim() } : t));
    setEditingId(null);
  };
  const deleteTask = (id: string) => { if (tasks.length > 1) setTasks((p) => p.filter((t) => t.id !== id)); };
  const addTask = () => {
    if (!newQ.trim()) return;
    setTasks((p) => [...p, { id: `q-${Date.now()}`, question: newQ.trim(), priority: 'medium', status: 'pending', evidence_requirements: [] }]);
    setNewQ(''); setAdding(false);
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-10 space-y-7">
      {/* Question */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Research Question</p>
        <h2 className="text-2xl font-semibold leading-snug" style={{ color: 'var(--text)' }}>{session.question}</h2>
      </div>

      {/* Objective */}
      {session.objective && (
        <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Research Goal</p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-2)' }}>{session.objective}</p>
        </div>
      )}

      {/* Dimensions */}
      {session.dimensions?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {session.dimensions.map((d, i) => (
            <span key={i} className="px-3 py-1 rounded-full text-sm" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
              {d}
            </span>
          ))}
        </div>
      )}

      {/* Sub-questions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Research Questions ({tasks.length})
          </p>
          {!adding && (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-1.5 text-sm transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          )}
        </div>

        <div className="space-y-2">
          {tasks.map((t, idx) => (
            <div
              key={t.id}
              className="flex items-start gap-3 px-4 py-3 rounded-xl group"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <span className="text-sm mt-0.5 w-5 text-right shrink-0 font-mono" style={{ color: 'var(--text-muted)' }}>{idx + 1}.</span>
              <div className="flex-1 min-w-0">
                {editingId === t.id ? (
                  <div className="flex gap-2">
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(t.id)}
                      className="flex-1 px-3 py-1.5 text-sm rounded-lg focus:outline-none"
                      style={{ background: 'var(--bg)', border: '1px solid var(--border-strong)', color: 'var(--text)' }}
                      autoFocus
                    />
                    <button onClick={() => saveEdit(t.id)} style={{ color: '#10a37f' }}>
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-base leading-snug" style={{ color: 'var(--text)' }}>{t.question}</p>
                )}
              </div>
              {editingId !== t.id && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => startEdit(t)} className="p-1" style={{ color: 'var(--text-muted)' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteTask(t.id)} disabled={tasks.length <= 1} className="p-1 disabled:opacity-30" style={{ color: 'var(--text-muted)' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}

          {adding && (
            <div
              className="flex gap-2 items-center px-4 py-3 rounded-xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border-strong)' }}
            >
              <input
                value={newQ}
                onChange={(e) => setNewQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                placeholder="Add a research question..."
                className="flex-1 bg-transparent text-base focus:outline-none"
                style={{ color: 'var(--text)' }}
                autoFocus
              />
              <button
                onClick={addTask}
                className="text-sm px-3 py-1.5 rounded-lg font-medium transition-colors"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                Add
              </button>
              <button
                onClick={() => { setAdding(false); setNewQ(''); }}
                className="text-sm px-2 py-1.5"
                style={{ color: 'var(--text-muted)' }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Start button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => onApprove(tasks)}
          disabled={isLoading || tasks.length === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-base font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}
        >
          {isLoading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Starting...</>
            : <>Start Research <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  );
};
