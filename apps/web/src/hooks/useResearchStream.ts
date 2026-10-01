import { useRef, useCallback } from 'react';
import { Source, Evidence, ContradictionItem, Report } from '../types';
import { getSources, getEvidence, getReport } from '../lib/api';

interface UseResearchStreamProps {
  onProgress?: (p: { type: string; stage: string; message: string; data?: Record<string, any> }) => void;
  onStageComplete?: (stage: string) => void;
  onSourcesUpdate?: (sources: Source[]) => void;
  onEvidenceUpdate?: (evidence: Evidence[]) => void;
  onContradictionsUpdate?: (contradictions: ContradictionItem[]) => void;
  onReportReady?: (report: Report) => void;
  onComplete?: () => void;
  onError?: () => void;
}

export function useResearchStream({
  onProgress,
  onStageComplete,
  onSourcesUpdate,
  onEvidenceUpdate,
  onContradictionsUpdate,
  onReportReady,
  onComplete,
  onError,
}: UseResearchStreamProps) {
  const eventSourceRef = useRef<EventSource | null>(null);

  const startStream = useCallback((sessionId: string) => {
    if (!sessionId) return;

    // Close existing connection if any
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const url = `/api/research/${sessionId}/stream`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = async (event) => {
      try {
        const parsed = JSON.parse(event.data) as {
          type: string;
          stage: string;
          message: string;
          data?: Record<string, any>;
        };

        // Fire progress callback
        onProgress?.(parsed);

        if (parsed.type === 'stage_completed') {
          onStageComplete?.(parsed.stage);

          // Fetch relevant data when each stage finishes
          if (parsed.stage === 'tasks') {
            try {
              const sources = await getSources(sessionId);
              onSourcesUpdate?.(sources);
            } catch {}
          }

          if (parsed.stage === 'evidence' || parsed.stage === 'verification') {
            try {
              const evidence = await getEvidence(sessionId);
              onEvidenceUpdate?.(evidence);
            } catch {}
          }
        }

        if (parsed.type === 'complete') {
          // Fetch final data
          try {
            const [sources, evidence, report] = await Promise.all([
              getSources(sessionId),
              getEvidence(sessionId),
              getReport(sessionId),
            ]);
            onSourcesUpdate?.(sources);
            onEvidenceUpdate?.(evidence);

            // Extract contradictions from the report's conflicting_evidence
            if (report?.conflicting_evidence?.length) {
              onContradictionsUpdate?.(report.conflicting_evidence);
            }
            onReportReady?.(report);
          } catch {}

          es.close();
          onComplete?.();
        } else if (parsed.type === 'error') {
          es.close();
          onError?.();
        }
      } catch (err) {
        console.error('Failed to parse SSE event:', err);
      }
    };

    es.onerror = () => {
      console.warn('SSE stream closed');
      es.close();
    };
  }, [onProgress, onStageComplete, onSourcesUpdate, onEvidenceUpdate, onContradictionsUpdate, onReportReady, onComplete, onError]);

  const stopStream = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  return { startStream, stopStream };
}
