import React from 'react';
import { Source } from '../../types';
import { Table } from 'lucide-react';

interface EvidenceMatrixItem {
  finding: string;
  dimension?: string;
  supportingSourceIds: string[];
  conflictingSourceIds: string[];
  confidence: 'high' | 'medium' | 'low';
}

interface EvidenceMatrixProps {
  items: EvidenceMatrixItem[];
  sources: Source[];
  className?: string;
}

export const EvidenceMatrix: React.FC<EvidenceMatrixProps> = ({
  items,
  sources,
  className
}) => {
  const getPublisher = (id: string) => {
    const s = sources.find((src) => src.id === id);
    return s ? s.publisher : 'Source';
  };

  if (!items || items.length === 0) return null;

  return (
    <div className={`space-y-3 text-left ${className || ''}`}>
      <div className="flex items-center gap-1.5 pb-1">
        <Table className="w-3.5 h-3.5 text-zinc-400" />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Evidence Matrix
        </h4>
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium">
              <th className="py-2.5 px-3">Finding</th>
              <th className="py-2.5 px-3">Supporting Sources</th>
              <th className="py-2.5 px-3">Conflicting Sources</th>
              <th className="py-2.5 px-3">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
            {items.map((row, idx) => (
              <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                <td className="py-3 px-3 font-medium text-zinc-800 dark:text-zinc-200 max-w-sm">
                  {row.finding}
                </td>
                <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400">
                  <div className="flex flex-wrap gap-1">
                    {row.supportingSourceIds.length > 0 ? (
                      row.supportingSourceIds.map((id, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px]">
                          {getPublisher(id)}
                        </span>
                      ))
                    ) : (
                      <span className="text-zinc-400 text-[11px]">—</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400">
                  <div className="flex flex-wrap gap-1">
                    {row.conflictingSourceIds.length > 0 ? (
                      row.conflictingSourceIds.map((id, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-[10px]">
                          {getPublisher(id)}
                        </span>
                      ))
                    ) : (
                      <span className="text-zinc-400 text-[11px]">None</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-3 uppercase font-mono text-[10px] text-zinc-500">
                  <span className={`px-2 py-0.5 rounded ${
                    row.confidence === 'high' 
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300' 
                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}>
                    {row.confidence}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
