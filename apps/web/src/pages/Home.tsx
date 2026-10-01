import React, { useState, useRef } from 'react';
import { ArrowRight, Loader2, Search, Layers } from 'lucide-react';
import { ResearchDepth } from '../types';

interface HomeProps {
  onSubmit: (question: string, depth: ResearchDepth) => Promise<void>;
  isLoading?: boolean;
}

const DEMO_QUESTIONS = [
  {
    tag: 'DEMO DATA',
    question: 'What are the measurable effects of generative AI coding assistants on software developer productivity?',
    depth: 'standard' as ResearchDepth,
  },
  {
    tag: 'EMPIRICAL',
    question: 'How do sodium-ion battery chemistries compare with lithium-iron-phosphate for grid-scale energy storage?',
    depth: 'standard' as ResearchDepth,
  },
  {
    tag: 'ORGANIZATIONAL',
    question: 'What empirical evidence measures the productivity and retention impacts of four-day workweek trials?',
    depth: 'quick' as ResearchDepth,
  },
];

export const Home: React.FC<HomeProps> = ({ onSubmit, isLoading = false }) => {
  const [question, setQuestion] = useState('');
  const [depth, setDepth] = useState<ResearchDepth>('standard');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed, depth);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const selectExample = (q: string, d: ResearchDepth) => {
    setQuestion(q);
    setDepth(d);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const depthOptions: { key: ResearchDepth; label: string; desc: string }[] = [
    { key: 'quick', label: 'Quick', desc: 'Fewer queries & faster scan' },
    { key: 'standard', label: 'Standard', desc: 'Balanced research & verification' },
    { key: 'deep', label: 'Deep', desc: 'Exhaustive cross-checking & analysis' },
  ];

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 py-12 max-w-3xl mx-auto w-full select-none" style={{ color: 'var(--text)' }}>
      {/* Hero Header */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
          <Layers className="w-3.5 h-3.5 opacity-70" />
          <span>Research. Verify. Synthesize.</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
          Research beyond the first answer.
        </h1>

        <p className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Break complex questions into focused research, verify the evidence, and synthesize findings you can trace back to their sources.
        </p>
      </div>

      {/* Main Research Input Card */}
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-2xl border p-5 shadow-xs transition-all space-y-4"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="space-y-1.5">
          <label
            htmlFor="research-input"
            className="block text-xs font-medium tracking-wide uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            What do you want to research?
          </label>
          <div className="flex items-start gap-2.5">
            <Search className="w-4 h-4 mt-1 shrink-0 opacity-40" />
            <textarea
              id="research-input"
              ref={textareaRef}
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Compare the impact of generative AI coding assistants on developer productivity from 2023 to 2026."
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm sm:text-base focus:outline-none resize-none leading-relaxed placeholder-zinc-400 dark:placeholder-zinc-600"
              style={{ color: 'var(--text)' }}
              autoFocus
            />
          </div>
        </div>

        {/* Depth Selector & Start Research CTA */}
        <div
          className="pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* Depth Options */}
          <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Research depth">
            <span className="text-xs font-medium mr-1" style={{ color: 'var(--text-muted)' }}>
              Depth:
            </span>
            {depthOptions.map(({ key, label, desc }) => {
              const active = depth === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDepth(key)}
                  title={desc}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: active ? 'var(--text)' : 'transparent',
                    color: active ? 'var(--bg)' : 'var(--text-muted)',
                    border: active ? 'none' : '1px solid var(--border)',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Submit Action */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="hidden sm:inline text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Press <kbd className="px-1.5 py-0.5 rounded text-[10px] border" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded text-[10px] border" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>Enter</kbd>
            </span>
            <button
              type="submit"
              disabled={!question.trim() || isLoading}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: 'var(--text)',
                color: 'var(--bg)',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Planning Research...</span>
                </>
              ) : (
                <>
                  <span>Start Research</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Pipeline Stages Subtitle */}
      <div className="mt-4 text-center">
        <p className="text-xs font-mono tracking-wide" style={{ color: 'var(--text-muted)' }}>
          Plan &rarr; Research &rarr; Verify &rarr; Synthesize
        </p>
      </div>

      {/* Curated Inquiries / Demo Questions */}
      <div className="w-full mt-10 space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-center" style={{ color: 'var(--text-muted)' }}>
          Or explore a sample research inquiry
        </p>
        <div className="grid grid-cols-1 gap-2">
          {DEMO_QUESTIONS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => selectExample(item.question, item.depth)}
              className="w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start justify-between gap-3 group"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-strong)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md font-mono"
                    style={{
                      background: item.tag === 'DEMO DATA' ? 'var(--badge-verified-bg)' : 'var(--surface-2)',
                      color: item.tag === 'DEMO DATA' ? 'var(--badge-verified-text)' : 'var(--text-muted)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {item.tag}
                  </span>
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {item.depth.toUpperCase()} DEPTH
                  </span>
                </div>
                <p className="font-medium text-xs sm:text-sm line-clamp-2" style={{ color: 'var(--text)' }}>
                  {item.question}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 mt-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
