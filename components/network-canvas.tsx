"use client";

import { useRef, useState, type PointerEvent } from "react";
import { Globe2, Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { connectionConfidence, relationshipLabel } from "../lib/graph-view.mjs";
import type { Report, Scan } from "../lib/types";

export function NetworkCanvas({
  report,
  connections,
  selected,
  onSelect,
  hidden,
}: {
  report: Report;
  connections: Scan["connections"];
  selected?: string;
  onSelect: (domain: string) => void;
  hidden: boolean;
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{
    id: number;
    x: number;
    y: number;
    panX: number;
    panY: number;
  } | null>(null);
  const height = Math.max(440, connections.length * 150);
  const confidence = connectionConfidence(report.demo);
  const changeZoom = (delta: number) =>
    setZoom((value) =>
      Math.min(1.8, Math.max(0.6, +(value + delta).toFixed(1))),
    );
  const reset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  function point(event: PointerEvent<SVGSVGElement>) {
    const matrix = event.currentTarget.getScreenCTM();
    return matrix
      ? new DOMPoint(event.clientX, event.clientY).matrixTransform(
          matrix.inverse(),
        )
      : new DOMPoint(0, 0);
  }
  function endDrag(event: PointerEvent<SVGSVGElement>) {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }
  return (
    <div className={`graph-viewport ${hidden ? "is-hidden" : ""}`}>
      <div className="canvas-heading">
        <span>{report.demo ? "Demo dataset" : "Reported signals"}</span>
        <span>{connections.length + 1} entities</span>
      </div>
      <svg
        className={`interactive-graph ${dragging ? "is-dragging" : ""}`}
        viewBox={`0 0 900 ${height}`}
        role="group"
        tabIndex={0}
        aria-label="Graph canvas"
        aria-describedby="graph-instructions"
        onPointerDown={(event) => {
          if (
            event.button !== 0 ||
            (event.target as Element).closest(
              'button, [role="button"], foreignObject',
            )
          )
            return;
          const position = point(event);
          drag.current = {
            id: event.pointerId,
            x: position.x,
            y: position.y,
            panX: pan.x,
            panY: pan.y,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onPointerMove={(event) => {
          if (drag.current?.id !== event.pointerId) return;
          const position = point(event);
          setPan({
            x: drag.current.panX + position.x - drag.current.x,
            y: drag.current.panY + position.y - drag.current.y,
          });
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          const directions: Record<string, [number, number]> = {
            ArrowLeft: [-40, 0],
            ArrowRight: [40, 0],
            ArrowUp: [0, -40],
            ArrowDown: [0, 40],
          };
          if (directions[event.key]) {
            event.preventDefault();
            const [x, y] = directions[event.key];
            setPan((value) => ({ x: value.x + x, y: value.y + y }));
          } else if (event.key === "Home") {
            event.preventDefault();
            reset();
          } else if (event.key === "+" || event.key === "=") {
            event.preventDefault();
            changeZoom(0.2);
          } else if (event.key === "-") {
            event.preventDefault();
            changeZoom(-0.2);
          }
        }}
      >
        <defs>
          <pattern
            id="canvas-grid"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="0.8" fill="var(--graph-dot)" />
          </pattern>
        </defs>
        <rect width="900" height={height} fill="url(#canvas-grid)" />
        <g
          className="graph-scene"
          transform={`translate(${pan.x} ${pan.y}) translate(450 ${height / 2}) scale(${zoom}) translate(-450 ${-height / 2})`}
        >
          {connections.map((item, index) => {
            const y = ((index + 1) * height) / (connections.length + 1);
            const labelY = (height / 2 + y) / 2;
            const label = relationshipLabel(
              item.sharedSignalIds,
              report.signals,
            );
            const active = selected === item.domain;
            return (
              <g key={item.domain}>
                <path
                  className={`graph-edge ${confidence.kind} ${active ? "selected" : ""}`}
                  d={`M330 ${height / 2} C440 ${height / 2} 460 ${y} 570 ${y}`}
                  fill="none"
                />
                <path
                  className="edge-hit"
                  d={`M330 ${height / 2} C440 ${height / 2} 460 ${y} 570 ${y}`}
                  fill="none"
                  role="button"
                  tabIndex={0}
                  aria-label={`Inspect connection to ${item.domain}: ${label}`}
                  aria-pressed={active}
                  onClick={() => onSelect(item.domain)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(item.domain);
                    }
                  }}
                />
                <g
                  className="edge-label"
                  aria-hidden="true"
                  pointerEvents="none"
                >
                  <rect
                    x="393"
                    y={labelY - 12}
                    width="114"
                    height="24"
                    rx="4"
                  />
                  <text x="450" y={labelY + 4} textAnchor="middle">
                    {label}
                  </text>
                </g>
                <foreignObject x="570" y={y - 39} width="280" height="84">
                  <button
                    className={`graph-node ${active ? "selected" : ""}`}
                    aria-pressed={active}
                    onClick={() => onSelect(item.domain)}
                  >
                    <span className="node-icon">
                      <Globe2 size={18} />
                    </span>
                    <span>
                      <strong>{item.domain}</strong>
                      <small>
                        Shared signals: {item.sharedSignalIds.length}
                      </small>
                    </span>
                  </button>
                </foreignObject>
              </g>
            );
          })}
          <foreignObject x="50" y={height / 2 - 39} width="280" height="84">
            <div className="graph-node root-node">
              <span className="node-icon">
                <Globe2 size={18} />
              </span>
              <span>
                <small>Investigated domain</small>
                <strong>{report.domain}</strong>
              </span>
            </div>
          </foreignObject>
        </g>
      </svg>
      <div className="canvas-bottom">
        <div className="graph-controls">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Zoom out"
            title="Zoom out (−)"
            disabled={zoom <= 0.6}
            onClick={() => changeZoom(-0.2)}
          >
            <Minus size={16} />
          </Button>
          <output aria-label="Zoom level">{Math.round(zoom * 100)}%</output>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Zoom in"
            title="Zoom in (+)"
            disabled={zoom >= 1.8}
            onClick={() => changeZoom(0.2)}
          >
            <Plus size={16} />
          </Button>
          <span className="control-divider" />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Reset view"
            title="Reset zoom and position (Home)"
            onClick={reset}
          >
            <RotateCcw size={15} />
          </Button>
        </div>
        <p id="graph-instructions">
          Drag to pan · Arrow keys to move · Home to reset
        </p>
      </div>
    </div>
  );
}
