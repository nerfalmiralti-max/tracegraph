"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  FileSearch,
  GitBranch,
  Globe2,
  Image,
  AlignLeft,
  Info,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import { DomainSearch, useWorkspace } from "../components/workspace";
import { Button } from "../components/ui/button";
import { WaveText } from "../components/ui/wave-text";
import { findDemoConnections } from "../lib/graph.mjs";

const example = findDemoConnections("aurora-deals.example");
const steps = [
  {
    Icon: ShieldCheck,
    title: "Review the signals",
    description: "See what available reputation sources report.",
  },
  {
    Icon: FileSearch,
    title: "Examine the evidence",
    description: "Understand each finding and its limitations.",
  },
  {
    Icon: GitBranch,
    title: "Follow the connections",
    description: "Explore shared signals between websites.",
  },
];

export default function Home() {
  const { investigate, loading } = useWorkspace();
  const [selected, setSelected] = useState(example.connections[0].domain);
  const connection = example.connections.find(
    (item) => item.domain === selected,
  )!;
  const signals = example.signals.filter((signal) =>
    connection.sharedSignalIds.includes(signal.id),
  );
  return (
    <div className="home-page">
      <div className="home-introduction">
        <section className="hero">
          <div className="hero-label">
            <ScanSearch size={16} /> Domain investigation
          </div>
          <WaveText
            as="h1"
            className="investigation-headline"
            colors={["#8ea8d4", "#bac9df", "#99b4c5"]}
            base="#e1e5eb"
            shape="linear"
            bands={4}
            bandWidth={7}
            duration={2.8}
            delay={120}
          >
            Understand what’s
            <br className="desktop-break" /> behind a website.
          </WaveText>
          <p className="hero-description">
            Investigate domains, examine risk signals, and explore
            evidence-backed connections.
          </p>
          <DomainSearch />
        </section>
        <aside
          className="investigation-guide"
          aria-label="The investigation process"
        >
          <h2>From a domain to the evidence</h2>
          <ol>
            {steps.map(({ Icon, title, description }) => (
              <li key={title}>
                <span className="process-icon">
                  <Icon size={18} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/about">
            How TraceGraph works <ArrowUpRight size={14} />
          </Link>
        </aside>
      </div>
      <section className="example-section" aria-labelledby="example-title">
        <div className="section-heading">
          <div>
            <h2 id="example-title">A closer look at a connection</h2>
            <p className="section-subtitle">
              Select a domain to see why it appears in this example.
            </p>
          </div>
          <span className="badge">Interactive demo</span>
        </div>
        <div className="example-investigation">
          <div className="example-toolbar">
            <span className="example-subject">
              <Globe2 size={18} />
              <strong>aurora-deals.example</strong>
              <span>Example investigation</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={loading}
              onClick={() => void investigate("aurora-deals.example")}
            >
              View example report <ArrowUpRight size={15} />
            </Button>
          </div>
          <div className="example-panel">
            <div className="preview-graph">
              <div
                className="preview-canvas"
                role="group"
                aria-label="Example domain connections"
              >
                <svg
                  viewBox="0 0 600 300"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    className={
                      selected === example.connections[0].domain
                        ? "selected"
                        : ""
                    }
                    d="M300 94 V127 Q300 148 276 148 H174 Q150 148 150 171 V197"
                  />
                  <path
                    className={
                      selected === example.connections[1].domain
                        ? "selected"
                        : ""
                    }
                    d="M300 94 V127 Q300 148 324 148 H426 Q450 148 450 171 V197"
                  />
                  <circle cx="300" cy="148" r="3" />
                </svg>
                <div className="preview-root">
                  <span className="node-icon">
                    <Globe2 size={18} />
                  </span>
                  <div>
                    <small>Investigated domain</small>
                    <strong>aurora-deals.example</strong>
                  </div>
                </div>
                <div className="preview-connections">
                  {example.connections.map((item) => (
                    <button
                      key={item.domain}
                      className={`preview-node ${selected === item.domain ? "selected" : ""}`}
                      aria-pressed={selected === item.domain}
                      onClick={() => setSelected(item.domain)}
                    >
                      <span className="node-icon">
                        <Globe2 size={17} />
                      </span>
                      <span>
                        <strong>{item.domain}</strong>
                        <small>
                          {item.sharedSignalIds.length} shared{" "}
                          {item.sharedSignalIds.length === 1
                            ? "signal"
                            : "signals"}
                        </small>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="preview-legend">
                <span>
                  <i className="legend-line" />
                  Demo connection
                </span>
                <span>Select a connected domain</span>
              </div>
            </div>
            <div
              className="example-evidence"
              aria-live="polite"
              aria-label="Example connection evidence"
            >
              <div className="detail-label">
                <GitBranch size={15} /> Connection evidence
              </div>
              <h3>{selected}</h3>
              <p className="example-evidence-description">
                Shares the following content with the investigated domain.
              </p>
              <div className="preview-signal-list">
                {signals.map((signal) => (
                  <div className="preview-signal" key={signal.id}>
                    {signal.category === "asset" ? (
                      <Image size={17} />
                    ) : (
                      <AlignLeft size={17} />
                    )}
                    <div>
                      <strong>{signal.name}</strong>
                      <small>Weak signal · demo</small>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                disabled={loading}
                onClick={() =>
                  void investigate("aurora-deals.example", "/network")
                }
              >
                Explore example network <ArrowRight size={15} />
              </Button>
            </div>
          </div>
          <div className="example-footnote">
            <Info size={15} />
            <p>
              Fictional domains and synthetic evidence. Shared content does not
              establish common ownership or a threat.
            </p>
          </div>
        </div>
      </section>
      <div className="home-principle">
        <span className="status-dot" />
        <p>Research preview. Missing evidence is never a safety verdict.</p>
        <Link href="/about">
          Data & limitations <ArrowUpRight size={13} />
        </Link>
      </div>
    </div>
  );
}
