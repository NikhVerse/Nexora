import React from 'react';
import { ExternalLink, Calendar, Globe } from 'lucide-react';
import { Source } from '../../types';
import { VerificationBadge } from './VerificationBadge';

interface SourceCardProps {
  source: Source;
  index: number;
  evidenceCount?: number;
  onClick?: () => void;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source, index, evidenceCount, onClick }) => {
  const domain = (() => {
    try { return new URL(source.url).hostname.replace('www.', ''); } catch { return source.url; }
  })();

  return (
    <div
      className="px-4 py-3 rounded-xl border cursor-pointer transition-all"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div className="flex items-start gap-3">
        {/* Index */}
        <span
          className="text-xs font-mono mt-0.5 w-5 text-right shrink-0"
          style={{ color: 'var(--text-muted)' }}
        >
          {index + 1}
        </span>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <p className="text-sm font-medium leading-snug mb-1 line-clamp-2" style={{ color: 'var(--text)' }}>
            {source.title}
          </p>

          {/* Meta row */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Globe className="w-3 h-3" />
              {domain}
            </span>
            {source.published_at && (
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Calendar className="w-3 h-3" />
                {source.published_at}
              </span>
            )}
            <VerificationBadge status={source.verification_status as any || 'unverified'} />
            {typeof evidenceCount === 'number' && evidenceCount > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                {evidenceCount} {evidenceCount === 1 ? 'evidence item' : 'evidence items'}
              </span>
            )}
          </div>
        </div>

        {/* Link icon */}
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 mt-0.5 p-1 rounded transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
