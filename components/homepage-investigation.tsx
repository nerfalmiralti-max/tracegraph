"use client";

import { useRef, useState } from "react";
import {
  AlignLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  FlaskConical,
  Globe2,
  Image,
  Minus,
  Plus,
  RotateCcw,
  ScanSearch,
} from "lucide-react";
import { findDemoConnections } from "../lib/graph.mjs";
import { useWorkspace } from "./workspace";
import styles from "../app/home.module.css";

const subject = "aurora-deals.example";
const example = findDemoConnections(subject);
const paths = [
  {
    domain: "nova-outlet.example",
    label: "Shared banner image",
    path: "M455 132 C515 132 535 155 575 155",
  },
  {
    domain: "nova-outlet.example",
    label: "Matching returns policy",
    path: "M455 350 C525 350 525 175 575 175",
  },
  {
    domain: "polar-shop.example",
    label: "Matching returns policy",
    path: "M455 350 C510 350 535 360 575 360",
  },
];

export function HomepageInvestigation() {
  const { investigate, loading } = useWorkspace();
  const [selected, setSelected] = useState(example.connections[0].domain);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{
    x: number;
    y: number;
    originX: number;
    originY: number;
  } | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const connection = example.connections.find(
    (item) => item.domain === selected,
  )!;
  const signals = example.signals.filter((signal) =>
    connection.sharedSignalIds.includes(signal.id),
  );
  function select(domain: string) {
    setSelected(domain);
    setExpanded(null);
  }
  const zoomBy = (delta: number) =>
    setZoom((value) =>
      Math.max(0.8, Math.min(1.4, +(value + delta).toFixed(1))),
    );
  function resetView() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  function domainButton(domain: string, count: number) {
    return (
      <button
        className={`${styles.domainNode} ${selected === domain ? styles.selectedNode : ""}`}
        aria-label={`${domain} ${count} shared ${count === 1 ? "signal" : "signals"}`}
        aria-pressed={selected === domain}
        onClick={() => select(domain)}
      >
        <span className={styles.domainIcon}>
          <Globe2 size={20} />
        </span>
        <span>
          <strong>{domain}</strong>{" "}
          <small>
            {count} shared {count === 1 ? "signal" : "signals"}
          </small>
        </span>
        <span className={styles.selectionDot} />
      </button>
    );
  }

  return (
    <div className={styles.investigation}>
      <div className={styles.investigationBar}>
        <div className={styles.investigationSubject}>
          <ScanSearch size={20} />
          <strong>{subject}</strong>
        </div>
        <div className={styles.investigationActions}>
          <span className={styles.syntheticLabel}>
            <FlaskConical size={15} />
            Synthetic example
          </span>
          <button disabled={loading} onClick={() => void investigate(subject)}>
            View example report <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
      <div className={styles.investigationBody}>
        <div className={styles.network}>
          <div className={styles.networkHeader}>
            <span>Connection map</span>
            <span>
              {example.connections.length + 1} domains ·{" "}
              {example.signals.length} shared signals
            </span>
          </div>
          <div className={styles.desktopNetwork}>
            <svg
              className={styles.networkSvg}
              viewBox="0 0 850 480"
              role="group"
              aria-label="Example domain connections"
              aria-describedby="home-map-instructions"
              tabIndex={0}
              onPointerDown={(event) => {
                if (
                  event.button !== 0 ||
                  (event.target as Element).closest("button, [role='button']")
                )
                  return;
                drag.current = {
                  x: event.clientX,
                  y: event.clientY,
                  originX: pan.x,
                  originY: pan.y,
                };
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                if (!drag.current) return;
                const scale =
                  850 / event.currentTarget.getBoundingClientRect().width;
                setPan({
                  x:
                    drag.current.originX +
                    (event.clientX - drag.current.x) * scale,
                  y:
                    drag.current.originY +
                    (event.clientY - drag.current.y) * scale,
                });
              }}
              onPointerUp={() => {
                drag.current = null;
              }}
              onPointerCancel={() => {
                drag.current = null;
              }}
              onLostPointerCapture={() => {
                drag.current = null;
              }}
              onKeyDown={(event) => {
                if (event.target !== event.currentTarget) return;
                const moves: Record<string, [number, number]> = {
                  ArrowLeft: [-30, 0],
                  ArrowRight: [30, 0],
                  ArrowUp: [0, -30],
                  ArrowDown: [0, 30],
                };
                if (moves[event.key]) {
                  event.preventDefault();
                  const [x, y] = moves[event.key];
                  setPan((value) => ({ x: value.x + x, y: value.y + y }));
                } else if (event.key === "Home") {
                  event.preventDefault();
                  resetView();
                }
              }}
            >
              <desc id="home-map-instructions">
                Drag the canvas or use arrow keys to pan. Press Home to reset.
                Select a domain or relationship to inspect its evidence.
              </desc>
              <defs>
                <pattern
                  id="home-canvas-dots"
                  width="28"
                  height="28"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="1" cy="1" r=".7" fill="#333c49" />
                </pattern>
              </defs>
              <rect width="850" height="480" fill="url(#home-canvas-dots)" />
              <g
                data-testid="homepage-graph-scene"
                transform={`translate(${pan.x} ${pan.y}) translate(425 240) scale(${zoom}) translate(-425 -240)`}
              >
                <path
                  className={`${styles.contextEdge} ${selected === "nova-outlet.example" ? styles.activeContext : ""}`}
                  d="M270 245 C320 245 300 132 395 132"
                />
                <path
                  className={`${styles.contextEdge} ${styles.activeContext}`}
                  d="M270 245 C320 245 300 350 395 350"
                />
                {paths.map((edge) => (
                  <g key={edge.domain + edge.label}>
                    <path
                      className={`${styles.connectionEdge} ${edge.domain === selected ? styles.activeEdge : ""}`}
                      d={edge.path}
                    />
                    <path
                      className={styles.edgeHit}
                      d={edge.path}
                      role="button"
                      tabIndex={0}
                      aria-label={`Inspect ${edge.label.toLowerCase()} connection to ${edge.domain}`}
                      aria-pressed={edge.domain === selected}
                      onClick={() => select(edge.domain)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          select(edge.domain);
                        }
                      }}
                    />
                  </g>
                ))}
                <foreignObject x="25" y="200" width="250" height="96">
                  <div className={styles.subjectNode}>
                    <span className={styles.domainIcon}>
                      <Globe2 size={21} />
                    </span>
                    <span>
                      <small>Investigated website</small>
                      <strong>{subject}</strong>
                    </span>
                  </div>
                </foreignObject>
                <foreignObject x="350" y="100" width="150" height="126">
                  <div className={styles.signalNode}>
                    <span>
                      <Image size={22} />
                    </span>
                    <strong>Shared image</strong>
                    <small>Content match</small>
                  </div>
                </foreignObject>
                <foreignObject x="350" y="318" width="150" height="126">
                  <div className={styles.signalNode}>
                    <span>
                      <AlignLeft size={22} />
                    </span>
                    <strong>Matching text</strong>
                    <small>Content match</small>
                  </div>
                </foreignObject>
                {example.connections.map((item, index) => (
                  <foreignObject
                    key={item.domain}
                    x="575"
                    y={index === 0 ? 117 : 317}
                    width="260"
                    height="96"
                  >
                    {domainButton(item.domain, item.sharedSignalIds.length)}
                  </foreignObject>
                ))}
              </g>
            </svg>
            <div className={styles.canvasBottom}>
              <div className={styles.zoomControls}>
                <button
                  aria-label="Zoom out"
                  disabled={zoom <= 0.8}
                  onClick={() => zoomBy(-0.2)}
                >
                  <Minus size={16} />
                </button>
                <output aria-label="Example zoom level">
                  {Math.round(zoom * 100)}%
                </output>
                <button
                  aria-label="Zoom in"
                  disabled={zoom >= 1.4}
                  onClick={() => zoomBy(0.2)}
                >
                  <Plus size={16} />
                </button>
                <button aria-label="Reset example view" onClick={resetView}>
                  <RotateCcw size={16} />
                </button>
              </div>
              <span className={styles.mapLegend}>
                <i />
                Content match · unverified
              </span>
            </div>
          </div>
          <div
            className={styles.mobileNetwork}
            role="group"
            aria-label="Example domain connections"
          >
            <div className={styles.mobileSubject}>
              <Globe2 size={21} />
              <span>
                <small>Investigated website</small>
                <strong>{subject}</strong>
              </span>
            </div>
            <p>Connected through shared content</p>
            <div className={styles.mobileConnections}>
              {example.connections.map((item) => (
                <div key={item.domain}>
                  {domainButton(item.domain, item.sharedSignalIds.length)}
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside
          className={styles.evidence}
          aria-label="Example connection evidence"
          aria-live="polite"
        >
          <p className={styles.evidenceLabel}>Selected connection</p>
          <h3>{selected}</h3>
          <p className={styles.evidenceIntro}>
            Linked by shared content.
            <br />
            Not by a verified owner.
          </p>
          <span className={styles.weakSignal}>Weak evidence</span>
          <div className={styles.evidenceList}>
            {signals.map((signal) => (
              <div className={styles.evidenceItem} key={signal.id}>
                <button
                  aria-expanded={expanded === signal.id}
                  aria-controls={`home-evidence-${signal.id}`}
                  onClick={() =>
                    setExpanded(expanded === signal.id ? null : signal.id)
                  }
                >
                  {signal.category === "asset" ? (
                    <Image size={19} />
                  ) : (
                    <AlignLeft size={19} />
                  )}
                  <span>
                    <strong>{signal.name}</strong>
                    <small>Synthetic source · unverified</small>
                  </span>
                  <ChevronDown size={15} />
                </button>
                <div
                  className={styles.evidenceExplanation}
                  id={`home-evidence-${signal.id}`}
                  hidden={expanded !== signal.id}
                >
                  <p>
                    {signal.category === "asset"
                      ? "The example domains share the same banner image. Licensed imagery or a shared template could also explain a match."
                      : "The example domains use matching returns-policy text. Common templates could also explain a match."}
                  </p>
                  <span>Signal ID: {signal.id}</span>
                </div>
              </div>
            ))}
          </div>
          <p className={styles.evidenceNote}>
            A connection is a lead to investigate, not proof of a threat.
          </p>
          <button
            className={styles.exploreAction}
            disabled={loading}
            onClick={() => void investigate(subject, "/network")}
          >
            Explore example network <ArrowRight size={17} />
          </button>
        </aside>
      </div>
      <div className={styles.demoNote}>
        <FlaskConical size={16} />
        <p>
          Demonstration only. These domains and signals are fictional. No live
          intelligence is shown.
        </p>
      </div>
    </div>
  );
}
