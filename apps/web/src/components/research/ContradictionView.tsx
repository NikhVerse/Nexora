import React from 'react';
import { GitMerge, ArrowRight } from 'lucide-react';
import { ContradictionItem } from '../../types';

interface ContradictionViewProps {
  contradictions: ContradictionItem[];
}

export const ContradictionView: React.FC<ContradictionViewProps> = ({ contradictions }) => {
  if (!contradictions.length) return null;

  return (
    <div className="space-y-3">
      {contradictions.map((c, i) => (
        <div
          key={i}
          className="rounded-xl border overflow-hidden"
          style={{ border: '1px solid var(--border)' }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-2 px-4 py-2.5"
            style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}
          >
            <GitMerge className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
              {c.topic}
            </span>
            <span
              className="ml-auto text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--badge-conflict-bg)', color: 'var(--badge-conflict-text)' }}
            >
              Conflict
            </span>
          </div>

          <div className="p-4 grid grid-cols-2 gap-3">
            {/* Side A */}
            <div className="rounded-lg p-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Position A</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{c.finding_a}</p>
            </div>
            {/* Side B */}
            <div className="rounded-lg p-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Position B</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{c.finding_b}</p>
            </div>
          </div>

          {/* Explanation */}
          {(c.explanation || c.conclusion) && (
            <div
              className="px-4 py-3 space-y-2"
              style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}
            >
              {c.explanation && (
                <div className="flex items-start gap-2.5">
                  <ArrowRight className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{c.explanation}</p>
                </div>
              )}
              {c.conclusion && (
                <p className="text-sm leading-relaxed pl-6 font-medium" style={{ color: 'var(--text)' }}>{c.conclusion}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
