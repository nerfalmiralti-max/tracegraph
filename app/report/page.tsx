"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CircleHelp,
  GitBranch,
  Globe2,
  RefreshCw,
} from "lucide-react";
import { EmptyReport, useWorkspace } from "../../components/workspace";
import {
  Assessment,
  DemoNotice,
  EvidenceList,
  ReportHeading,
  Reputation,
  reputationLabels,
} from "../../components/report-parts";
import { Button } from "../../components/ui/button";
import type { Report } from "../../lib/types";

const tabs = ["Overview", "Evidence", "Technical details"];
export default function ReportPage() {
  const { report } = useWorkspace();
  return report ? (
    <ReportContent key={report.receivedAt} report={report} />
  ) : (
    <EmptyReport />
  );
}
function ReportContent({ report }: { report: Report }) {
  const [tab, setTab] = useState(0);
  const { investigate, loading } = useWorkspace();
  return (
    <div className="content-page">
      <div className="page-toolbar">
        <Link className="back-link" href="/">
          ← New investigation
        </Link>
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => void investigate(report.domain)}
        >
          <RefreshCw size={14} />
          Check again
        </Button>
      </div>
      <ReportHeading report={report} title="Domain report" />
      {report.demo && <DemoNotice />}
      <Assessment scan={report} />
      <div className="tabs" role="tablist" aria-label="Report sections">
        {tabs.map((label, index) => (
          <button
            key={label}
            id={`tab-${index}`}
            role="tab"
            aria-selected={tab === index}
            aria-controls={`panel-${index}`}
            tabIndex={tab === index ? 0 : -1}
            onClick={() => setTab(index)}
            onKeyDown={(event) => {
              let next = index;
              if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
              else if (event.key === "ArrowLeft")
                next = (index + tabs.length - 1) % tabs.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = tabs.length - 1;
              else return;
              event.preventDefault();
              setTab(next);
              document.getElementById(`tab-${next}`)?.focus();
            }}
          >
            {label}
            {index === 1 && (
              <span className="tab-count">{report.signals.length}</span>
            )}
          </button>
        ))}
      </div>
      <div
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        tabIndex={0}
      >
        {tab === 0 && (
          <div className="report-grid">
            <div>
              <section className="section-block">
                <div className="section-heading">
                  <h2>Reputation sources</h2>
                  <span className="muted text-small">Source coverage</span>
                </div>
                <Reputation scan={report} />
                {report.reputation.types.length > 0 && (
                  <p className="threat-types">
                    Threat types: {report.reputation.types.join(", ")}
                  </p>
                )}
                <p className="section-note">
                  {report.demo
                    ? "No external source was queried for this demo."
                    : "The lookup covers https://" +
                      report.domain +
                      "/ only, not every page on the site."}{" "}
                  No match does not establish trustworthiness.
                </p>
              </section>
              <section className="section-block">
                <div className="section-heading">
                  <h2>
                    Related domains{" "}
                    <span className="count">{report.connections.length}</span>
                  </h2>
                  <Link className="text-link" href="/network">
                    Explore network
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
                {report.connections.length ? (
                  <div className="related-domains">
                    {report.connections.map((connection) => (
                      <Link
                        href={`/network?domain=${encodeURIComponent(connection.domain)}`}
                        key={connection.domain}
                      >
                        <span className="related-icon">
                          <Globe2 size={18} />
                        </span>
                        <div>
                          <strong>{connection.domain}</strong>
                          <small>
                            Shared signals: {connection.sharedSignalIds.length}{" "}
                            · {report.demo ? "demo" : "reported"}
                          </small>
                        </div>
                        <ArrowRight size={16} />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="inline-empty">
                    <GitBranch size={22} />
                    <div>
                      <strong>No connections in the available dataset</strong>
                      <p>
                        Coverage is limited. A live relationship dataset is not
                        connected.
                      </p>
                    </div>
                  </div>
                )}
              </section>
              <section className="section-block">
                <div className="section-heading">
                  <h2>Connection evidence</h2>
                </div>
                <EvidenceList scan={report} />
              </section>
            </div>
            <aside className="reading-guide" aria-label="Report guidance">
              <CircleHelp size={22} />
              <h3>Reading this report</h3>
              <p>
                Observations are not conclusions. Independent websites may use
                the same templates, images, or text.
              </p>
              <hr />
              <h4>What remains unknown</h4>
              <ul>
                <li>Who operates the website</li>
                <li>Whether the business is trustworthy</li>
                <li>How complete the coverage is</li>
                <li>When the source was last updated</li>
              </ul>
              <Link href="/about">
                About our approach
                <ArrowUpRight size={14} />
              </Link>
            </aside>
          </div>
        )}
        {tab === 1 && (
          <section className="section-block">
            <div className="section-heading">
              <h2>Signals and provenance</h2>
            </div>
            <p className="section-note">
              Expand a signal to review its provenance. A weak signal warrants
              investigation, not an accusation.
            </p>
            <EvidenceList scan={report} />
            <Reputation scan={report} />
            {report.reputation.types.length > 0 && (
              <p className="threat-types">
                Threat types: {report.reputation.types.join(", ")}
              </p>
            )}
          </section>
        )}
        {tab === 2 && (
          <section className="section-block">
            <div className="section-heading">
              <h2>Lookup details</h2>
            </div>
            <dl className="technical-details">
              <div>
                <dt>Normalized domain</dt>
                <dd>{report.domain}</dd>
              </div>
              <div>
                <dt>Lookup URL</dt>
                <dd>https://{report.domain}/</dd>
              </div>
              <div>
                <dt>Reputation source</dt>
                <dd>Google Web Risk</dd>
              </div>
              <div>
                <dt>Source status</dt>
                <dd>
                  {report.demo
                    ? "Not queried (demo)"
                    : reputationLabels[report.reputation.status] ||
                      "Unknown status"}
                </dd>
              </div>
              <div>
                <dt>Threat types</dt>
                <dd>{report.reputation.types.join(", ") || "Not provided"}</dd>
              </div>
              <div>
                <dt>Relationship data</dt>
                <dd>
                  {report.demo
                    ? "Synthetic demo dataset"
                    : "No verified connections available"}
                </dd>
              </div>
              <div>
                <dt>Source observation date</dt>
                <dd>Not provided</dd>
              </div>
              <div>
                <dt>Response received</dt>
                <dd>{new Date(report.receivedAt).toLocaleString("en-US")}</dd>
              </div>
            </dl>
          </section>
        )}
      </div>
      <p className="report-disclaimer">{report.note}</p>
    </div>
  );
}
