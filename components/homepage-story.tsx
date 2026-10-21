"use client";

import { useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  FileText,
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
  function chooseStep(index: number) {
    manualSelection.current = true;
    setStep(index);
  }
  const reduced = useReducedMotion();
  const { investigate, loading } = useWorkspace();
  return (
    <section
      id="how-it-works"
      className={styles.story}
      aria-labelledby="story-title"
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
        <div className={styles.storySteps} aria-label="Investigation stages">
          {steps.map(({ title, description, Icon }, index) => (
            <m.div
              key={title}
              onViewportEnter={() => {
                if (
                  !manualSelection.current &&
                  window.matchMedia("(min-width: 1101px)").matches
                )
                  setStep(index);
              }}
              viewport={{ margin: "-35% 0px -45% 0px" }}
            >
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
            </m.div>
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
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={step}
                className={styles.storyState}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -8 }}
                transition={{ duration: reduced ? 0 : 0.25 }}
              >
                <p className={styles.stateLabel}>{steps[step].label}</p>
                {step === 0 && (
                  <div className={styles.domainStage}>
                    <span className={styles.largeMonogram}>a</span>
                    <h3>aurora-deals.example</h3>
                    <p>A fictional shop. An open question.</p>
                    <div className={styles.observation}>
                      <Search size={17} />
                      <span>
                        Start with the domain.
                        <small>No verdict has been established.</small>
                      </span>
                    </div>
                  </div>
                )}
                {step === 1 && (
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
                      An observation is a starting point. Templates and licensed
                      assets can also produce a match.
                    </p>
                  </div>
                )}
                {step === 2 && (
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
                {step === 3 && (
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
                      onClick={() =>
                        void investigate("aurora-deals.example", "/network")
                      }
                    >
                      Explore example network <ArrowUpRight size={17} />
                    </button>
                  </div>
                )}
              </m.div>
            </AnimatePresence>
            <div className={styles.storyBottom}>
              <span>Demo walkthrough · no live intelligence</span>
              <button onClick={() => chooseStep((step + 1) % steps.length)}>
                {step === 3 ? "Start again" : "Next step"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <p className={styles.storyHint}>
            Scroll to follow the investigation, or select a step.
          </p>
        </div>
      </div>
    </section>
  );
}
