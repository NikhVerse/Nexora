from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Any, Dict
from datetime import datetime

# --- Source Schemas ---
class SourceBase(BaseModel):
    title: str
    url: str
    publisher: str
    published_at: Optional[str] = None
    snippet: Optional[str] = None
    source_type: str = "web"
    verification_status: str = "unverified"

class SourceResponse(SourceBase):
    id: str
    session_id: str
    task_id: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Evidence Schemas ---
class EvidenceBase(BaseModel):
    claim: str
    evidence: str
    context: Optional[str] = None
    claim_type: str = "fact"  # fact, interpretation, inference
    confidence: str = "high"   # high, medium, low
    limitations: List[str] = Field(default_factory=list)
    verification_status: str = "verified" # verified, partially_supported, weak_evidence, conflicting, unverified
    verification_notes: Optional[str] = None

class EvidenceResponse(EvidenceBase):
    id: str
    session_id: str
    source_id: str
    task_id: Optional[str] = None
    created_at: datetime
    source: Optional[SourceResponse] = None

    model_config = ConfigDict(from_attributes=True)

class FindingResponse(BaseModel):
    id: str
    session_id: str
    dimension: str
    finding: str
    supporting_source_ids: List[str] = Field(default_factory=list)
    conflicting_source_ids: List[str] = Field(default_factory=list)
    confidence: str = "high"
    contradiction_notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Report Schemas ---
class CitationItem(BaseModel):
    id: int
    source_id: str
    title: str
    publisher: str
    url: str
    claim: str
    quote: str
    confidence: str = "high"

class AnalysisSection(BaseModel):
    dimension: str
    heading: str
    content: str
    citations: List[int] = Field(default_factory=list)

class ContradictionItem(BaseModel):
    topic: str
    finding_a: str
    finding_b: str
    explanation: str
    conclusion: str

class ReportResponse(BaseModel):
    id: str
    session_id: str
    title: str
    executive_summary: str
    key_findings: List[str] = Field(default_factory=list)
    detailed_analysis: List[AnalysisSection] = Field(default_factory=list)
    conflicting_evidence: List[ContradictionItem] = Field(default_factory=list)
    limitations: List[str] = Field(default_factory=list)
    conclusion: str
    citations: List[CitationItem] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Task Schemas ---
class ResearchTaskBase(BaseModel):
    question: str
    priority: str = "medium"
    evidence_requirements: List[str] = Field(default_factory=list)

class ResearchTaskResponse(ResearchTaskBase):
    id: str
    session_id: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ResearchPlanQuestion(BaseModel):
    id: Optional[str] = None
    question: str
    priority: str = "medium"
    evidence_requirements: List[str] = Field(default_factory=list)

class ResearchPlanUpdate(BaseModel):
    objective: Optional[str] = None
    strategy: Optional[str] = None
    dimensions: Optional[List[str]] = None
    questions: List[ResearchPlanQuestion]

# --- Research Session Schemas ---
class ResearchCreate(BaseModel):
    question: str = Field(..., min_length=2, description="The research question to explore")
    depth: str = Field(default="standard", description="Research depth: quick, standard, deep")

class ResearchSessionResponse(BaseModel):
    id: str
    title: str
    question: str
    depth: str
    status: str
    current_stage: str
    objective: Optional[str] = None
    strategy: Optional[str] = None
    dimensions: List[str] = Field(default_factory=list)
    evidence_requirements: List[str] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime
    tasks: List[ResearchTaskResponse] = Field(default_factory=list)
    report: Optional[ReportResponse] = None

    model_config = ConfigDict(from_attributes=True)

class ResearchStreamEvent(BaseModel):
    type: str # stage_started, progress, stage_completed, error, complete
    stage: Optional[str] = None
    message: str
    data: Optional[Dict[str, Any]] = None

# --- Chat Schemas ---
class ChatMessage(BaseModel):
    role: str # user, assistant, system
    content: str

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    history: List[ChatMessage] = Field(default_factory=list)

class ChatCitation(BaseModel):
    title: str
    url: str
    publisher: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    suggested_questions: List[str] = Field(default_factory=list)
    citations: List[ChatCitation] = Field(default_factory=list)
