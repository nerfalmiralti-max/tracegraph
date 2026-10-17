"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  GitBranch,
  Globe2,
  List,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { EmptyReport, useWorkspace } from "../../components/workspace";
import {
  DemoNotice,
  EvidenceList,
  ReportHeading,
} from "../../components/report-parts";
import { NetworkCanvas } from "../../components/network-canvas";
import { connectionConfidence } from "../../lib/graph-view.mjs";
import { Button } from "../../components/ui/button";
import { filterConnections } from "../../lib/explorer.mjs";
import type { Report, Scan } from "../../lib/types";

export default function NetworkPage() {
  return (
    <Suspense fallback={<p className="content-page">Loading investigation…</p>}>
      <Network />
    </Suspense>
  );
}
function Network() {
  const { report } = useWorkspace();
  const params = useSearchParams();
  return report ? (
    <Explorer
      key={`${report.receivedAt}-${params.get("domain") || ""}`}
      report={report}
      initialSelection={params.get("domain")}
    />
  ) : (
    <EmptyReport network />
  );
}

function Explorer({
  report,
  initialSelection,
}: {
  report: Report;
  initialSelection: string | null;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(
    initialSelection || report.connections[0]?.domain || "",
  );
  const [listView, setListView] = useState(false);
  const connections: Scan["connections"] = filterConnections(
    report,
    query,
    category,
  );
  const connection =
    connections.find((item) => item.domain === selected) || connections[0];
  const categories = [
    ...new Set(report.signals.map((signal) => signal.category)),
  ];
  return (
    <div className="content-page explorer-page">
      <Link className="back-link" href="/report">
        <ArrowLeft size={15} />
        Back to report
      </Link>
      <ReportHeading report={report} title="Network explorer" />
      {report.demo && <DemoNotice />}
      <div className="explorer-toolbar">
        <label className="filter-search">
          <Search size={17} />
          <span className="sr-only">Find a related domain</span>
          <input
            name="related-domain"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a domain…"
          />
        </label>
        <label className="filter-select">
          <SlidersHorizontal size={16} />
          <span className="sr-only">Signal type</span>
          <select
            name="signal-type"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">All signals</option>
            {categories.map((value) => (
              <option key={value} value={value}>
                {value === "asset"
                  ? "Images"
                  : value === "text"
                    ? "Text"
                    : value}
              </option>
            ))}
          </select>
        </label>
        <span className="filtered-count" role="status">
          Connections: {connections.length} / {report.connections.length}
        </span>
        <div className="view-toggle">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Graph view"
            aria-pressed={!listView}
            onClick={() => setListView(false)}
          >
            <GitBranch size={17} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="List view"
            aria-pressed={listView}
            onClick={() => setListView(true)}
          >
            <List size={17} />
          </Button>
        </div>
      </div>
      <div className="explorer-workspace">
        <section className="graph-panel" aria-label="Domain connections">
          {!connections.length ? (
            <div className="graph-empty">
              <GitBranch size={32} />
              <h2>
                {report.connections.length
                  ? "No matching connections"
                  : "No connections to explore"}
              </h2>
              <p>
                {report.connections.length
                  ? "Try another domain name or signal type."
                  : "This dataset has no connections for this domain. Limited coverage does not establish safety."}
              </p>
              {report.connections.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setCategory("all");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <NetworkCanvas
                report={report}
                connections={connections}
                selected={connection?.domain}
                onSelect={setSelected}
                hidden={listView}
              />
              <div
                className={`relationship-list ${listView ? "show-list" : ""}`}
              >
                <div className="list-root">
                  <Globe2 size={18} />
                  <span>{report.domain}</span>
                  <span className="badge">Subject</span>
                </div>
                {connections.map((item) => (
                  <button
                    key={item.domain}
                    aria-pressed={connection?.domain === item.domain}
                    onClick={() => setSelected(item.domain)}
                    className={
                      connection?.domain === item.domain ? "selected" : ""
                    }
                  >
                    <GitBranch size={18} />
                    <span>
                      <strong>{item.domain}</strong>
                      <small>
                        Shared signals: {item.sharedSignalIds.length}
                      </small>
                    </span>
                    <ArrowRight size={15} />
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="graph-legend">
            <span>
              <i className="legend-line" />
              {connectionConfidence(report.demo).label}
            </span>
            <span>No verified connections in this dataset</span>
          </div>
        </section>
        <aside
          className="evidence-panel"
          aria-label="Selected connection evidence"
          aria-live="polite"
        >
          <div className="panel-label">
            <GitBranch size={15} />
            Connection details
          </div>
          {connection ? (
            <>
              <h2>{connection.domain}</h2>
              <div className="connection-direction">
                <span>{report.domain}</span>
                <ArrowRight size={13} />
                <span>Selected domain</span>
              </div>
              <span className="badge">
                {connectionConfidence(report.demo).label}
              </span>
              <p className="section-note">
                Shared signals suggest a relationship. They do not establish
                common ownership.
              </p>
              <div className="evidence-panel-heading">
                Evidence <span>{connection.sharedSignalIds.length}</span>
              </div>
              <EvidenceList scan={report} ids={connection.sharedSignalIds} />
              <div className="provenance">
                <div className="eyebrow">Provenance</div>
                <p>
                  {report.demo
                    ? "Synthetic TraceGraph dataset. These connections are fictional."
                    : "Signals returned in this report."}
                </p>
                <small>Observation date not provided.</small>
              </div>
            </>
          ) : (
            <div className="inline-empty">
              <p>
                Select a connection to inspect its supporting signals. No
                evidence is available for the current selection.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
