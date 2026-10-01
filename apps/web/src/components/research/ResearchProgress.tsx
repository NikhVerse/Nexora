import React from 'react';
import { Loader2, Search, FileText, ShieldCheck, GitCompare, Sparkles } from 'lucide-react';
import { PipelineStage } from '../../types';
import { cn } from '../../lib/utils';

interface ResearchProgressProps {
  currentStage: PipelineStage | null;
  latestMessage: string;
  sourceCount?: number;
  evidenceCount?: number;
  conflictCount?: number;
  className?: string;
}

export const ResearchProgress: React.FC<ResearchProgressProps> = ({
  currentStage,
  latestMessage,
  sourceCount = 0,
  evidenceCount = 0,
  conflictCount = 0,
  className,
}) => {
  const stageIcons: Record<string, React.ReactNode> = {
    tasks: <Search className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />,
    evidence: <FileText className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />,
    verification: <ShieldCheck className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />,
    contradiction: <GitCompare className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />,
    synthesis: <Sparkles className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />,
  };

  const stageTitles: Record<string, string> = {
    tasks: 'Discovering & Normalizing Sources',
    evidence: 'Extracting Empirical Evidence',
    verification: 'Verifying Claims & Context',
    contradiction: 'Analyzing Conflicting Evidence',
    synthesis: 'Synthesizing Cited Report',
    report: 'Synthesis Complete',
  };

  const activeKey = currentStage || 'tasks';

  return (
    <div className={cn("p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-4 text-left", className)}>
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800">
            {stageIcons[activeKey] || <Loader2 className="w-4 h-4 animate-spin text-zinc-700 dark:text-zinc-300" />}
          </div>
          <div>
            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {stageTitles[activeKey] || 'Executing Research Pipeline'}
            </h4>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Autonomous verification and synthesis in progress
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Live</span>
        </div>
      </div>

      {/* Meaningful Status Message */}
      <div className="p-3 rounded-md bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-mono leading-relaxed">
          {latestMessage || 'Initializing research tasks...'}
        </p>
      </div>

      {/* Metrics Counter */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="p-2.5 rounded-md bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800">
          <span className="block text-[11px] text-zinc-400 dark:text-zinc-500">Sources Found</span>
          <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
            {sourceCount}
          </span>
        </div>
        <div className="p-2.5 rounded-md bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800">
          <span className="block text-[11px] text-zinc-400 dark:text-zinc-500">Evidence Items</span>
          <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
            {evidenceCount}
          </span>
        </div>
        <div className="p-2.5 rounded-md bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800">
          <span className="block text-[11px] text-zinc-400 dark:text-zinc-500">Conflicts Detected</span>
          <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
            {conflictCount}
          </span>
        </div>
      </div>
    </div>
  );
};
