import React, { useState } from 'react';
import { Download, Copy, Check, ExternalLink } from 'lucide-react';
import { Report, Source } from '../../types';

interface ReportViewProps {
  report: Report;
  sources: Source[];
  onCitationClick?: (sourceId: string) => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ report, sources, onCitationClick }) => {
  const [copied, setCopied] = useState(false);

  // Build plain-text version of the report for copy/export
  const buildMarkdown = () => {
    const lines: string[] = [];
    lines.push(`# ${report.title}`);
    lines.push('');
    lines.push('## Executive Summary');
    lines.push(report.executive_summary);
    lines.push('');

    if (report.key_findings?.length) {
      lines.push('## Key Findings');
      report.key_findings.forEach((f, i) => lines.push(`${i + 1}. ${f}`));
      lines.push('');
    }

    if (report.detailed_analysis?.length) {
      lines.push('## Detailed Analysis');
      report.detailed_analysis.forEach((section) => {
        lines.push(`### ${section.heading}`);
        lines.push(section.content);
        lines.push('');
      });
    }

    if (report.conflicting_evidence?.length) {
      lines.push('## Conflicting Evidence');
      report.conflicting_evidence.forEach((c) => {
        lines.push(`**${c.topic}**`);
        lines.push(`- Finding A: ${c.finding_a}`);
        lines.push(`- Finding B: ${c.finding_b}`);
        if (c.conclusion) lines.push(`- Conclusion: ${c.conclusion}`);
        lines.push('');
      });
    }

    if (report.limitations?.length) {
      lines.push('## Limitations');
      report.limitations.forEach((l) => lines.push(`- ${l}`));
      lines.push('');
    }

    lines.push('## Conclusion');
    lines.push(report.conclusion);
    lines.push('');

    if (sources.length) {
      lines.push('## Sources');
      sources.forEach((s, i) => lines.push(`[${i + 1}] ${s.title} — ${s.publisher} (${s.url})`));
    }

    return lines.join('\n');
  };

  const copy = async () => {
    await navigator.clipboard.writeText(buildMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([buildMarkdown()], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'nexora-report.md';
    a.click();
  };

  // Render inline citation numbers [N]
  const renderWithCitations = (text: string) => {
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((part, i) => {
      const match = part.match(/^\[(\d+)\]$/);
      if (match) {
        const n = parseInt(match[1], 10);
        const cit = report.citations?.find((c) => c.id === n);
        const src = cit ? sources.find((s) => s.id === cit.source_id) : sources[n - 1];
        return (
          <button
            key={i}
            onClick={() => src && onCitationClick?.(src.id)}
            title={cit?.title || src?.title || ''}
            className="inline-block align-middle text-xs font-bold px-1.5 py-0.5 rounded mx-0.5 transition-colors"
            style={{
              background: 'var(--badge-verified-bg)',
              color: 'var(--badge-verified-text)',
              verticalAlign: 'super',
              fontSize: '0.7em',
            }}
          >
            {n}
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Final Report</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={copy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
            style={{ background: 'var(--surface)', color: 'var(--text-2)', border: '1px solid var(--border)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--surface)')}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={download}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
            style={{ background: 'var(--surface)', color: 'var(--text-2)', border: '1px solid var(--border)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--surface)')}
          >
            <Download className="w-3.5 h-3.5" /> Export MD
          </button>
        </div>
      </div>

      {/* Report content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <article className="max-w-2xl mx-auto space-y-6" style={{ color: 'var(--text-2)' }}>

          {/* Title */}
          <h1 className="text-2xl font-bold leading-snug" style={{ color: 'var(--text)' }}>
            {report.title}
          </h1>

          {/* Executive Summary */}
          {report.executive_summary && (
            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>
                Executive Summary
              </h2>
              <p className="text-base leading-[1.8]">{renderWithCitations(report.executive_summary)}</p>
            </section>
          )}

          {/* Key Findings */}
          {report.key_findings?.length > 0 && (
            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>
                Key Findings
              </h2>
              <ol className="space-y-2 list-decimal list-inside">
                {report.key_findings.map((f, i) => (
                  <li key={i} className="text-base leading-[1.7]">
                    {renderWithCitations(f)}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Detailed Analysis */}
          {report.detailed_analysis?.length > 0 && (
            <section>
              <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--text)' }}>
                Detailed Analysis
              </h2>
              <div className="space-y-5">
                {report.detailed_analysis.map((sec, i) => (
                  <div key={i}>
                    <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
                      {sec.heading}
                    </h3>
                    <p className="text-base leading-[1.8]">{renderWithCitations(sec.content)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Conflicting Evidence */}
          {report.conflicting_evidence?.length > 0 && (
            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>
                Conflicting Evidence
              </h2>
              <div className="space-y-3">
                {report.conflicting_evidence.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4 space-y-2"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                      {c.topic}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                      <span className="font-medium" style={{ color: 'var(--text)' }}>A: </span>
                      {c.finding_a}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                      <span className="font-medium" style={{ color: 'var(--text)' }}>B: </span>
                      {c.finding_b}
                    </p>
                    {c.conclusion && (
                      <p className="text-sm leading-relaxed pt-1 border-t" style={{ color: 'var(--text)', borderColor: 'var(--border)' }}>
                        {c.conclusion}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Limitations */}
          {report.limitations?.length > 0 && (
            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>
                Limitations
              </h2>
              <ul className="space-y-1.5 list-disc list-inside">
                {report.limitations.map((l, i) => (
                  <li key={i} className="text-base leading-[1.7]">{l}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Conclusion */}
          {report.conclusion && (
            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>
                Conclusion
              </h2>
              <p className="text-base leading-[1.8]">{renderWithCitations(report.conclusion)}</p>
            </section>
          )}

          {/* Sources */}
          {sources.length > 0 && (
            <section className="pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>Sources</h2>
              <ol className="space-y-2">
                {sources.map((s, i) => (
                  <li key={s.id} className="flex items-start gap-2.5 text-sm">
                    <span className="font-mono shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>[{i + 1}]</span>
                    <div className="min-w-0">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:underline"
                        style={{ color: 'var(--accent)' }}
                      >
                        <span className="truncate">{s.title}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {s.publisher} {s.published_at && `· ${s.published_at}`}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </article>
      </div>
    </div>
  );
};
