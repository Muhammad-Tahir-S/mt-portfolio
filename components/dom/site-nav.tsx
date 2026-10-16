"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./site-nav.module.css";

gsap.registerPlugin(useGSAP);

const links = [
  { href: "/", label: "01 Index" },
  { href: "/work", label: "02 Projects" },
] as const;

type NavLinkProps = {
  href: string;
  label: string;
};

function NavLink({ href, label }: NavLinkProps) {
  const rootRef = useRef<HTMLAnchorElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const rest = root.querySelector("[data-rest]");
      const hover = root.querySelector("[data-hover]");
      const line = root.querySelector("[data-line]");

      if (!rest || !hover || !line) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // The stylesheet parks the hover copy with translateY(100%).
      // GSAP reads that shift as a pixel y, then adds yPercent on top.
      // This set writes y back to 0 so the tween owns one shift.
      gsap.set([rest, hover], { y: 0, yPercent: 0 });

      const timeline = gsap.timeline({
        paused: true,
        defaults: { overwrite: "auto" },
      });

      timeline.addLabel("swap", 0);
      timeline.fromTo(
        [rest, hover],
        {
          y: 0,
          yPercent: (index) => (index === 0 ? 0 : 100),
        },
        {
          y: 0,
          yPercent: (index) => (index === 0 ? -100 : 0),
          duration: reduceMotion ? 0 : 0.45,
          ease: "power3.out",
          stagger: reduceMotion ? 0 : 0.05,
        },
        "swap",
      );
      timeline.addLabel("line", reduceMotion ? 0 : 0.08);
      timeline.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: reduceMotion ? 0 : 0.4,
          ease: "power2.inOut",
          transformOrigin: "left center",
        },
        "line",
      );

      timelineRef.current = timeline;

      return () => {
        timelineRef.current = null;
      };
    },
    { scope: rootRef },
  );

  function show() {
    timelineRef.current?.play();
  }

  function hide() {
    timelineRef.current?.reverse();
  }

  return (
    <Link
      ref={rootRef}
      href={href}
      className={styles.link}
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <span className={styles.stack}>
        <span className={styles.clip}>
          <span data-rest>{label}</span>
        </span>
        <span className={styles.clip} aria-hidden="true">
          <span data-hover>{label}</span>
        </span>
      </span>
      <span className={styles.line} data-line />
    </Link>
  );
}

export function SiteNav() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      {links.map((link) => (
        <NavLink key={link.href} href={link.href} label={link.label} />
      ))}
    </nav>
  );
}
