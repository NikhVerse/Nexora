import React, { useState } from 'react';
import { Evidence, Source } from '../../types';
import { EvidenceCard } from './EvidenceCard';
import { cn } from '../../lib/utils';

interface EvidencePanelProps {
  evidenceList: Evidence[];
  sources?: Source[];
  onSelectSource?: (sourceId: string) => void;
  className?: string;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  evidenceList,
  sources = [],
  onSelectSource,
  className
}) => {
  const [filter, setFilter] = useState<'all' | 'verified' | 'conflicting' | 'unverified'>('all');

  const filtered = evidenceList.filter((e) => {
    if (filter === 'all') return true;
    if (filter === 'verified') return e.verification_status === 'verified';
    if (filter === 'conflicting') return e.verification_status === 'conflicting';
    if (filter === 'unverified') return e.verification_status === 'unverified';
    return true;
  });

  const conflictCount = evidenceList.filter((e) => e.verification_status === 'conflicting').length;
  const verifiedCount = evidenceList.filter((e) => e.verification_status === 'verified').length;

  return (
    <div className={cn("space-y-4 text-left", className)}>
      {/* Overview Counts */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Structured Evidence
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            {evidenceList.length} findings · {verifiedCount} verified · {sources.length} sources · {conflictCount} conflicts
          </p>
        </div>

        {/* Filter Buttons (Section 42) */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-md text-xs">
          {(['all', 'verified', 'conflicting', 'unverified'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setFilter(mode)}
              className={cn(
                "px-2.5 py-1 rounded text-xs capitalize transition-all",
                filter === mode
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-medium shadow-2xs"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-xs text-zinc-400 dark:text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
          No evidence items match the selected filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            // Bind source if available
            const boundSource = sources.find((s) => s.id === item.source_id);
            const itemWithSource = { ...item, source: boundSource || item.source };
            return (
              <EvidenceCard
                key={item.id}
                evidence={itemWithSource}
                onClickSource={onSelectSource}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
