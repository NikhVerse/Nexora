import React, { useState } from 'react';
import { Source } from '../../types';
import { SourceCard } from './SourceCard';
import { Search, Database } from 'lucide-react';

interface SourceListProps {
  sources: Source[];
  evidenceMap?: Record<string, number>;
  onSelectSource?: (source: Source) => void;
  className?: string;
}

export const SourceList: React.FC<SourceListProps> = ({
  sources,
  evidenceMap = {},
  onSelectSource,
  className
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = sources.filter(
    (s) =>
      s.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.publisher.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className={`space-y-3 text-left ${className || ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-zinc-400" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Collected Sources ({sources.length})
          </h4>
        </div>
      </div>

      {sources.length > 3 && (
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Filter sources..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full text-xs bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 pl-8 pr-3 py-1.5 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700 text-zinc-800 dark:text-zinc-200"
          />
        </div>
      )}

      {sources.length === 0 ? (
        <div className="py-8 text-center text-xs text-zinc-400 dark:text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
          No sources discovered yet.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((src, index) => (
            <SourceCard
              key={src.id}
              source={src}
              index={index}
              evidenceCount={evidenceMap[src.id] || 0}
              onClick={() => onSelectSource && onSelectSource(src)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
