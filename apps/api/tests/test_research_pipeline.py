import pytest
from app.services.llm.fallback import SmartFallbackLLMProvider
from app.services.research.planner import ResearchPlannerService
from app.services.research.synthesizer import SynthesizerService
from app.services.search.hybrid import HybridSearchProvider, SOURCE_PRIORITY_ORDER

@pytest.mark.asyncio
async def test_planner_generates_valid_schema():
    llm = SmartFallbackLLMProvider()
    planner = ResearchPlannerService(llm)
    
    plan = await planner.generate_plan(
        question="What are the measurable effects of generative AI coding assistants on software developer productivity?",
        depth="standard"
    )
    
    assert "objective" in plan
    assert "questions" in plan
    assert len(plan["questions"]) >= 3
    for q in plan["questions"]:
        assert "question" in q
        assert "priority" in q
        assert "evidence_requirements" in q

@pytest.mark.asyncio
async def test_source_priority_ordering():
    provider = HybridSearchProvider()
    results = await provider.search("developer productivity generative AI", limit=5)
    
    assert len(results) > 0
    # Ensure source priority order is respected
    for i in range(len(results) - 1):
        p1 = SOURCE_PRIORITY_ORDER.get(results[i].source_type, 99)
        p2 = SOURCE_PRIORITY_ORDER.get(results[i+1].source_type, 99)
        assert p1 <= p2

@pytest.mark.asyncio
async def test_citation_integrity_no_nonexistent_citations():
    """
    CRITICAL TEST (Section 57):
    A report must never reference a citation ID that does not exist.
    """
    llm = SmartFallbackLLMProvider()
    synthesizer = SynthesizerService(llm)
    
    sources = [
        {
            "id": "src-1",
            "title": "Study A",
            "publisher": "MIT Press",
            "url": "https://example.com/a",
            "snippet": "Controlled trial snippet."
        },
        {
            "id": "src-2",
            "title": "Study B",
            "publisher": "IEEE",
            "url": "https://example.com/b",
            "snippet": "Production data snippet."
        }
    ]
    
    # We deliberately simulate text that has [1], [2], and hallucinated [99]
    test_report = {
        "title": "Test Title",
        "executive_summary": "Finding supported by [1] and [99] and [2].",
        "key_findings": ["Finding one [1]", "Bad finding [88]"],
        "detailed_analysis": [
            {
                "dimension": "Speed",
                "heading": "Velocity",
                "content": "Velocity increased [1][99].",
                "citations": [1, 99]
            }
        ],
        "conflicting_evidence": [],
        "limitations": ["Limited sample"],
        "conclusion": "Conclusion citing [1] and [55]."
    }
    
    valid_ids = {1, 2}
    scrubbed = synthesizer._enforce_citation_integrity(test_report, valid_ids)
    
    # Verification: [99], [88], [55] MUST BE REMOVED
    assert "[99]" not in scrubbed["executive_summary"]
    assert "[1]" in scrubbed["executive_summary"]
    assert "[2]" in scrubbed["executive_summary"]
    
    assert "[88]" not in scrubbed["key_findings"][1]
    assert "[99]" not in scrubbed["detailed_analysis"][0]["content"]
    assert 99 not in scrubbed["detailed_analysis"][0]["citations"]
    assert "[55]" not in scrubbed["conclusion"]

@pytest.mark.asyncio
async def test_source_never_verified_without_verification_data():
    """
    CRITICAL TEST (Section 57):
    A source must never be marked verified without the required verification data.
    """
    from app.services.research.verifier import EvidenceVerifierService
    llm = SmartFallbackLLMProvider()
    verifier = EvidenceVerifierService(llm)

    # Missing evidence snippet
    res_empty_evidence = await verifier.verify_evidence(
        claim="Productivity increased by 20%",
        evidence="",
        context="Lab test",
        source_title="Study 1",
        publisher="ACM"
    )
    assert res_empty_evidence["verification_status"] == "unverified"
    assert res_empty_evidence["supports_claim"] is False

    # Missing source publisher/title
    res_empty_source = await verifier.verify_evidence(
        claim="Productivity increased by 20%",
        evidence="We found a 20% delta in speed",
        context="Lab test",
        source_title="",
        publisher=""
    )
    assert res_empty_source["verification_status"] == "unverified"
    assert res_empty_source["supports_claim"] is False
