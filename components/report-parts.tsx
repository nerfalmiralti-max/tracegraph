import {
  CircleHelp,
  FlaskConical,
  ShieldAlert,
  Info,
  Globe2,
  Image,
  AlignLeft,
} from "lucide-react";
import type { Report, Scan } from "../lib/types";

export const reputationLabels: Record<string, string> = {
  listed: "Match found",
  not_listed: "No match found",
  not_configured: "Not connected",
  unavailable: "Source unavailable",
};

export function Assessment({ scan }: { scan: Scan }) {
  const threat = scan.status === "known_threat";
  const Icon = threat ? ShieldAlert : CircleHelp;
  return (
    <section
      className={`assessment ${threat ? "is-threat" : ""}`}
      aria-label="Assessment"
    >
      <div className="assessment-main">
        <span className="assessment-icon">
          <Icon size={25} />
        </span>
        <div>
          <div className="eyebrow">Assessment</div>
          <h2>{threat ? "Known threat match" : "Insufficient evidence"}</h2>
          <p>
            {threat
              ? "Google Web Risk returned a match for the checked address. Review the threat type and source below."
              : scan.demo
                ? "This is a demonstration. No live reputation check was performed."
                : "Available sources do not support a reliable risk assessment. This is not a safety clearance."}
          </p>
        </div>
        <span className={`badge ${threat ? "badge-danger" : "badge-warning"}`}>
          {threat ? "Threat match" : "Undetermined"}
        </span>
      </div>
      <dl className="assessment-facts">
        <div>
          <dt>Reputation coverage</dt>
          <dd>
            {scan.demo
              ? "Demo only"
              : reputationLabels[scan.reputation.status] || "Unknown"}
          </dd>
        </div>
        <div>
          <dt>Related domains</dt>
          <dd>
            {scan.connections.length}
            <span>{scan.demo ? " in demo dataset" : " in available data"}</span>
          </dd>
        </div>
        <div>
          <dt>Source observation date</dt>
          <dd>Not provided</dd>
        </div>
      </dl>
    </section>
  );
}

export function DemoNotice() {
  return (
    <div className="demo-notice">
      <FlaskConical size={16} />
      <span>
        <strong>Demo investigation.</strong> Domains, signals, and connections
        are fictional. No live intelligence is shown.
      </span>
    </div>
  );
}

export function ReportHeading({
  report,
  title,
}: {
  report: Report;
  title: string;
}) {
  return (
    <div className="page-heading">
      <span className="subject-icon">
        <Globe2 size={24} />
      </span>
      <div className="subject-heading">
        <div className="eyebrow">{title}</div>
        <h1>{report.domain}</h1>
        <p className="report-time">
          {report.demo ? "Demo loaded" : "Last checked"}{" "}
          <time dateTime={report.receivedAt}>
            {new Date(report.receivedAt).toLocaleString("en-US", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
              timeZoneName: "short",
            })}
          </time>
          <span>·</span>Source date unavailable
        </p>
      </div>
      {report.demo && (
        <span className="badge">
          <FlaskConical size={14} />
          Demo
        </span>
      )}
    </div>
  );
}

export function Reputation({ scan }: { scan: Scan }) {
  return (
    <div className="source-row">
      <div className="source-icon">G</div>
      <div className="source-description">
        <h3>Google Web Risk</h3>
        <p>Known threat lists · root HTTPS address</p>
      </div>
      <span
        className={`badge ${scan.reputation.status === "listed" ? "badge-danger" : ""}`}
      >
        {scan.demo
          ? "Not queried · demo"
          : reputationLabels[scan.reputation.status] || "Unknown status"}
      </span>
    </div>
  );
}

export function EvidenceList({ scan, ids }: { scan: Scan; ids?: string[] }) {
  const signals = ids
    ? scan.signals.filter((signal) => ids.includes(signal.id))
    : scan.signals;
  if (!signals.length)
    return (
      <div className="inline-empty">
        <Info size={20} />
        <div>
          <strong>No connection evidence available</strong>
          <p>
            A conclusion requires reliable sources. Missing evidence does not
            establish safety.
          </p>
        </div>
      </div>
    );
  return (
    <div className="evidence-list">
      {signals.map((signal) => (
        <details key={signal.id} className="evidence-item">
          <summary>
            <span className="signal-symbol">
              {signal.category === "asset" ? (
                <Image size={17} />
              ) : (
                <AlignLeft size={17} />
              )}
            </span>
            <span>
              {signal.name}
              <small>
                {scan.demo
                  ? "Demo dataset · not independently verified"
                  : "Source not provided"}
              </small>
            </span>
            <span className="badge badge-warning">
              {signal.strength === "weak" ? "Weak signal" : "Unassessed"}
            </span>
          </summary>
          <div className="evidence-body">
            <p>
              Shared templates or licensed content can explain a match. This
              signal does not establish common ownership or fraudulent activity.
            </p>
            <dl>
              <div>
                <dt>Signal ID</dt>
                <dd>{signal.id}</dd>
              </div>
              <div>
                <dt>Origin</dt>
                <dd>
                  {scan.demo ? "Synthetic TraceGraph fixture" : "Not provided"}
                </dd>
              </div>
              <div>
                <dt>Observed</dt>
                <dd>Not provided</dd>
              </div>
            </dl>
          </div>
        </details>
      ))}
    </div>
  );
}
