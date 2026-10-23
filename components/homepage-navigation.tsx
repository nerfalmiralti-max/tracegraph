"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import styles from "../app/home.module.css";

export function HomepageNavigation() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  return (
    <div
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={toggle}
        className={styles.menuToggle}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="home-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />} Menu
      </button>
      <nav
        id="home-navigation"
        aria-label="Main navigation"
        className={styles.navigation}
        data-open={open}
      >
        <a href="#how-it-works" onClick={() => setOpen(false)}>
          The investigation
        </a>
        <Link href="/about" onClick={() => setOpen(false)}>
          Our approach
        </Link>
        <a
          href="#investigate"
          className={styles.navAction}
          onClick={(event) => {
            event.preventDefault();
            setOpen(false);
            document.getElementById("domain")?.focus();
          }}
        >
          Check a website <ArrowUpRight size={15} />
        </a>
      </nav>
    </div>
  );
}
