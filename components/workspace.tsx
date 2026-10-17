"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowUpRight,
  ChevronRight,
  FileText,
  Fingerprint,
  GitBranch,
  Info,
  LoaderCircle,
  Search,
} from "lucide-react";
import type { Report, Scan } from "../lib/types";
import { Button } from "./ui/button";

type WorkspaceState = {
  report: Report | null;
  loading: boolean;
  error: string;
  investigate: (
    url: string,
    destination?: "/report" | "/network",
  ) => Promise<boolean>;
};
const Context = createContext<WorkspaceState | null>(null);
export function useWorkspace() {
  const value = useContext(Context);
  if (!value) throw new Error("Workspace provider is missing");
  return value;
}

const navigation = [
  { href: "/", title: "Investigate", Icon: Search },
  { href: "/report", title: "Domain report", Icon: FileText },
  { href: "/network", title: "Network explorer", Icon: GitBranch },
];

export function Workspace({ children }: { children: ReactNode }) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const busy = useRef(false);
  const pathname = usePathname();
  const router = useRouter();
  async function investigate(
    url: string,
    destination: "/report" | "/network" = "/report",
  ) {
    if (busy.current) return false;
    busy.current = true;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error || "We couldn’t complete the check. Please try again.",
        );
      setReport({ ...(data as Scan), receivedAt: new Date().toISOString() });
      router.push(destination);
      return true;
    } catch (error) {
      setError(
        error instanceof TypeError
          ? "Couldn’t reach the server. Check your connection and try again."
          : error instanceof Error
            ? error.message
            : "Connection lost. Please try again.",
      );
      return false;
    } finally {
      setLoading(false);
      busy.current = false;
    }
  }
  return (
    <Context.Provider value={{ report, loading, error, investigate }}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="app-shell">
        <aside className="sidebar" aria-label="Workspace">
          <Link className="brand" href="/" translate="no">
            <span className="brand-mark">
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M7 7h14M7 7v14M7 21 21 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect
                  x="3"
                  y="3"
                  width="8"
                  height="8"
                  rx="2"
                  fill="currentColor"
                />
                <rect
                  x="17"
                  y="3"
                  width="8"
                  height="8"
                  rx="2"
                  fill="currentColor"
                />
                <rect
                  x="3"
                  y="17"
                  width="8"
                  height="8"
                  rx="2"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span>
              TraceGraph<small>Domain intelligence</small>
            </span>
          </Link>
          <div className="workspace-label">Workspace</div>
          <nav aria-label="Primary navigation">
            {navigation.map(({ href, title, Icon }) => (
              <Link
                key={href}
                href={href}
                className={`nav-item ${pathname === href ? "active" : ""}`}
                aria-current={pathname === href ? "page" : undefined}
              >
                <Icon size={17} />
                <span>{title}</span>
              </Link>
            ))}
          </nav>
          {report && (
            <div className="session">
              <div className="workspace-label">Current investigation</div>
              <Link href="/report">
                <span className="domain-dot" />
                <span className="truncate">{report.domain}</span>
              </Link>
              <small>This session only</small>
            </div>
          )}
          <div className="sidebar-bottom">
            <div className="alpha-note">
              <span className="status-dot" />
              Research preview
            </div>
            <p>Evidence before conclusions.</p>
            <Link className="method-link" href="/about">
              <Info size={15} />
              Data & methodology
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </aside>
        <div className="workspace-main">
          <header className="topbar">
            <div className="breadcrumb">
              <span>Workspace</span>
              <ChevronRight size={14} />
              <span>
                {navigation.find((item) => item.href === pathname)?.title ||
                  "Methodology"}
              </span>
            </div>
            <span className="topbar-note">Research preview</span>
          </header>
          <div className="request-state" aria-live="polite">
            {loading && (
              <p>
                <LoaderCircle className="spin" size={16} />
                Checking available sources…
              </p>
            )}
          </div>
          {error && report && pathname !== "/" && (
            <div className="request-error" role="alert">
              <Info size={18} />
              <div>
                <strong>Check incomplete</strong>
                <p>{error}</p>
                {report && (
                  <small>
                    Your previous report for {report.domain} is still available.
                  </small>
                )}
              </div>
            </div>
          )}
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <footer className="workspace-footer">
            <span>
              <Fingerprint size={14} />
              TraceGraph · Research alpha
            </span>
            <Link href="/about">
              How to read a report
              <ArrowUpRight size={13} />
            </Link>
          </footer>
        </div>
      </div>
    </Context.Provider>
  );
}

export function DomainSearch({ compact = false }: { compact?: boolean }) {
  const [url, setUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { investigate, loading, error } = useWorkspace();
  const inputId = compact ? "domain-compact" : "domain";
  return (
    <form
      noValidate
      className={`domain-search ${compact ? "compact" : ""}`}
      onSubmit={async (event) => {
        event.preventDefault();
        if (!(await investigate(url))) inputRef.current?.focus();
      }}
    >
      <label htmlFor={inputId}>Domain or website URL</label>
      <div className="search-control">
        <Search size={21} />
        <input
          ref={inputRef}
          id={inputId}
          name="url"
          type="text"
          inputMode="url"
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${inputId}-error`
              : !compact
                ? `${inputId}-hint`
                : undefined
          }
          required
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="example.com or https://example.com"
          autoComplete="url"
          autoCapitalize="none"
          spellCheck={false}
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <LoaderCircle className="spin" size={17} />
          ) : (
            <Search size={16} />
          )}
          <span>{loading ? "Checking…" : "Check website"}</span>
        </Button>
      </div>
      {error && (
        <div id={`${inputId}-error`} className="field-error" role="alert">
          <strong>Check incomplete</strong>
          <p>{error}</p>
        </div>
      )}
      {!compact && (
        <p id={`${inputId}-hint`} className="search-hint">
          Domain lookup only. Page paths and URL parameters are excluded.
        </p>
      )}
    </form>
  );
}

export function EmptyReport({ network = false }: { network?: boolean }) {
  const { investigate, loading } = useWorkspace();
  return (
    <div className="empty-report">
      <span className="empty-icon">
        {network ? <GitBranch /> : <FileText />}
      </span>
      <h1>{network ? "Start with a domain" : "No investigation yet"}</h1>
      <p>
        Check a website to review available signals, sources, and limitations.
        Reports stay in this tab until you reload.
      </p>
      <DomainSearch compact />
      <Button
        variant="ghost"
        disabled={loading}
        onClick={() =>
          void investigate(
            "aurora-deals.example",
            network ? "/network" : "/report",
          )
        }
      >
        Open demo investigation
        <ArrowUpRight size={16} />
      </Button>
    </div>
  );
}
