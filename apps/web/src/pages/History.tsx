import React, { useState, useEffect } from 'react';
import { ResearchSession } from '../types';
import { listResearch, deleteResearch } from '../lib/api';
import { formatDate } from '../lib/utils';
import { Search, Trash2, ArrowUpRight, Clock, Loader2 } from 'lucide-react';

interface HistoryProps {
  onSelectSession: (id: string) => void;
  onNewResearch: () => void;
}

export const History: React.FC<HistoryProps> = ({ onSelectSession, onNewResearch }) => {
  const [sessions, setSessions] = useState<ResearchSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async (query?: string) => {
    try {
      setIsLoading(true);
      const data = await listResearch(query);
      setSessions(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory(searchQuery);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteResearch(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 text-left space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Research History
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Past investigations, structured evidence dossiers, and cited reports.
          </p>
        </div>

        <button
          type="button"
          onClick={onNewResearch}
          className="px-3.5 py-1.5 text-xs font-medium bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-md shadow-2xs hover:opacity-90 transition-opacity"
        >
          New Research
        </button>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Search past research inquiries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
        />
      </form>

      {/* List */}
      {isLoading ? (
        <div className="py-16 text-center text-zinc-400">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
          <p className="text-xs font-mono">Loading history...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
          <Clock className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto" />
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            No research sessions found.
          </p>
          <p className="text-xs text-zinc-400">
            Inquiries and reports you generate will automatically be preserved here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
          {sessions.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectSession(item.id)}
              className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors group"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="font-mono text-[11px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {item.depth}
                  </span>
                  <span>·</span>
                  <span>{formatDate(item.created_at)}</span>
                  <span>·</span>
                  <span className="capitalize">{item.status}</span>
                </div>

                <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:underline underline-offset-2">
                  {item.question}
                </h3>

                {item.objective && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                    {item.objective}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors">
                <button
                  type="button"
                  onClick={(e) => handleDelete(item.id, e)}
                  className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-rose-600 transition-colors"
                  aria-label="Delete research session"
                  title="Delete session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="p-1.5">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
