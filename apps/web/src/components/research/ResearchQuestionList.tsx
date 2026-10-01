import React, { useState } from 'react';
import { Plus, Trash2, Check, Edit2 } from 'lucide-react';
import { ResearchTask } from '../../types';

interface ResearchQuestionListProps {
  questions: ResearchTask[];
  onChange: (updated: ResearchTask[]) => void;
  disabled?: boolean;
}

export const ResearchQuestionList: React.FC<ResearchQuestionListProps> = ({
  questions,
  onChange,
  disabled = false,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleStartEdit = (q: ResearchTask) => {
    if (disabled) return;
    setEditingId(q.id);
    setEditText(q.question);
  };

  const handleSaveEdit = (id: string) => {
    if (!editText.trim()) return;
    const next = questions.map((q) =>
      q.id === id ? { ...q, question: editText.trim() } : q
    );
    onChange(next);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (disabled || questions.length <= 1) return;
    onChange(questions.filter((q) => q.id !== id));
  };

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;
    const newTask: ResearchTask = {
      id: `custom-${Date.now()}`,
      question: newQuestionText.trim(),
      priority: 'medium',
      status: 'pending',
      evidence_requirements: ['Empirical sources', 'Observational trials'],
    };
    onChange([...questions, newTask]);
    setNewQuestionText('');
    setIsAdding(false);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (disabled) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= questions.length) return;
    const next = [...questions];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Research Sub-Questions ({questions.length})
        </h4>
        {!disabled && !isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Question</span>
          </button>
        )}
      </div>

      <div className="space-y-2">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="flex items-start gap-2 p-2.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all group"
          >
            {!disabled && (
              <div className="flex flex-col gap-0.5 mt-0.5 text-zinc-400 opacity-60 group-hover:opacity-100">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 text-[10px] leading-none disabled:opacity-30"
                  aria-label="Move question up"
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={idx === questions.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 text-[10px] leading-none disabled:opacity-30"
                  aria-label="Move question down"
                >
                  ▼
                </button>
              </div>
            )}

            <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 mt-0.5 w-4">
              {idx + 1}.
            </span>

            <div className="flex-1 min-w-0">
              {editingId === q.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(q.id)}
                    className="flex-1 text-xs border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(q.id)}
                    className="p-1 text-zinc-700 dark:text-zinc-300 hover:text-emerald-600"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-snug">
                  {q.question}
                </p>
              )}
            </div>

            {!disabled && editingId !== q.id && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleStartEdit(q)}
                  className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  aria-label="Edit question"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(q.id)}
                  disabled={questions.length <= 1}
                  className="p-1 text-zinc-400 hover:text-rose-600 disabled:opacity-30"
                  aria-label="Delete question"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        ))}

        {isAdding && (
          <div className="flex items-center gap-2 p-2 rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40">
            <input
              type="text"
              placeholder="Enter new research sub-question..."
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddQuestion()}
              className="flex-1 text-xs bg-transparent px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 focus:outline-none"
              autoFocus
            />
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-2.5 py-1 text-xs bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded font-medium"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2 py-1 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
