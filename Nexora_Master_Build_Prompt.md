# NEXORA — MASTER BUILD PROMPT
## Complex Research & Data Synthesis Workspace

> **Product:** Nexora  
> **Tagline:** Research. Verify. Synthesize.  
> **Purpose:** Turn complex research questions into structured, evidence-backed answers through a transparent AI research pipeline.

---

# 1. ROLE

You are acting as a senior full-stack engineer, AI engineer, product designer, UX architect, and technical lead.

Build **Nexora** as a production-quality web application.

Do not create a generic AI chatbot.

Nexora is a focused research and evidence-synthesis workspace.

The core problem:

> A user has a difficult research question. Nexora breaks it into researchable questions, gathers and analyzes evidence, detects contradictions, and produces a traceable final synthesis.

The product must prioritize:

1. Evidence traceability
2. Research accuracy
3. Simple UX
4. Reliable AI orchestration
5. Clean architecture
6. Performance
7. Accessibility

Do not add features merely because they are technically possible.

---

# 2. PRODUCT IDENTITY

## Name

Nexora

## Tagline

Research. Verify. Synthesize.

## Product description

Nexora is a minimalist AI-powered research workspace that transforms complex questions into structured research, verified evidence, contradiction analysis, and a cited final synthesis.

## Brand personality

- Intelligent
- Calm
- Precise
- Professional
- Minimal
- Trustworthy
- Research-oriented

Avoid making Nexora look like a futuristic AI toy.

---

# 3. CORE WORKFLOW

The entire product revolves around one workflow:

```text
Research Question
        ↓
Research Planning
        ↓
Sub-question Decomposition
        ↓
Evidence Discovery
        ↓
Evidence Extraction
        ↓
Verification
        ↓
Contradiction Detection
        ↓
Synthesis
        ↓
Cited Final Report
```

The user must always understand which stage is running.

---

# 4. MVP SCOPE

The MVP contains only:

1. Research question input
2. Research depth selection
3. Research planning
4. Editable sub-questions
5. Research execution
6. Source collection
7. Evidence extraction
8. Source/evidence inspection
9. Verification
10. Contradiction detection
11. Synthesis
12. Inline citations
13. Final report
14. Research history
15. Basic settings

Do NOT build:

- Social features
- Collaboration
- Chat rooms
- Voice mode
- Browser extension
- Mobile app
- AI marketplace
- Prompt marketplace
- Agent marketplace
- Complex analytics
- Billing
- Subscription management
- Notifications
- Team administration
- Plugin marketplace
- Gamification
- Unnecessary dashboards

If a feature does not directly improve research and synthesis, leave it out.

---

# 5. UX PRINCIPLE

Nexora should feel closer to a premium research/document application than an AI chatbot.

Do not build the interface around a chat window.

The primary interface is:

```text
Question
→ Research Plan
→ Evidence
→ Verification
→ Synthesis
→ Report
```

The interface should explain the AI process without exposing unnecessary technical complexity.

---

# 6. LANDING PAGE

Create a minimal landing page.

## Header

Left:

Nexora logo

Center/right:

Research
History
Settings

Keep navigation minimal.

## Hero

Headline:

> Research beyond the first answer.

Supporting copy:

> Break complex questions into focused research, verify the evidence, and synthesize findings you can trace back to their sources.

Primary input:

```text
What do you want to research?
```

Large multiline input.

Example placeholder:

> Compare the impact of generative AI coding assistants on developer productivity from 2023 to 2026.

Below input:

Research depth:

- Quick
- Standard
- Deep

Default:

Standard

Primary button:

**Start Research**

Below the button:

```text
Plan → Research → Verify → Synthesize
```

Do not add a giant marketing section.

---

# 7. RESEARCH WORKSPACE

Desktop layout:

```text
┌────────────┬───────────────────────────────┬───────────────┐
│ Pipeline   │ Main Research Content         │ Evidence      │
│            │                               │ / Sources     │
│            │                               │               │
└────────────┴───────────────────────────────┴───────────────┘
```

## Left panel

Research pipeline.

## Center

Current stage.

## Right panel

Sources, evidence, citations, or contextual information.

On mobile:

- Pipeline becomes a drawer
- Evidence becomes a drawer
- Main content takes full width

---

# 8. RESEARCH PIPELINE UI

Show:

```text
Research Question       ✓
Research Plan           ✓
Research Tasks          ●
Evidence                ○
Verification            ○
Synthesis               ○
Final Report            ○
```

Use subtle indicators.

Do not use giant progress bars.

States:

- pending
- active
- completed
- failed

Use both icon and text so status is not communicated by color alone.

---

# 9. RESEARCH PLANNER

The planner receives the main question.

It must generate:

## Research Objective

One concise paragraph.

## Research Questions

3–7 independently researchable questions.

## Research Dimensions

Examples:

- Adoption
- Cost
- Performance
- Productivity
- Accuracy
- Risks
- Limitations

## Evidence Requirements

Explain what type of evidence is needed.

## Research Strategy

Short explanation of how the investigation should proceed.

Example structure:

```json
{
  "objective": "...",
  "questions": [
    {
      "id": "q1",
      "question": "...",
      "priority": "high",
      "evidence_requirements": []
    }
  ],
  "dimensions": [],
  "strategy": "..."
}
```

The user can:

- Edit a question
- Delete a question
- Add a question
- Reorder questions
- Approve the plan

Do not create a visual node graph.

A simple editable list is better.

CTA:

**Continue Research**

---

# 10. RESEARCH DEPTH

Provide only three modes.

## Quick

- Fewer queries
- Fewer sources
- Faster synthesis

## Standard

- Balanced research
- Multiple sources
- Verification
- Default mode

## Deep

- More source discovery
- More cross-checking
- More detailed synthesis

Do not expose dozens of parameters.

---

# 11. RESEARCH EXECUTION

After approval, execute each research question.

For every task show:

```text
Research Question

Searching...
Analyzing...
Extracting evidence...
Verifying...
Complete
```

The interface should stream meaningful status updates.

Do not expose raw logs.

Example:

```text
Researching productivity studies
8 sources found

Extracting evidence
14 evidence items identified

Cross-checking findings
3 conflicting findings detected
```

---

# 12. SEARCH ARCHITECTURE

Create an abstraction:

```python
class SearchProvider:
    async def search(self, query: str):
        ...

    async def fetch(self, url: str):
        ...

    async def extract(self, content):
        ...
```

Do not tightly couple the core research pipeline to one search provider.

Normalized search result:

```json
{
  "title": "",
  "url": "",
  "publisher": "",
  "published_at": "",
  "snippet": "",
  "source_type": ""
}
```

Search results should be deduplicated.

---

# 13. SOURCE PRIORITY

Prioritize sources approximately in this order:

1. Government / official sources
2. Academic research
3. Primary datasets
4. Official technical reports
5. Reputable journalism
6. Expert analysis
7. General web content

This is a priority heuristic, not an absolute rule.

Source relevance and quality must still be evaluated.

---

# 14. SOURCE CARD

Each source should display:

Title

Publisher

Publication date

Source type

Short description

URL

Evidence count

Verification status

Example:

```text
Research paper title

University / Publisher
2026 · Academic

Evidence
6 extracted claims

Status
Verified

Open Source →
```

Avoid oversized cards.

---

# 15. EVIDENCE EXTRACTION

Convert sources into structured evidence.

Each evidence item:

```json
{
  "id": "",
  "source_id": "",
  "claim": "",
  "evidence": "",
  "context": "",
  "published_at": "",
  "confidence": "high",
  "limitations": []
}
```

Display:

### Claim

What the source supports.

### Evidence

What the source actually reports.

### Context

Population, methodology, time period, etc.

### Limitations

Important qualifications.

### Source

Where it came from.

---

# 16. FACT VS INTERPRETATION

The system must distinguish:

```text
FACT
INTERPRETATION
INFERENCE
```

Example:

FACT:
A study reported a 15% reduction in task completion time.

INTERPRETATION:
This suggests productivity improvement in the study context.

INFERENCE:
The effect may not generalize to all software teams.

Never present inference as established fact.

---

# 17. VERIFICATION

The verification stage should check:

- Does the source support the claim?
- Is the claim represented accurately?
- Is context missing?
- Is the publication date relevant?
- Is the evidence primary or secondary?
- Are there methodological limitations?
- Is the source accessible?
- Is the claim too broad for the evidence?

Possible states:

```text
Verified
Partially Supported
Weak Evidence
Conflicting
Unverified
```

Do not automatically convert uncertain evidence into facts.

---

# 18. CONTRADICTION DETECTION

This is a core feature.

Compare evidence items.

Detect:

- Direct contradictions
- Different numerical findings
- Different populations
- Different methodologies
- Different time periods
- Different definitions
- Different conclusions

Example:

```text
Finding A

AI assistance improved completion time.

Finding B

AI assistance showed no significant improvement.

Why they may differ:

Study A:
Controlled programming tasks.

Study B:
Professional production environment.

Conclusion:

The evidence is mixed and context-dependent.
```

Do not force the system to choose a winner.

---

# 19. EVIDENCE MATRIX

Create a compact evidence table when useful.

Columns:

| Finding | Supporting Sources | Conflicting Sources | Confidence |
|---|---|---|---|

Keep tables readable.

Do not make the application feel like a spreadsheet.

---

# 20. SYNTHESIS ENGINE

The synthesis engine receives:

- Research question
- Research plan
- Verified evidence
- Contradictions
- Source metadata
- Evidence confidence

It must produce:

## Executive Summary

3–6 concise paragraphs.

## Key Findings

5–8 important findings.

## Detailed Analysis

Organized around research dimensions.

## Conflicting Evidence

Explain disagreements.

## Limitations

Explain what cannot be concluded.

## Conclusion

Directly answer the original question.

## Sources

Citation list.

---

# 21. CITATIONS

Every important factual claim should be traceable.

Use:

```text
[1]
[2]
[3]
```

Example:

> Controlled studies have reported productivity improvements under specific task conditions [1][2].

Clicking a citation opens the relevant evidence.

Citation panel:

```text
Source

Title
Publisher
Date

Evidence

"..."

Why this supports the claim

...

Open source
```

Never generate a citation that does not exist.

Never fabricate URLs.

Never fabricate papers.

Never fabricate publication dates.

---

# 22. FINAL REPORT

Final report structure:

```text
RESEARCH TITLE

Executive Summary

Key Findings

Detailed Analysis

Evidence & Contradictions

Limitations

Conclusion

Sources
```

Actions:

- Copy
- Export Markdown
- Export PDF

Keep export UI simple.

---

# 23. REPORT QUALITY

The final answer should:

- Answer the original question
- Preserve uncertainty
- Cite important factual claims
- Explain conflicting evidence
- Mention relevant limitations
- Avoid unsupported conclusions
- Avoid hallucinated references
- Use readable paragraphs
- Use headings
- Use bullets where appropriate

Avoid unnecessarily long reports.

---

# 24. AI PIPELINE

Use separate modules.

Required modules:

```text
research_planner
question_decomposer
query_generator
source_analyzer
evidence_extractor
evidence_validator
contradiction_detector
synthesizer
citation_builder
report_generator
```

Do not build one giant prompt.

Every stage should have:

- Input schema
- Prompt
- Output schema
- Validation
- Retry strategy
- Error handling

---

# 25. PROMPT DESIGN

Every AI prompt follows:

```text
ROLE

TASK

CONTEXT

INPUT

RULES

OUTPUT FORMAT

VALIDATION REQUIREMENTS
```

Example:

```text
ROLE:
You are a research planning agent.

TASK:
Convert the research question into independently researchable questions.

RULES:
1. Do not answer the research question.
2. Avoid redundant questions.
3. Cover the major dimensions.
4. Identify evidence requirements.
5. Return valid structured output.

OUTPUT:
Return JSON matching the provided schema.
```

Use structured outputs whenever possible.

---

# 26. CONTEXT MANAGEMENT

Do not send the entire research corpus to every model call.

Each stage receives only relevant context.

Example:

Planner:

```text
Main question
```

Evidence extractor:

```text
Source content
Research task
```

Contradiction detector:

```text
Relevant evidence items
```

Synthesizer:

```text
Validated evidence
Contradictions
Research question
```

This reduces token usage and improves reliability.

---

# 27. MODEL ABSTRACTION

Create:

```python
class LLMProvider:
    async def generate(self, prompt, schema=None):
        ...
```

Initial provider:

OpenAI-compatible API.

Design architecture so future providers can be added:

- OpenAI
- Gemini
- Anthropic
- OpenRouter
- Local models

Do not expose a huge model-selection interface in the MVP.

---

# 28. BACKEND STACK

Use:

- Python
- FastAPI
- Pydantic
- SQLAlchemy
- PostgreSQL / Supabase

Use async operations where appropriate.

---

# 29. BACKEND STRUCTURE

```text
apps/
  api/

    app/
      main.py

      api/
        routes/
          research.py
          sources.py
          evidence.py
          reports.py

      core/
        config.py
        security.py

      models/
        user.py
        research_session.py
        research_task.py
        source.py
        evidence.py
        finding.py
        report.py

      schemas/
        research.py
        source.py
        evidence.py
        report.py

      services/
        research/
          planner.py
          decomposer.py
          researcher.py
          extractor.py
          verifier.py
          contradiction.py
          synthesizer.py
          citations.py

        llm/
          provider.py
          openai.py

        search/
          provider.py

      prompts/
        planner.py
        decomposer.py
        extractor.py
        verifier.py
        contradiction.py
        synthesizer.py

      db/
        session.py

      utils/
```

Keep services independent and testable.

---

# 30. DATABASE

Required entities:

```text
User
ResearchSession
ResearchTask
Source
Evidence
Finding
Report
```

Relationships:

```text
ResearchSession
    ↓
ResearchTask
    ↓
Source
    ↓
Evidence
    ↓
Finding

ResearchSession
    ↓
Report
```

Do not create unnecessary tables.

---

# 31. RESEARCH SESSION

Example:

```json
{
  "id": "",
  "title": "",
  "question": "",
  "depth": "standard",
  "status": "researching",
  "current_stage": "evidence",
  "created_at": "",
  "updated_at": ""
}
```

Persist progress so users can leave and return.

---

# 32. API

Implement:

```http
POST /research
GET /research/{id}

POST /research/{id}/plan
PATCH /research/{id}/plan

POST /research/{id}/start

GET /research/{id}/stream

GET /research/{id}/sources
GET /research/{id}/evidence

GET /research/{id}/report

DELETE /research/{id}
```

Keep API contracts documented.

---

# 33. STREAMING

For long research processes use SSE or WebSocket.

Prefer SSE if bidirectional communication is not required.

Events:

```json
{
  "type": "stage_started",
  "stage": "evidence_collection"
}
```

```json
{
  "type": "progress",
  "message": "8 sources found"
}
```

```json
{
  "type": "stage_completed",
  "stage": "evidence_collection"
}
```

Do not expose internal model logs.

---

# 34. FRONTEND STACK

Use:

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Motion for React

Use a component architecture.

---

# 35. FRONTEND STRUCTURE

```text
apps/web/

src/

  components/
    ui/

    research/
      ResearchInput.tsx
      ResearchPipeline.tsx
      ResearchPlanner.tsx
      ResearchQuestionList.tsx
      ResearchProgress.tsx
      SourceList.tsx
      SourceCard.tsx
      EvidencePanel.tsx
      EvidenceCard.tsx
      VerificationBadge.tsx
      ContradictionView.tsx
      EvidenceMatrix.tsx
      Citation.tsx
      CitationPanel.tsx
      SynthesisView.tsx
      ReportView.tsx

  pages/
    Home.tsx
    Research.tsx
    History.tsx
    Settings.tsx

  hooks/
    useResearch.ts
    useResearchStream.ts

  lib/
    api.ts
    utils.ts

  types/
```

---

# 36. DESIGN SYSTEM

Nexora must use a restrained visual system.

## Colors

Base:

- White
- Near-white
- Black
- Neutral gray

Use one restrained accent.

Do not use:

- Neon gradients
- Rainbow gradients
- Excessive blue/purple AI styling
- Glowing borders
- Huge colored backgrounds

## Borders

Use subtle 1px borders.

## Radius

Use small to medium radius.

Avoid extremely rounded UI.

## Shadows

Minimal.

Use shadows only when they improve hierarchy.

---

# 37. TYPOGRAPHY

Use:

Inter or Geist.

Typography hierarchy:

```text
Page title
Section title
Subheading
Body
Metadata
```

Body text must be highly readable.

Research content should not be squeezed into narrow cards.

---

# 38. UI COMPONENT RULES

Buttons:

Clear labels.

Prefer:

Start Research
Continue Research
Retry
Open Source
View Evidence

Avoid:

Magic
Supercharge
Boost
Unleash
Ask AI

The UI should communicate exactly what actions do.

---

# 39. HOME SCREEN

Minimal.

Example:

```text
NEXORA

Research beyond the first answer.

Break complex questions into focused research,
verify the evidence, and synthesize traceable findings.

[ What do you want to research?                     ]

Research depth
○ Quick
● Standard
○ Deep

[ Start Research ]

Plan → Research → Verify → Synthesize
```

---

# 40. RESEARCH SCREEN

Header:

```text
< Back

Research title

Standard · Researching
```

Left:

Pipeline.

Center:

Current stage.

Right:

Evidence/source context.

Bottom:

No permanent chat box.

Do not turn the research screen into ChatGPT.

---

# 41. PLANNER SCREEN

Show:

```text
Research Objective

...

Research Questions

1. ...
2. ...
3. ...

Research Dimensions

...

Evidence Requirements

...

[ Edit Plan ] [ Continue Research ]
```

Editable inline.

---

# 42. EVIDENCE SCREEN

Show:

```text
Evidence

14 findings
8 sources
3 conflicts
```

Then evidence list.

Each item:

```text
CLAIM

...

Evidence

...

Source
...

Confidence
High
```

Allow filtering:

- All
- Verified
- Conflicting
- Unverified

Do not build a giant filter system.

---

# 43. CONTRADICTION SCREEN

Show only meaningful conflicts.

Example:

```text
Conflicting Evidence

Productivity

Finding A
...

Finding B
...

Possible explanation

...

What can be concluded

...
```

The purpose is understanding, not scoring sources.

---

# 44. REPORT SCREEN

Report should feel like a clean document.

No excessive cards.

Use:

- typography
- headings
- paragraphs
- lists
- citation links
- subtle dividers

Actions at top:

Copy
Export Markdown
Export PDF

---

# 45. HISTORY

Simple list:

```text
Research history

AI coding assistants and productivity
Today

Impact of renewable energy adoption
Yesterday

...
```

Actions:

Open
Delete

Optional search.

No analytics dashboard.

---

# 46. SETTINGS

Only:

AI provider

API key

Default research depth

Default report style

Theme:

System
Light
Dark

Do not expose internal system configuration.

---

# 47. SECURITY

Never expose API keys in frontend code.

Use backend environment variables.

Create:

```text
.env.example
```

Example:

```env
DATABASE_URL=
OPENAI_API_KEY=
SEARCH_API_KEY=
```

Never commit secrets.

---

# 48. ERROR HANDLING

Human-readable errors.

Examples:

```text
Research could not continue because the search provider did not respond.

[ Retry ]
```

```text
This source could not be accessed.

[ Try Again ]
```

```text
The research model returned an invalid response.

Retrying...
```

Never display raw stack traces to users.

Log technical details server-side.

---

# 49. AI FAILURE STRATEGY

If structured AI output is invalid:

1. Validate
2. Attempt repair
3. Retry using correction prompt
4. If still invalid, fail safely

Never silently accept malformed output.

---

# 50. SOURCE VALIDATION

A source should not become verified merely because an AI model says it is reliable.

Store:

```text
source metadata
retrieval status
content availability
evidence
verification status
```

If source content cannot be verified:

```text
Unverified
```

Do not represent it as confirmed evidence.

---

# 51. HALLUCINATION PREVENTION

The system must never:

- Invent sources
- Invent citations
- Invent URLs
- Invent statistics
- Invent study results
- Invent quotes
- Claim a source supports something it does not support

If evidence is insufficient:

> Insufficient evidence to establish this claim.

Use uncertainty explicitly.

---

# 52. CACHING

Cache expensive operations where possible.

Potential cache keys:

```text
search(query)
fetch(url)
extract(url + task)
```

Do not repeat identical expensive requests unnecessarily.

---

# 53. PERFORMANCE

Optimize for:

- Fast initial UI
- Streaming research status
- Minimal API requests
- Lazy loading evidence
- Efficient database queries

Do not block the entire UI while research runs.

---

# 54. ACCESSIBILITY

Implement:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible labels
- Good contrast
- Screen-reader-friendly status
- Non-color-only status indicators

---

# 55. RESPONSIVE DESIGN

Desktop:

Three-column workspace.

Tablet:

Two-column workspace.

Mobile:

Single column.

Pipeline:

Drawer.

Evidence:

Drawer.

Report:

Full width.

Do not simply shrink desktop UI.

Design mobile intentionally.

---

# 56. DEMO RESEARCH

Include demo mode using clearly labeled synthetic/demo evidence.

Example question:

> What are the measurable effects of generative AI coding assistants on software developer productivity?

Subquestions:

1. What productivity changes have controlled studies measured?
2. What effects have companies reported?
3. What factors influence productivity gains?
4. What limitations exist?
5. What evidence contradicts productivity improvements?

Do not present fabricated citations as real.

Use labels such as:

```text
DEMO DATA
```

---

# 57. TESTING

Backend tests:

- Planner schema validation
- Query generation
- Source normalization
- Evidence extraction
- Verification
- Contradiction detection
- Citation mapping
- Synthesis
- API endpoints
- Database models

Frontend tests:

- Research input
- Planner editing
- Pipeline navigation
- Evidence display
- Citation interaction
- Report rendering
- Responsive behavior

Critical test:

> A report must never reference a citation ID that does not exist.

Critical test:

> A source must never be marked verified without the required verification data.

---

# 58. README

Create a professional README containing:

- Product overview
- Screenshots section
- Features
- Architecture
- AI pipeline
- Tech stack
- Project structure
- Environment setup
- Database setup
- Search configuration
- AI provider configuration
- Local development
- Testing
- Deployment
- Security
- Known limitations
- Future roadmap

---

# 59. DEPLOYMENT

Prepare the project for:

Frontend:

Vercel

Backend:

Render / Railway / Docker

Database:

Supabase PostgreSQL

Include:

```text
Dockerfile
docker-compose.yml
.env.example
```

Do not hardcode production URLs.

---

# 60. DEVELOPMENT PHASES

## Phase 1 — Foundation

Build:

- Monorepo
- Frontend
- Backend
- Database
- Environment configuration
- Base design system

## Phase 2 — Research Planning

Build:

- Research input
- Session creation
- Planner
- Question decomposition
- Editable plan

## Phase 3 — Research

Build:

- Search provider
- Source normalization
- Source storage
- Evidence extraction

## Phase 4 — Verification

Build:

- Evidence validation
- Confidence
- Contradiction detection

## Phase 5 — Synthesis

Build:

- Synthesis engine
- Citation builder
- Report generation

## Phase 6 — Product Polish

Build:

- History
- Settings
- Responsive UI
- Error handling
- Accessibility
- Loading states

## Phase 7 — Production

Run:

- Tests
- Security review
- Performance review
- UI review
- Code cleanup

---

# 61. IMPLEMENTATION RULES

Before writing code:

1. Inspect the repository.
2. Understand existing code.
3. Reuse working code.
4. Do not destroy existing functionality.
5. Create an implementation plan.
6. Build incrementally.

After implementation:

1. Run the frontend.
2. Run the backend.
3. Test the complete research flow.
4. Fix TypeScript errors.
5. Fix Python errors.
6. Fix API errors.
7. Test database persistence.
8. Test AI failures.
9. Review the UI.
10. Remove unnecessary UI.

Do not stop at scaffolding.

The final project must actually run.

---

# 62. UI QUALITY CHECK

Before completion, ask:

Does this look like a serious research tool?

Is the primary action obvious?

Can a first-time user understand the workflow?

Are evidence and citations easy to inspect?

Is uncertainty visible?

Is the interface calm?

Are there unnecessary cards?

Are there unnecessary buttons?

Are there unnecessary animations?

If yes, simplify.

---

# 63. ANIMATION RULES

Use Motion for React only where useful.

Allowed:

- Page transitions
- Panel transitions
- Small status changes
- Evidence appearing
- Drawer transitions

Duration:

Approximately 150–250ms.

Avoid:

- Floating blobs
- Excessive parallax
- Bouncing
- Glowing animations
- Constant movement
- Animated gradients

The product should feel stable.

---

# 64. DESIGN ANTI-PATTERNS

Do NOT create:

```text
AI CHAT
AI CHAT
AI CHAT
```

Do NOT create:

```text
10 dashboard cards
20 metrics
5 floating buttons
```

Do NOT create:

```text
Huge gradient hero
Floating orb
Neon glow
AI robot illustration
```

Do NOT create:

```text
Card
  Card
    Card
      Card
```

Prefer whitespace, typography, dividers, and structured information.

---

# 65. PRODUCT NORTH STAR

Every design and engineering decision should support:

> Can Nexora help the user answer a difficult research question with evidence they can trace and understand?

If yes:

Build it.

If no:

Do not build it.

---

# 66. FINAL USER EXPERIENCE

The finished product should feel like this:

### 1. Ask

User enters a difficult question.

### 2. Plan

Nexora explains how it will research it.

### 3. Approve

User reviews and adjusts the plan.

### 4. Research

Nexora searches and analyzes sources.

### 5. Verify

Nexora extracts evidence and checks support.

### 6. Compare

Nexora identifies contradictions.

### 7. Synthesize

Nexora combines validated findings.

### 8. Read

User receives a clean, cited research report.

### 9. Trace

User can click any important citation and inspect its evidence.

---

# 67. FINAL ACCEPTANCE CRITERIA

Before declaring Nexora complete:

- [ ] Application starts successfully
- [ ] Landing page works
- [ ] Research question can be submitted
- [ ] Research session is created
- [ ] Research plan is generated
- [ ] Questions can be edited
- [ ] Research can be started
- [ ] Sources are collected
- [ ] Sources are normalized
- [ ] Evidence is extracted
- [ ] Evidence is validated
- [ ] Contradictions are detected
- [ ] Synthesis is generated
- [ ] Citations are mapped
- [ ] Citation IDs are valid
- [ ] Final report renders correctly
- [ ] Research persists
- [ ] History works
- [ ] Settings work
- [ ] Errors are handled
- [ ] API keys remain private
- [ ] Mobile UI works
- [ ] Accessibility basics work
- [ ] Tests pass
- [ ] No fake sources are presented as real
- [ ] No unnecessary features remain

---

# 68. FINAL COMMAND TO ANTIGRAVITY

Build Nexora end-to-end.

Do not merely generate a prototype or static UI.

Implement the actual architecture, API, database, AI orchestration, research pipeline, evidence model, citation system, and frontend.

Prioritize correctness and simplicity.

If an implementation choice is ambiguous, choose the simplest production-ready solution.

If a feature is not necessary for the core research workflow, do not add it.

The final result should be:

**Nexora — Research. Verify. Synthesize.**

A focused, minimalist, evidence-first research workspace.
