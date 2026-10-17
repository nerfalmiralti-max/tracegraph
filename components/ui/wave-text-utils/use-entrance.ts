"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

export type EntranceTrigger = "load" | "in-view";
type EntrancePhase = "static" | "armed" | "running";
const motionQuery = "(prefers-reduced-motion: reduce)";
const getMotion = () => window.matchMedia(motionQuery).matches;
const getServerMotion = () => false;
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Observe visibility independently of playback so repeated waves pause offscreen. */
export function useEntrance<T extends HTMLElement>({
  trigger = "load",
  once = true,
  play,
}: {
  trigger?: EntranceTrigger;
  once?: boolean;
  play?: boolean;
} = {}) {
  const [element, setElement] = useState<T | null>(null);
  const [inView, setInView] = useState(trigger === "load");
  const [entered, setEntered] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    getMotion,
    getServerMotion,
  );
  const observe = useCallback((node: T | null) => setElement(node), []);

  useEffect(() => {
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      setEntered(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio > 0;
        setInView(visible);
        if (visible) setEntered(true);
      },
      { threshold: 0.01 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  const shouldPlay = play ?? (trigger === "load" || (once ? entered : inView));
  const phase: EntrancePhase = reducedMotion
    ? "static"
    : shouldPlay
      ? "running"
      : "armed";
  return [observe, phase, inView] as const;
}
