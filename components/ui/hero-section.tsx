"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mockup, MockupFrame } from "@/components/ui/mockup";
import { cn } from "@/lib/utils";
import styles from "./hero-section.module.css";

export interface HeroAction {
  text: string;
  href: string;
  icon?: ReactNode;
  variant?: "default" | "outline" | "ghost";
}

export interface HeroProps {
  title: string;
  description: string;
  eyebrow?: string;
  badge?: { text: string; action: { text: string; href: string } };
  actions?: HeroAction[];
  image?: { light: string; dark: string; alt: string };
  /** An accessible heading, such as the supplied WaveText component. */
  heading?: ReactNode;
  /** Primary product interaction; TraceGraph supplies its existing domain search. */
  children?: ReactNode;
  /** Prefer a working product preview to a static screenshot when available. */
  preview?: ReactNode;
  id?: string;
  className?: string;
}

/** Adapted from the supplied hero: existing buttons, a dark-first surface, and live interaction slots. */
export function HeroSection({
  title,
  description,
  eyebrow,
  badge,
  actions = [],
  image,
  heading,
  children,
  preview,
  id,
  className,
}: HeroProps) {
  return (
    <section id={id} className={cn(styles.hero, className)} aria-label={title}>
      {badge && (
        <Badge variant="outline" className={styles.badge}>
          <span>{badge.text}</span>
          <a href={badge.action.href}>
            {badge.action.text}
            <ArrowUpRight size={14} />
          </a>
        </Badge>
      )}
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      {heading || <h1 className={styles.title}>{title}</h1>}
      <p className={styles.description}>{description}</p>
      {children}
      {actions.length > 0 && (
        <div className={styles.actions}>
          {actions.map((action) => (
            <Button
              key={action.href + action.text}
              variant={action.variant}
              asChild
            >
              <a href={action.href}>
                {action.icon}
                {action.text}
              </a>
            </Button>
          ))}
        </div>
      )}
      {(preview || image) && (
        <MockupFrame className={styles.frame}>
          <Mockup className={styles.mockup}>
            {preview ||
              (image && (
                <Image
                  src={image.dark}
                  alt={image.alt}
                  width={1248}
                  height={765}
                  priority
                />
              ))}
          </Mockup>
        </MockupFrame>
      )}
    </section>
  );
}
