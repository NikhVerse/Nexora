import React, { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { ResearchDepth } from '../../types';
import { cn } from '../../lib/utils';

interface ResearchInputProps {
  onSubmit: (question: string, depth: ResearchDepth) => Promise<void>;
  isLoading?: boolean;
}

export const ResearchInput: React.FC<ResearchInputProps> = ({
  onSubmit,
  isLoading = false
}) => {
  const [question, setQuestion] = useState('');
  const [depth, setDepth] = useState<ResearchDepth>('standard');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    onSubmit(question.trim(), depth);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const depths: { id: ResearchDepth; label: string; desc: string }[] = [
    { id: 'quick', label: 'Quick', desc: 'Fewer queries & faster synthesis' },
    { id: 'standard', label: 'Standard', desc: 'Balanced research & verification' },
    { id: 'deep', label: 'Deep', desc: 'Extensive cross-checking & analysis' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto text-left">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
          Research beyond the first answer.
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
          Break complex questions into focused research, verify the evidence, and synthesize findings you can trace back to their sources.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 bg-white dark:bg-zinc-900 shadow-sm focus-within:ring-1 focus-within:ring-zinc-900 dark:focus-within:ring-zinc-100 transition-all">
          <label htmlFor="research-input" className="block text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-1">
            What do you want to research?
          </label>
          <textarea
            id="research-input"
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Compare the impact of generative AI coding assistants on developer productivity from 2023 to 2026."
            className="w-full resize-none border-0 p-0 text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 bg-transparent focus:outline-none focus:ring-0"
            disabled={isLoading}
          />

          <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800/60 mt-2">
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Press <kbd className="px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-[10px]">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-[10px]">Enter</kbd> to submit
            </span>
          </div>
        </div>

        {/* Depth Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Research depth">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mr-1.5 font-medium">Depth:</span>
            {depths.map((d) => (
              <button
                type="button"
                key={d.id}
                onClick={() => setDepth(d.id)}
                className={cn(
                  "px-2.5 py-1 text-xs rounded-md border transition-all text-left",
                  depth === d.id
                    ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 font-medium"
                    : "bg-transparent text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                )}
              >
                {d.label}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={!question.trim() || isLoading}
            className={cn(
              "inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all shadow-sm",
              question.trim() && !isLoading
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer"
                : "bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed"
            )}
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

        <div className="pt-6 text-center">
          <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
            Plan &rarr; Research &rarr; Verify &rarr; Synthesize
          </p>
        </div>
      </form>
    </div>
  );
};
