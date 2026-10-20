"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Search,
  FileSearch,
  GitBranch,
} from "lucide-react";
import { DomainSearch, useWorkspace } from "../components/workspace";
import { HeroSection } from "../components/ui/hero-section";
import { WaveText } from "../components/ui/wave-text";
import { HomepageInvestigation } from "../components/homepage-investigation";
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
          <a href="#how-it-works">How it works</a>
          <Link href="/about">Methodology</Link>
          <a href="#investigate" className={styles.navAction}>
            Check a website <ArrowUpRight size={16} />
          </a>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <HeroSection
          id="investigate"
          title="Know who you're dealing with."
          description="Investigate websites, uncover suspicious connections, and make more informed decisions before you trust a site."
          heading={
            <WaveText
              id="home-headline"
              as="h1"
              className={styles.headline}
              colors={["#8ea8d4", "#bac9df", "#99b4c5"]}
              base="#e1e5eb"
              shape="linear"
              bands={4}
              bandWidth={7}
              duration={2.8}
              delay={120}
            >
              Know who you're dealing with.
            </WaveText>
          }
        >
          <div className={styles.search}>
            <DomainSearch />
          </div>
          <div role="status" className="sr-only">
            {loading ? "Checking available sources…" : ""}
          </div>
          <div className={styles.heroLinks}>
            <a href="#example">
              Explore an example <ArrowDown size={15} />
            </a>
            {report && (
              <Link href="/report">
                Continue your investigation <ArrowRight size={15} />
              </Link>
            )}
          </div>
        </HeroSection>
        <section
          id="example"
          className={styles.showcase}
          aria-labelledby="showcase-title"
        >
          <div className={styles.showcaseIntroduction}>
            <div>
              <h2 id="showcase-title">A website is only the beginning.</h2>
            </div>
            <p>
              Follow shared signals between websites. <br />
              See the evidence behind every connection.
            </p>
          </div>
          <HomepageInvestigation />
        </section>
        <section
          id="how-it-works"
          className={styles.capabilities}
          aria-labelledby="capabilities-title"
        >
          <div className={styles.capabilitiesHeading}>
            <h2 id="capabilities-title">Look closer. Decide with context.</h2>
          </div>
          <div className={styles.capabilityColumns}>
            <article>
              <Search size={24} />
              <h3>Investigate websites.</h3>
              <p>
                Start with a domain or URL. Review available reputation signals
                and see where the information stops.
              </p>
            </article>
            <article>
              <FileSearch size={24} />
              <h3>Examine evidence.</h3>
              <p>
                Understand what each finding means, where it comes from, and
                what it cannot tell you.
              </p>
            </article>
            <article>
              <GitBranch size={24} />
              <h3>Discover connections.</h3>
              <p>
                Follow shared images and content across domains. Explore a
                connection before drawing a conclusion.
              </p>
            </article>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <div>
          <Link href="/" className={styles.brand} translate="no">
            <BrandMark />
            <span>TraceGraph</span>
          </Link>
          <p>Research preview. Evidence before conclusions.</p>
        </div>
        <Link href="/about">
          Sources & limitations <ArrowUpRight size={16} />
        </Link>
      </footer>
    </div>
  );
}
