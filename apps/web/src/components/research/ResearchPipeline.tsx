import React from 'react';
import { Search, FileText, ShieldCheck, GitMerge, Sparkles, Check, Loader2, Clock } from 'lucide-react';

const STAGES = [
  { key: 'tasks',          label: 'Research Tasks', Icon: Search       },
  { key: 'evidence',       label: 'Evidence',        Icon: FileText     },
  { key: 'verification',   label: 'Verification',    Icon: ShieldCheck  },
  { key: 'contradiction',  label: 'Analysis',        Icon: GitMerge     },
  { key: 'synthesis',      label: 'Synthesis',       Icon: Sparkles     },
  { key: 'report',         label: 'Report',          Icon: FileText     },
];

interface ResearchPipelineProps {
  currentStage: string;
  completedStages: string[];
  progress?: any | null;
}

export const ResearchPipeline: React.FC<ResearchPipelineProps> = ({
  currentStage,
  completedStages,
  progress,
}) => {
  return (
    <div className="space-y-1 py-2">
      {STAGES.map(({ key, label, Icon }) => {
        const done = completedStages.includes(key);
        const active = currentStage === key;

        return (
          <div
            key={key}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all"
            style={{
              background: active ? 'var(--surface)' : 'transparent',
              color: done ? 'var(--text-2)' : active ? 'var(--text)' : 'var(--text-muted)',
            }}
          >
            {/* Status icon */}
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              {done ? (
                <Check className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              ) : active ? (
                <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--text)' }} />
              ) : (
                <Clock className="w-4 h-4 opacity-30" />
              )}
            </div>

            {/* Stage icon + label */}
            <Icon className="w-4 h-4 shrink-0 opacity-60" />
            <span className="text-sm font-medium">{label}</span>

            {/* Progress bar for active */}
            {active && progress?.percentage !== undefined && (
              <div className="flex-1 flex items-center gap-2 ml-2">
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress.percentage}%`, background: 'var(--accent)' }}
                  />
                </div>
                <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {Math.round(progress.percentage)}%
                </span>
              </div>
            )}

            {/* Step counter */}
            {active && progress?.message && !progress?.percentage && (
              <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
                {progress.message}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
