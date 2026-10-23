"use client";

import {
  LazyMotion,
  domAnimation,
  MotionConfig,
  m,
  useReducedMotion,
} from "motion/react";
import { useState, type ReactNode } from "react";

export const settle = [0.22, 1, 0.36, 1] as const;

export function HomepageMotion({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.5, ease: settle }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const [focused, setFocused] = useState(false);
  return (
    <m.div
      className={className}
      data-entrance
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={focused ? { opacity: 1, y: 0 } : undefined}
      whileInView={{ opacity: 1, y: 0 }}
      onFocusCapture={() => setFocused(true)}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reduced || focused ? 0 : 0.45,
        delay: reduced || focused ? 0 : delay,
        ease: settle,
      }}
    >
      {children}
    </m.div>
  );
}
