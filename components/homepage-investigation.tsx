"use client";

import { useRef, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import {
  AlignLeft,
  ArrowUpRight,
  ChevronDown,
  FlaskConical,
  Globe2,
  Image,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";
import { findDemoConnections } from "../lib/graph.mjs";
import { useWorkspace } from "./workspace";
import { settle } from "./homepage-motion";
import styles from "../app/home.module.css";

const subject = "aurora-deals.example";
const example = findDemoConnections(subject);
const paths = [
  {
    domain: "nova-outlet.example",
    signal: "hero-image-demo",
    label: "Shared banner image",
    path: "M353 85 C388 85 399 100 430 100",
  },
  {
    domain: "nova-outlet.example",
    signal: "returns-text-demo",
    label: "Matching returns policy",
    path: "M353 330 C415 330 375 124 430 124",
  },
  {
    domain: "polar-shop.example",
    signal: "returns-text-demo",
    label: "Matching returns policy",
    path: "M353 330 C390 330 397 353 430 353",
  },
];

export function HomepageInvestigation() {
  const { investigate, loading } = useWorkspace();
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState(example.connections[0].domain);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{
    x: number;
    y: number;
    originX: number;
    originY: number;
    scale: number;
  } | null>(null);
  const connection = example.connections.find(
    (item) => item.domain === selected,
  )!;
  const signals = example.signals.filter((signal) =>
    connection.sharedSignalIds.includes(signal.id),
  );
  const active = hovered ?? focused ?? selected;
  function select(domain: string, signal?: string) {
    setSelected(domain);
    setExpanded(signal ?? null);
  }
  function reset() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }
  function domainButton(domain: string, count: number) {
    return (
      <button
        className={`${styles.domainNode} ${selected === domain ? styles.selectedNode : ""}`}
        aria-label={`${domain} ${count} shared ${count === 1 ? "signal" : "signals"}`}
        aria-pressed={selected === domain}
        aria-controls="home-connection-evidence"
        data-domain-node={domain}
        onClick={() => select(domain)}
        onMouseEnter={() => setHovered(domain)}
        onMouseLeave={() => setHovered(null)}
        onFocus={() => setFocused(domain)}
        onBlur={() => setFocused(null)}
        onKeyDown={(event) => {
          const direction = ["ArrowRight", "ArrowDown"].includes(event.key)
            ? 1
            : ["ArrowLeft", "ArrowUp"].includes(event.key)
              ? -1
              : 0;
          if (!direction) return;
          const nodes = Array.from(
            event.currentTarget
              .closest("[data-domain-list]")!
              .querySelectorAll<HTMLButtonElement>("[data-domain-node]"),
          );
          event.preventDefault();
          const index = nodes.indexOf(event.currentTarget);
          const next = nodes[(index + direction + nodes.length) % nodes.length];
          next.focus();
          select(next.dataset.domainNode!);
        }}
      >
        <span className={styles.nodeIcon}>
          <Globe2 size={19} />
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
      <div className={styles.mapToolbar}>
        <span className={styles.mapTitle}>
          <span /> Relationship preview
        </span>
        <span className={styles.syntheticLabel}>
          <FlaskConical size={13} /> Synthetic example
        </span>
      </div>
      <div className={styles.desktopNetwork}>
        <svg
          className={styles.networkSvg}
          viewBox="0 0 680 430"
          role="group"
          aria-label="Example domain connections"
          aria-describedby="home-map-instructions"
          tabIndex={0}
          data-domain-list
          onPointerDown={(event) => {
            if (
              event.pointerType === "touch" ||
              event.button !== 0 ||
              (event.target as Element).closest("button, [role='button']")
            )
              return;
            drag.current = {
              x: event.clientX,
              y: event.clientY,
              originX: pan.x,
              originY: pan.y,
              scale: 680 / event.currentTarget.getBoundingClientRect().width,
            };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!drag.current) return;
            const { scale } = drag.current;
            setPan({
              x:
                drag.current.originX + (event.clientX - drag.current.x) * scale,
              y:
                drag.current.originY + (event.clientY - drag.current.y) * scale,
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
              reset();
            }
          }}
        >
          <desc id="home-map-instructions">
            Drag or use arrow keys to pan. Press Home to reset. Select a domain
            or relationship to inspect evidence. When a domain is focused, use
            arrow keys to select another domain.
          </desc>
          <defs>
            <pattern
              id="home-canvas-grid"
              width="36"
              height="36"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M36 0H0V36"
                fill="none"
                stroke="#36465e"
                strokeWidth=".5"
                opacity=".4"
              />
            </pattern>
            <radialGradient id="home-canvas-light">
              <stop offset="0" stopColor="#527cba" stopOpacity=".12" />
              <stop offset="1" stopColor="#527cba" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="680" height="430" fill="url(#home-canvas-grid)" />
          <ellipse
            cx="330"
            cy="210"
            rx="340"
            ry="230"
            fill="url(#home-canvas-light)"
          />
          <g
            data-testid="homepage-graph-scene"
            transform={`translate(${pan.x} ${pan.y}) translate(340 215) scale(${zoom}) translate(-340 -215)`}
          >
            {[
              "M260 195 C310 195 250 85 307 85",
              "M260 225 C310 225 250 330 307 330",
            ].map((path, index) => (
              <m.path
                key={path}
                d={path}
                className={styles.contextEdge}
                initial={reduced ? false : { pathLength: 0 }}
                animate={{
                  pathLength: 1,
                  opacity:
                    index === 0 && active !== "nova-outlet.example" ? 0.8 : 1,
                }}
                transition={{
                  pathLength: {
                    duration: reduced ? 0 : 0.6,
                    delay: reduced ? 0 : 0.2 + index * 0.1,
                  },
                  opacity: { duration: reduced ? 0 : 0.18 },
                }}
              />
            ))}
            {paths.map((edge, index) => (
              <g key={edge.domain + edge.signal}>
                <m.path
                  data-connection={edge.domain}
                  data-highlighted={active === edge.domain}
                  d={edge.path}
                  className={styles.connectionEdge}
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={{
                    pathLength: 1,
                    opacity: active === edge.domain ? 1 : 0.64,
                    stroke: active === edge.domain ? "#8caeff" : "#8da4c6",
                  }}
                  transition={{
                    pathLength: {
                      duration: reduced ? 0 : 0.6,
                      delay: reduced ? 0 : 0.35 + index * 0.1,
                    },
                    opacity: { duration: reduced ? 0 : 0.2 },
                    stroke: { duration: reduced ? 0 : 0.2 },
                  }}
                />
                <path
                  className={styles.edgeHit}
                  d={edge.path}
                  role="button"
                  tabIndex={0}
                  aria-label={`Inspect ${edge.label.toLowerCase()} connection to ${edge.domain}`}
                  aria-pressed={
                    selected === edge.domain && expanded === edge.signal
                  }
                  aria-controls="home-connection-evidence"
                  onClick={() => select(edge.domain, edge.signal)}
                  onMouseEnter={() => setHovered(edge.domain)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setFocused(edge.domain)}
                  onBlur={() => setFocused(null)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      select(edge.domain, edge.signal);
                    }
                  }}
                />
              </g>
            ))}
            <foreignObject x="20" y="160" width="250" height="110">
              <m.div
                className={styles.subjectNode}
                data-entrance
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: reduced ? 0 : 0.1,
                  duration: reduced ? 0 : 0.4,
                }}
              >
                <div className={styles.subjectMeta}>
                  <span className={styles.subjectMonogram}>a</span>
                  <span>Starting domain</span>
                  <span className={styles.subjectIndicator} />
                </div>
                <strong>{subject}</strong>
                <span className={styles.subjectCaption}>
                  Selected for investigation
                </span>
              </m.div>
            </foreignObject>
            {[
              { y: 62, title: "Shared image", Icon: Image },
              { y: 307, title: "Matching text", Icon: AlignLeft },
            ].map(({ y, title, Icon }, index) => (
              <foreignObject key={title} x="272" y={y} width="116" height="100">
                <m.div
                  className={styles.signalNode}
                  data-entrance
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: reduced ? 0 : 0.2 + index * 0.1,
                    duration: reduced ? 0 : 0.4,
                  }}
                >
                  <span>
                    <Icon size={20} />
                  </span>
                  <strong>{title}</strong>
                </m.div>
              </foreignObject>
            ))}
            {example.connections.map((item, index) => (
              <foreignObject
                key={item.domain}
                x="430"
                y={index === 0 ? 62 : 315}
                width="240"
                height="92"
              >
                <m.div
                  data-entrance
                  initial={reduced ? false : { opacity: 0.6, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: reduced ? 0 : 0.35 + index * 0.1,
                    duration: reduced ? 0 : 0.4,
                    ease: settle,
                  }}
                >
                  {domainButton(item.domain, item.sharedSignalIds.length)}
                </m.div>
              </foreignObject>
            ))}
          </g>
        </svg>
        <div className={styles.canvasBottom}>
          <span className={styles.mapLegend}>
            <i /> Inferred connection
          </span>
          <div className={styles.zoomControls}>
            <button
              aria-label="Zoom out"
              disabled={zoom <= 0.8}
              onClick={() =>
                setZoom((value) => Math.max(0.8, +(value - 0.2).toFixed(1)))
              }
            >
              <Minus size={14} />
            </button>
            <output aria-label="Example zoom level">
              {Math.round(zoom * 100)}%
            </output>
            <button
              aria-label="Zoom in"
              disabled={zoom >= 1.4}
              onClick={() =>
                setZoom((value) => Math.min(1.4, +(value + 0.2).toFixed(1)))
              }
            >
              <Plus size={14} />
            </button>
            <button aria-label="Reset example view" onClick={reset}>
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>
      <div
        className={styles.mobileNetwork}
        role="group"
        aria-label="Example domain connections"
        data-domain-list
      >
        <div className={styles.mobileSubject}>
          <span className={styles.subjectMonogram}>a</span>
          <span>
            <small>Starting domain</small>
            <strong>{subject}</strong>
          </span>
        </div>
        <p>Follow a shared signal</p>
        <div className={styles.mobileConnections}>
          {example.connections.map((item) => (
            <div key={item.domain}>
              {domainButton(item.domain, item.sharedSignalIds.length)}
            </div>
          ))}
        </div>
      </div>
      <aside
        id="home-connection-evidence"
        className={styles.evidence}
        aria-label="Example connection evidence"
      >
        <div className={styles.evidenceHeading}>
          <span>Connection evidence</span>
          <span className={styles.weakSignal}>Unverified</span>
        </div>
        <div>
          <h2>{selected}</h2>
          <div className={styles.evidenceList}>
            {signals.map((signal) => (
              <div key={signal.id} className={styles.evidenceItem}>
                <button
                  aria-expanded={expanded === signal.id}
                  aria-controls={`home-evidence-${signal.id}`}
                  onClick={() =>
                    setExpanded(expanded === signal.id ? null : signal.id)
                  }
                >
                  {signal.category === "asset" ? (
                    <Image size={16} />
                  ) : (
                    <AlignLeft size={16} />
                  )}
                  <span>{signal.name}</span>
                  <ChevronDown size={15} />
                </button>
                <div
                  id={`home-evidence-${signal.id}`}
                  hidden={expanded !== signal.id}
                  className={styles.evidenceExplanation}
                >
                  <p>
                    {signal.category === "asset"
                      ? "The example domains share a banner image. Licensed imagery or a shared template could also explain the match."
                      : "The example domains use matching returns-policy text. Common templates could also explain a match."}
                  </p>
                  <span>Synthetic source · {signal.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.evidenceFooter}>
          <p>Shared content does not establish ownership.</p>
          <button
            disabled={loading}
            onClick={async () => {
              if (!(await investigate(subject)))
                document.getElementById("domain")?.focus();
            }}
            aria-label={
              loading
                ? "View example report — opening example"
                : "View example report"
            }
            aria-busy={loading}
          >
            {loading ? "Opening example…" : "View example report"}{" "}
            <ArrowUpRight size={15} />
          </button>
        </div>
        <span className="sr-only" role="status">
          Selected connection: {selected}
        </span>
      </aside>
      <p className={styles.demoNote}>
        Fictional domains and signals. No live scan.
      </p>
    </div>
  );
}
