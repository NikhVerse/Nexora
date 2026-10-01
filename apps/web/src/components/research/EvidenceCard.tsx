import React from 'react';
import { Quote } from 'lucide-react';
import { Evidence } from '../../types';
import { VerificationBadge } from './VerificationBadge';

interface EvidenceCardProps {
  evidence: Evidence;
  onClick?: () => void;
  onClickSource?: (sourceId: string) => void;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, onClick, onClickSource }) => (
  <div
    className="rounded-xl border p-4 cursor-pointer transition-all"
    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    onClick={onClick}
    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
  >
    {/* Quote */}
    <div className="flex gap-2.5 mb-3">
      <Quote className="w-4 h-4 shrink-0 mt-0.5 opacity-40" style={{ color: 'var(--text-muted)' }} />
      <div className="min-w-0">
        {evidence.claim && (
          <p className="text-xs font-semibold mb-1 line-clamp-2" style={{ color: 'var(--text)' }}>
            {evidence.claim}
          </p>
        )}
        <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-2)' }}>
          {evidence.evidence}
        </p>
      </div>
    </div>

    {/* Footer */}
    <div className="flex items-center gap-2 flex-wrap">
      <VerificationBadge status={evidence.verification_status as any || 'unverified'} />
      {evidence.confidence && (
        <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
          {evidence.confidence}
        </span>
      )}
      {evidence.claim_type && (
        <span
          className="text-xs px-2 py-0.5 rounded-full capitalize"
          style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
        >
          {evidence.claim_type}
        </span>
      )}
      {evidence.source && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onClickSource) onClickSource(evidence.source_id);
          }}
          className="text-xs ml-auto hover:underline font-mono truncate max-w-[140px]"
          style={{ color: 'var(--accent, #6366f1)' }}
        >
          {evidence.source.publisher || evidence.source.title}
        </button>
      )}
    </div>
  </div>
);
