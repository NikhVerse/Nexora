import React from 'react';
import { X, ExternalLink, Quote, ShieldCheck } from 'lucide-react';
import { CitationItem } from '../../types';

interface CitationPanelProps {
  citation: CitationItem | null;
  onClose: () => void;
}

export const CitationPanel: React.FC<CitationPanelProps> = ({
  citation,
  onClose,
}) => {
  if (!citation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl space-y-4 text-left animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded font-mono text-xs font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
              [{citation.id}]
            </span>
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
              Citation Verification
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            aria-label="Close citation modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Source metadata */}
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
            Source Publication
          </span>
          <h4 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-50 leading-snug">
            {citation.title}
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            {citation.publisher}
          </p>
        </div>

        {/* Claim */}
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
            Supported Claim
          </span>
          <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed">
            {citation.claim}
          </p>
        </div>

        {/* Exact Evidence Quote */}
        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80 space-y-1">
          <span className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1">
            <Quote className="w-3.5 h-3.5" />
            <span>Extracted Empirical Evidence</span>
          </span>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 italic leading-relaxed">
            "{citation.quote}"
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Source</span>
          </span>

          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity"
          >
            <span>Open Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
