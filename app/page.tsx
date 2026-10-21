"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Fingerprint,
  ScanLine,
} from "lucide-react";
import { DomainSearch, useWorkspace } from "../components/workspace";
import { HomepageMotion, Reveal } from "../components/homepage-motion";
import { HomepageInvestigation } from "../components/homepage-investigation";
import { HomepageStory } from "../components/homepage-story";
import styles from "./home.module.css";

function BrandMark() {
  return (
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
      <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" />
      <rect x="17" y="3" width="8" height="8" rx="2" fill="currentColor" />
      <rect x="3" y="17" width="8" height="8" rx="2" fill="currentColor" />
    </svg>
  );
}

export default function Home() {
  const { loading, report } = useWorkspace();
  return (
    <HomepageMotion>
      <div className={styles.page}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <header className={styles.header}>
          <Link href="/" className={styles.brand} translate="no">
            <BrandMark />
            <span>TraceGraph</span>
          </Link>
          <nav aria-label="Main navigation" className={styles.navigation}>
            <a href="#how-it-works">The investigation</a>
            <Link href="/about">Our approach</Link>
            <a href="#investigate" className={styles.navAction}>
              Check a website <ArrowUpRight size={15} />
            </a>
          </nav>
        </header>
        <main id="main" tabIndex={-1}>
          <section
            id="investigate"
            className={styles.hero}
            aria-labelledby="home-headline"
          >
            <div className={styles.heroCopy}>
              <Reveal delay={0.05}>
                <p className={styles.eyebrow}>
                  <Fingerprint size={17} /> Intelligence made visible
                </p>
                <h1 id="home-headline" className={styles.headline}>
                  See the connections.
                  <br />
                  <span>Question the unknown.</span>
                </h1>
                <p className={styles.introduction}>
                  A website never tells the whole story. Investigate its
                  signals, follow its connections, and see what deserves a
                  closer look.
                </p>
              </Reveal>
              <Reveal delay={0.18} className={styles.search}>
                <DomainSearch />
                <p className={styles.trustNote}>
                  <ScanLine size={16} /> Clear sources. Visible uncertainty. You
                  decide.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className={styles.heroLinks}>
                  <a href="#how-it-works">
                    Follow an example investigation <ArrowDown size={16} />
                  </a>
                  {report && (
                    <Link href="/report">
                      Continue your investigation <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </Reveal>
              <div role="status" className="sr-only">
                {loading ? "Checking available sources…" : ""}
              </div>
            </div>
            <Reveal delay={0.2} className={styles.heroVisual}>
              <HomepageInvestigation />
            </Reveal>
          </section>
          <div className={styles.principle}>
            <span>Beyond the first impression.</span>
            <p>
              One domain is a starting point.
              <br className={styles.mobileBreak} /> The evidence gives it
              context.
            </p>
            <a href="#how-it-works" aria-label="See how an investigation works">
              <ArrowDown size={20} />
            </a>
          </div>
          <HomepageStory />
          <Reveal className={styles.closing}>
            <div>
              <Fingerprint size={25} />
              <h2>
                A connection is a question.
                <br />
                <span>Evidence is where you start.</span>
              </h2>
            </div>
            <div>
              <p>
                Shared content can have an innocent explanation. TraceGraph
                keeps the source and its limitations in view, so a lead never
                becomes an unsupported verdict.
              </p>
              <Link href="/about">
                How we approach evidence <ArrowUpRight size={17} />
              </Link>
            </div>
          </Reveal>
        </main>
        <footer className={styles.footer}>
          <div>
            <Link href="/" className={styles.brand} translate="no">
              <BrandMark />
              <span>TraceGraph</span>
            </Link>
            <span className={styles.footerNote}>
              Independent questions. Informed decisions.
            </span>
          </div>
          <p>
            Research preview <span aria-hidden="true">/</span>{" "}
            <Link href="/about">Sources & limitations</Link>
          </p>
        </footer>
      </div>
    </HomepageMotion>
  );
}
