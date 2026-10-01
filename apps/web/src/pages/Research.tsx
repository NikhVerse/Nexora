import React, { useState, useEffect, useCallback } from 'react';
import { Database, FileText, GitMerge, BookOpen } from 'lucide-react';
import { ResearchSession, ResearchTask, Source, Evidence, ContradictionItem, Report } from '../types';
import { ResearchPipeline } from '../components/research/ResearchPipeline';
import { SourceCard } from '../components/research/SourceCard';
import { EvidenceCard } from '../components/research/EvidenceCard';
import { ContradictionView } from '../components/research/ContradictionView';
import { ReportView } from '../components/research/ReportView';
import { ResearchPlanner } from '../components/research/ResearchPlanner';
import { useResearchStream } from '../hooks/useResearchStream';
import { getResearch, approveResearchPlan } from '../lib/api';

interface ResearchPageProps {
  sessionId: string;
  onSessionReady?: (session: ResearchSession) => void;
}

type ActivePanel = 'sources' | 'evidence' | 'contradictions' | 'report';

const PANELS: { key: ActivePanel; label: string; Icon: React.FC<any> }[] = [
  { key: 'sources',        label: 'Sources',        Icon: Database    },
  { key: 'evidence',       label: 'Evidence',       Icon: FileText    },
  { key: 'contradictions', label: 'Contradictions', Icon: GitMerge    },
  { key: 'report',         label: 'Report',         Icon: BookOpen    },
];

export const Research: React.FC<ResearchPageProps> = ({ sessionId, onSessionReady }) => {
  const [session, setSession] = useState<ResearchSession | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [contradictions, setContradictions] = useState<ContradictionItem[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  const [activePanel, setActivePanel] = useState<ActivePanel>('sources');
  const [approving, setApproving] = useState(false);
  const [planApproved, setPlanApproved] = useState(false);
  const [currentStage, setCurrentStage] = useState('');
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [progress, setProgress] = useState<any>(null);

  const loadSession = useCallback(async () => {
    try {
      const s = await getResearch(sessionId);
      setSession(s);
      onSessionReady?.(s);
      if (s.status !== 'planning' && s.status !== 'ready') setPlanApproved(true);
    } catch {}
  }, [sessionId, onSessionReady]);

  useEffect(() => { loadSession(); }, [loadSession]);

  const { startStream } = useResearchStream({
    onProgress: (p) => {
      setProgress(p);
      if (p.stage) setCurrentStage(p.stage);
    },
    onStageComplete: (stage) => setCompletedStages((p) => [...new Set([...p, stage])]),
    onSourcesUpdate: (s) => { setSources(s); setActivePanel('sources'); },
    onEvidenceUpdate: (e) => { setEvidence(e); setActivePanel('evidence'); },
    onContradictionsUpdate: (c) => { setContradictions(c); if (c.length) setActivePanel('contradictions'); },
    onReportReady: (r) => { setReport(r); setActivePanel('report'); },
    onComplete: () => loadSession(),
    onError: () => loadSession(),
  });

  const handleApprove = async (tasks: ResearchTask[]) => {
    if (!session) return;
    setApproving(true);
    try {
      await approveResearchPlan(session.id, tasks);
      setPlanApproved(true);
      startStream(session.id);
    } catch { setApproving(false); }
  };

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</div>
      </div>
    );
  }

  // Show planner if not yet approved
  if (!planApproved && (session.status === 'ready' || session.status === 'planning')) {
    return (
      <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg)' }}>
        <ResearchPlanner session={session} onApprove={handleApprove} isLoading={approving} />
      </div>
    );
  }

  const isRunning = session.status === 'researching';

  return (
    <div className="flex-1 flex overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Left panel: pipeline + question */}
      <div
        className="w-64 flex-shrink-0 flex flex-col overflow-y-auto"
        style={{ borderRight: '1px solid var(--border)' }}
      >
        {/* Question */}
        <div className="px-4 pt-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Question</p>
          <p className="text-sm leading-snug font-medium" style={{ color: 'var(--text)' }}>{session.question}</p>
        </div>

        {/* Pipeline steps */}
        <div className="py-2">
          <ResearchPipeline
            currentStage={currentStage}
            completedStages={completedStages}
            progress={progress}
          />
        </div>
      </div>

      {/* Center: tab content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tab bar */}
        <div
          className="flex items-center gap-1 px-4 py-2 shrink-0 overflow-x-auto"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          {PANELS.map(({ key, label, Icon }) => {
            const count = key === 'sources' ? sources.length
              : key === 'evidence' ? evidence.length
              : key === 'contradictions' ? contradictions.length
              : undefined;
            const active = activePanel === key;
            return (
              <button
                key={key}
                onClick={() => setActivePanel(key)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all"
                style={{
                  background: active ? 'var(--surface)' : 'transparent',
                  color: active ? 'var(--text)' : 'var(--text-muted)',
                  fontWeight: active ? 500 : 400,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
                {count !== undefined && count > 0 && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-y-auto">
          {activePanel === 'sources' && (
            <div className="p-4 space-y-2">
              {sources.length === 0 && (
                <p className="px-1 py-6 text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                  {isRunning ? 'Gathering sources...' : 'No sources yet'}
                </p>
              )}
              {sources.map((s, i) => <SourceCard key={s.id} source={s} index={i} />)}
            </div>
          )}

          {activePanel === 'evidence' && (
            <div className="p-4 space-y-2">
              {evidence.length === 0 && (
                <p className="px-1 py-6 text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                  {isRunning ? 'Extracting evidence...' : 'No evidence yet'}
                </p>
              )}
              {evidence.map((e) => <EvidenceCard key={e.id} evidence={e} />)}
            </div>
          )}

          {activePanel === 'contradictions' && (
            <div className="p-4">
              {contradictions.length === 0 ? (
                <p className="py-6 text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                  {isRunning ? 'Analysing contradictions...' : 'No contradictions detected'}
                </p>
              ) : (
                <ContradictionView contradictions={contradictions} />
              )}
            </div>
          )}

          {activePanel === 'report' && (
            report
              ? <ReportView report={report} sources={sources} />
              : (
                <p className="py-10 text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                  {isRunning ? 'Synthesising report...' : 'Report will appear here'}
                </p>
              )
          )}
        </div>
      </div>
    </div>
  );
};
