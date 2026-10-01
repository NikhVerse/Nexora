export type ResearchDepth = 'quick' | 'standard' | 'deep';

export type StageStatus = 'pending' | 'active' | 'completed' | 'failed';

export type PipelineStage = 
  | 'question'
  | 'planning'
  | 'tasks'
  | 'evidence'
  | 'verification'
  | 'contradiction'
  | 'synthesis'
  | 'report';

export type VerificationStatus = 
  | 'verified'
  | 'partially_supported'
  | 'weak_evidence'
  | 'conflicting'
  | 'unverified';

export type ClaimType = 'fact' | 'interpretation' | 'inference';

export interface ResearchTask {
  id: string;
  session_id?: string;
  question: string;
  priority: 'high' | 'medium' | 'low';
  status: StageStatus;
  evidence_requirements: string[];
  created_at?: string;
}

export interface Source {
  id: string;
  session_id: string;
  task_id?: string;
  title: string;
  url: string;
  publisher: string;
  published_at?: string;
  snippet?: string;
  source_type: 'academic' | 'government' | 'technical_report' | 'journalism' | 'expert_analysis' | 'web';
  verification_status: VerificationStatus;
  created_at: string;
}

export interface Evidence {
  id: string;
  session_id: string;
  source_id: string;
  task_id?: string;
  claim: string;
  evidence: string;
  context?: string;
  claim_type: ClaimType;
  confidence: 'high' | 'medium' | 'low';
  limitations: string[];
  verification_status: VerificationStatus;
  verification_notes?: string;
  created_at: string;
  source?: Source;
}

export interface Finding {
  id: string;
  session_id: string;
  dimension: string;
  finding: string;
  supporting_source_ids: string[];
  conflicting_source_ids: string[];
  confidence: 'high' | 'medium' | 'low';
  contradiction_notes?: string;
  created_at: string;
}

export interface CitationItem {
  id: number;
  source_id: string;
  title: string;
  publisher: string;
  url: string;
  claim: string;
  quote: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface AnalysisSection {
  dimension: string;
  heading: string;
  content: string;
  citations: number[];
}

export interface ContradictionItem {
  topic: string;
  finding_a: string;
  finding_b: string;
  explanation: string;
  conclusion: string;
}

export interface Report {
  id: string;
  session_id: string;
  title: string;
  executive_summary: string;
  key_findings: string[];
  detailed_analysis: AnalysisSection[];
  conflicting_evidence: ContradictionItem[];
  limitations: string[];
  conclusion: string;
  citations: CitationItem[];
  created_at: string;
  updated_at: string;
}

export interface ResearchSession {
  id: string;
  title: string;
  question: string;
  depth: ResearchDepth;
  status: 'planning' | 'ready' | 'researching' | 'completed' | 'failed';
  current_stage: PipelineStage;
  objective?: string;
  strategy?: string;
  dimensions: string[];
  evidence_requirements: string[];
  created_at: string;
  updated_at: string;
  tasks: ResearchTask[];
  report?: Report;
}

export interface ResearchStreamEvent {
  type: 'stage_started' | 'progress' | 'stage_completed' | 'complete' | 'error';
  stage?: PipelineStage;
  message: string;
  data?: Record<string, any>;
}
