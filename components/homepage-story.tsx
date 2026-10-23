"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { m, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  FileText,
  Fingerprint,
  FlaskConical,
  GitBranch,
  Globe2,
  Image,
  Search,
} from "lucide-react";
import { useWorkspace } from "./workspace";
import { Reveal } from "./homepage-motion";
import styles from "../app/home.module.css";

const steps = [
  {
    title: "Start with a question.",
    description:
      "A shop you haven’t seen before. An unexpected link. Choose the website you want to understand.",
    label: "Select a website",
    Icon: Search,
  },
  {
    title: "Look at what’s there.",
    description:
      "Examine available signals and their sources. Separate an observation from the conclusion it might suggest.",
    label: "Examine evidence",
    Icon: FileText,
  },
  {
    title: "Follow the shared signals.",
    description:
      "An image. A paragraph. Shared content can connect separate websites—and give you a new lead.",
    label: "Discover connections",
    Icon: GitBranch,
  },
  {
    title: "Keep the uncertainty in view.",
    description:
      "See why a connection exists, how strong the evidence is, and what still needs to be verified.",
    label: "Inspect a connection",
    Icon: Globe2,
  },
];

export function HomepageStory() {
  const [step, setStep] = useState(0);
  const manualSelection = useRef(false);
  const stagesRef = useRef<HTMLDivElement>(null);
  function chooseStep(index: number) {
    manualSelection.current = true;
    setStep(index);
  }
  const reduced = useReducedMotion();
  const { investigate, loading } = useWorkspace();
  useEffect(() => {
    if (reduced) return;
    const desktop = window.matchMedia("(min-width: 1101px)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!desktop.matches || manualSelection.current || !stagesRef.current)
        return;
      const bounds = stagesRef.current.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
      const focused = document.activeElement;
      if (
        focused?.closest("#story-preview") &&
        focused.matches(":focus-visible")
      )
        return;
      const positions = Array.from(stagesRef.current.children).map((item) =>
        item.getBoundingClientRect(),
      );
      // The final stage must remain reachable on short pages and tall viewports.
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;
      const center = window.innerHeight / 2;
      const nearest = positions.reduce(
        (best, position, index) =>
          Math.abs(position.top + position.height / 2 - center) <
          Math.abs(positions[best].top + positions[best].height / 2 - center)
            ? index
            : best,
        0,
      );
      setStep(atBottom ? steps.length - 1 : nearest);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);
  return (
    <section
      id="how-it-works"
      className={styles.story}
      aria-labelledby="story-title"
      tabIndex={-1}
      onWheelCapture={() => {
        manualSelection.current = false;
      }}
      onTouchMoveCapture={() => {
        manualSelection.current = false;
      }}
      onKeyDownCapture={(event) => {
        if (
          [
            "PageDown",
            "PageUp",
            "ArrowDown",
            "ArrowUp",
            "Home",
            "End",
          ].includes(event.key)
        )
          manualSelection.current = false;
      }}
    >
      <Reveal className={styles.storyHeading}>
        <p className={styles.eyebrow}>Inside an investigation</p>
        <h2 id="story-title">
          From a single website
          <br />
          to a wider picture.
        </h2>
        <p>Follow the evidence, one connection at a time.</p>
      </Reveal>
      <div className={styles.storyGrid}>
        <div
          ref={stagesRef}
          className={styles.storySteps}
          aria-label="Investigation stages"
        >
          {steps.map(({ title, description, Icon }, index) => (
            <div key={title}>
              <button
                className={`${styles.storyStep} ${step === index ? styles.activeStep : ""}`}
                aria-pressed={step === index}
                aria-controls="story-preview"
                onClick={() => chooseStep(index)}
              >
                <span className={styles.stepNumber}>0{index + 1}</span>
                <span>
                  <strong>{title}</strong>
                  <span>{description}</span>
                </span>
                <Icon size={19} />
              </button>
            </div>
          ))}
        </div>
        <div className={styles.storySticky}>
          <div
            id="story-preview"
            className={styles.storyPreview}
            role="region"
            aria-label="Investigation walkthrough"
          >
            <div className={styles.storyPreviewBar}>
              <span>Trace / {String(step + 1).padStart(2, "0")}</span>
              <span>
                <FlaskConical size={13} /> Synthetic example
              </span>
            </div>
            <div className={styles.storyProgress} aria-hidden="true">
              {steps.map((_, index) => (
                <span key={index} data-active={index <= step} />
              ))}
            </div>
            <div className={styles.storyPanels}>
              {steps.map((item, index) => (
                <m.div
                  key={item.label}
                  className={styles.storyState}
                  aria-hidden={step !== index}
                  inert={step !== index}
                  style={{ visibility: step === index ? "visible" : "hidden" }}
                  initial={false}
                  animate={{ opacity: step === index ? 1 : 0 }}
                  transition={{ duration: reduced ? 0 : 0.18 }}
                >
                  <p className={styles.stateLabel}>{item.label}</p>
                  <p className={styles.stageDescription}>{item.description}</p>
                  {index === 0 && (
                    <div className={styles.domainStage}>
                      <div className={styles.domainIdentity}>
                        <span className={styles.largeMonogram}>a</span>
                        <div>
                          <h3>aurora-deals.example</h3>
                          <p>A fictional shop. An open question.</p>
                        </div>
                      </div>
                      <dl className={styles.domainContext}>
                        <div>
                          <dt>Investigation</dt>
                          <dd>Website and related domains</dd>
                        </div>
                        <div>
                          <dt>Available context</dt>
                          <dd>Shared images and policy text</dd>
                        </div>
                        <div>
                          <dt>Assessment</dt>
                          <dd>Not established</dd>
                        </div>
                      </dl>
                      <div className={styles.observation}>
                        <Search size={17} />
                        <span>
                          Examine the available evidence.
                          <small>
                            A familiar-looking site still deserves a closer
                            look.
                          </small>
                        </span>
                      </div>
                    </div>
                  )}
                  {index === 1 && (
                    <div className={styles.sourceStage}>
                      <h3>What can we observe?</h3>
                      <div>
                        <Image size={22} />
                        <span>
                          Shared banner image
                          <small>Content signal · synthetic source</small>
                        </span>
                        <span className={styles.signalType}>Image</span>
                      </div>
                      <div>
                        <FileText size={22} />
                        <span>
                          Matching returns policy
                          <small>Content signal · synthetic source</small>
                        </span>
                        <span className={styles.signalType}>Text</span>
                      </div>
                      <p className={styles.storyCaution}>
                        An observation is a starting point. Templates and
                        licensed assets can also produce a match.
                      </p>
                    </div>
                  )}
                  {index === 2 && (
                    <div className={styles.connectionsStage}>
                      <h3>One website. Two possible leads.</h3>
                      <div className={styles.miniRoot}>
                        <Globe2 size={19} /> aurora-deals.example
                      </div>
                      <div className={styles.miniBranches}>
                        <div>
                          <span>Shared image + text</span>
                          <strong>nova-outlet.example</strong>
                        </div>
                        <div>
                          <span>Matching text</span>
                          <strong>polar-shop.example</strong>
                        </div>
                      </div>
                      <p className={styles.storyCaution}>
                        Both relationships are inferred from the fictional
                        dataset.
                      </p>
                    </div>
                  )}
                  {index === 3 && (
                    <div className={styles.conclusionStage}>
                      <h3>A lead, with its limitations.</h3>
                      <div>
                        <span>Related domain</span>
                        <strong>nova-outlet.example</strong>
                      </div>
                      <div>
                        <span>Basis</span>
                        <strong>Shared image and policy text</strong>
                      </div>
                      <div>
                        <span>Evidence strength</span>
                        <strong className={styles.amberText}>
                          Weak · unverified
                        </strong>
                      </div>
                      <div>
                        <span>Common ownership</span>
                        <strong>Not established</strong>
                      </div>
                      <button
                        className={styles.storyAction}
                        disabled={loading}
                        aria-label={
                          loading
                            ? "Explore example network — opening example"
                            : "Explore example network"
                        }
                        aria-busy={loading}
                        onClick={async () => {
                          if (
                            !(await investigate(
                              "aurora-deals.example",
                              "/network",
                            ))
                          )
                            document.getElementById("domain")?.focus();
                        }}
                      >
                        {loading
                          ? "Opening example…"
                          : "Explore example network"}{" "}
                        <ArrowUpRight size={17} />
                      </button>
                    </div>
                  )}
                </m.div>
              ))}
            </div>
            <div className={styles.storyBottom}>
              <span>Synthetic data · no live scan</span>
              <button onClick={() => chooseStep((step + 1) % steps.length)}>
                {step === 3 ? "Start again" : "Next step"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <p className={styles.storyHint}>
            Select a stage or use Next step to follow the evidence.
          </p>
        </div>
      </div>
      <div className={styles.closing}>
        <div>
          <Fingerprint size={22} aria-hidden="true" />
          <h3>
            A connection is a question.
            <br />
            <span>Evidence is where you start.</span>
          </h3>
        </div>
        <div>
          <p>
            Shared content can have an innocent explanation. TraceGraph keeps
            the source and its limitations in view, so a lead never becomes an
            unsupported verdict.
          </p>
          <Link href="/about">
            How we approach evidence <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
