import datetime
import uuid
from typing import List, Optional
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime.datetime:
    return datetime.datetime.now(datetime.timezone.utc)

class ResearchSession(Base):
    __tablename__ = "research_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(512), nullable=False)
    question = Column(Text, nullable=False)
    depth = Column(String(32), default="standard")  # quick, standard, deep
    status = Column(String(32), default="planning") # planning, ready, researching, completed, failed
    current_stage = Column(String(32), default="planning") # question, planning, tasks, evidence, verification, synthesis, report
    
    objective = Column(Text, nullable=True)
    strategy = Column(Text, nullable=True)
    dimensions = Column(JSON, default=list) # List[str]
    evidence_requirements = Column(JSON, default=list) # List[str]
    
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    tasks = relationship("ResearchTask", back_populates="session", cascade="all, delete-orphan", lazy="selectin")
    sources = relationship("Source", back_populates="session", cascade="all, delete-orphan", lazy="selectin")
    evidence_items = relationship("Evidence", back_populates="session", cascade="all, delete-orphan", lazy="selectin")
    findings = relationship("Finding", back_populates="session", cascade="all, delete-orphan", lazy="selectin")
    report = relationship("Report", back_populates="session", uselist=False, cascade="all, delete-orphan", lazy="selectin")


class ResearchTask(Base):
    __tablename__ = "research_tasks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("research_sessions.id", ondelete="CASCADE"), nullable=False)
    question = Column(Text, nullable=False)
    priority = Column(String(32), default="medium") # high, medium, low
    status = Column(String(32), default="pending")  # pending, active, completed, failed
    evidence_requirements = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    session = relationship("ResearchSession", back_populates="tasks")


class Source(Base):
    __tablename__ = "sources"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("research_sessions.id", ondelete="CASCADE"), nullable=False)
    task_id = Column(String(36), nullable=True)
    title = Column(String(512), nullable=False)
    url = Column(String(2048), nullable=False)
    publisher = Column(String(256), nullable=False)
    published_at = Column(String(64), nullable=True)
    snippet = Column(Text, nullable=True)
    source_type = Column(String(64), default="web") # academic, government, technical_report, journalism, expert_analysis, web
    verification_status = Column(String(32), default="unverified") # verified, partially_supported, weak_evidence, conflicting, unverified
    raw_content = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    session = relationship("ResearchSession", back_populates="sources")
    evidence_items = relationship("Evidence", back_populates="source", cascade="all, delete-orphan", lazy="selectin")


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("research_sessions.id", ondelete="CASCADE"), nullable=False)
    source_id = Column(String(36), ForeignKey("sources.id", ondelete="CASCADE"), nullable=False)
    task_id = Column(String(36), nullable=True)
    
    claim = Column(Text, nullable=False)
    evidence = Column(Text, nullable=False)
    context = Column(Text, nullable=True)
    claim_type = Column(String(32), default="fact") # fact, interpretation, inference
    confidence = Column(String(32), default="high") # high, medium, low
    limitations = Column(JSON, default=list) # List[str]
    verification_status = Column(String(32), default="verified") # verified, partially_supported, weak_evidence, conflicting, unverified
    verification_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    session = relationship("ResearchSession", back_populates="evidence_items")
    source = relationship("Source", back_populates="evidence_items")


class Finding(Base):
    __tablename__ = "findings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("research_sessions.id", ondelete="CASCADE"), nullable=False)
    dimension = Column(String(128), default="General")
    finding = Column(Text, nullable=False)
    supporting_source_ids = Column(JSON, default=list) # List[str]
    conflicting_source_ids = Column(JSON, default=list) # List[str]
    confidence = Column(String(32), default="high")
    contradiction_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    session = relationship("ResearchSession", back_populates="findings")


class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("research_sessions.id", ondelete="CASCADE"), unique=True, nullable=False)
    title = Column(String(512), nullable=False)
    executive_summary = Column(Text, nullable=False)
    key_findings = Column(JSON, default=list) # List[str]
    detailed_analysis = Column(JSON, default=list) # List[dict] {dimension, heading, content, citations: [int]}
    conflicting_evidence = Column(JSON, default=list) # List[dict] {topic, finding_a, finding_b, explanation, conclusion}
    limitations = Column(JSON, default=list) # List[str]
    conclusion = Column(Text, nullable=False)
    citations = Column(JSON, default=list) # List[dict] {id: int, source_id, title, publisher, url, claim, quote, confidence}
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    session = relationship("ResearchSession", back_populates="report")


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(512), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan", lazy="selectin", order_by="ChatMessage.created_at")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(32), nullable=False)      # "user" | "assistant"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    session = relationship("ChatSession", back_populates="messages")
