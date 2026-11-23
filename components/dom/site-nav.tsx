"use client";

import { useRef, type PointerEvent, type RefObject } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./site-nav.module.css";

gsap.registerPlugin(useGSAP);

const links = [
  { href: "/", label: "01 Index" },
  { href: "/work", label: "02 Projects" },
] as const;

type Pressed = {
  pointer: boolean;
  focus: boolean;
  touch: boolean;
};

function usePressSync(timelineRef: RefObject<gsap.core.Timeline | null>) {
  const pressed = useRef<Pressed>({
    pointer: false,
    focus: false,
    touch: false,
  });

  function sync() {
    const timeline = timelineRef.current;

    if (!timeline) {
      return;
    }

    const on =
      pressed.current.pointer ||
      pressed.current.focus ||
      pressed.current.touch;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduce) {
      timeline.progress(on ? 1 : 0);
      return;
    }

    if (on) {
      timeline.play();
      return;
    }

    timeline.reverse();
  }

  return { pressed, sync };
}

type NavLinkProps = {
  href: string;
  label: string;
};

function NavLink({ href, label }: NavLinkProps) {
  const rootRef = useRef<HTMLAnchorElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const { pressed, sync } = usePressSync(timelineRef);

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
          duration: 0.45,
          ease: "power3.out",
          stagger: 0.05,
        },
        "swap",
      );
      timeline.addLabel("line", 0.08);
      timeline.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.4,
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

  function onPointerEnter(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === "touch") {
      return;
    }

    pressed.current.pointer = true;
    sync();
  }

  function onPointerLeave(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === "touch") {
      return;
    }

    pressed.current.pointer = false;
    sync();
  }

  function onFocus() {
    if (!rootRef.current?.matches(":focus-visible")) {
      return;
    }

    pressed.current.focus = true;
    sync();
  }

  function onBlur() {
    pressed.current.focus = false;
    sync();
  }

  function onPointerDown(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "touch") {
      return;
    }

    pressed.current.touch = true;
    sync();
  }

  function onPointerUp(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "touch") {
      return;
    }

    pressed.current.touch = false;
    sync();
  }

  return (
    <Link
      ref={rootRef}
      href={href}
      className={styles.link}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onFocus={onFocus}
      onBlur={onBlur}
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

function ContactLink() {
  const rootRef = useRef<HTMLAnchorElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const pressed = useRef<Pressed>({
    pointer: false,
    focus: false,
    touch: false,
  });

  function clearLabelColor() {
    const label = rootRef.current?.querySelector("[data-label]");

    if (label) {
      // Drop the inline colour so the label can inherit the live theme ink.
      gsap.set(label, { clearProps: "color" });
    }
  }

  function sync() {
    const timeline = timelineRef.current;

    if (!timeline) {
      return;
    }

    const on =
      pressed.current.pointer ||
      pressed.current.focus ||
      pressed.current.touch;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduce) {
      timeline.invalidate();
      timeline.progress(on ? 1 : 0);
      if (!on) {
        clearLabelColor();
      }
      return;
    }

    if (on) {
      // Rebuild ink and paper from the current body theme before play.
      if (timeline.progress() === 0) {
        timeline.invalidate();
      }
      timeline.play();
      return;
    }

    timeline.reverse();
  }

  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const fill = root.querySelector("[data-fill]");
      const label = root.querySelector("[data-label]");

      if (!fill || !label) {
        return;
      }

      gsap.set(fill, { scale: 0, transformOrigin: "center" });

      const timeline = gsap.timeline({
        paused: true,
        defaults: { overwrite: "auto" },
      });

      timeline.fromTo(
        fill,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.55,
          ease: "expo.out",
          transformOrigin: "center",
        },
        0,
      );
      // Fill uses the ink colour. The label must move to the page paper.
      // immediateRender: false keeps the rest state on CSS inherit.
      timeline.fromTo(
        label,
        {
          color: () => getComputedStyle(document.body).color,
        },
        {
          color: () => getComputedStyle(document.body).backgroundColor,
          duration: 0.35,
          ease: "power2.out",
          immediateRender: false,
        },
        0,
      );
      timeline.eventCallback("onReverseComplete", clearLabelColor);

      timelineRef.current = timeline;

      return () => {
        timeline.eventCallback("onReverseComplete", null);
        timelineRef.current = null;
      };
    },
    { scope: rootRef },
  );

  function onPointerEnter(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === "touch") {
      return;
    }

    pressed.current.pointer = true;
    sync();
  }

  function onPointerLeave(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === "touch") {
      return;
    }

    pressed.current.pointer = false;
    sync();
  }

  function onFocus() {
    if (!rootRef.current?.matches(":focus-visible")) {
      return;
    }

    pressed.current.focus = true;
    sync();
  }

  function onBlur() {
    pressed.current.focus = false;
    sync();
  }

  function onPointerDown(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "touch") {
      return;
    }

    pressed.current.touch = true;
    sync();
  }

  function onPointerUp(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "touch") {
      return;
    }

    pressed.current.touch = false;
    sync();
  }

  return (
    <Link
      ref={rootRef}
      href="/contact"
      className={styles.contact}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <span className={styles.fill} data-fill aria-hidden="true" />
      <span className={styles.contactLabel} data-label>
        03 Contact
      </span>
    </Link>
  );
}

export function SiteNav() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      {links.map((link) => (
        <NavLink key={link.href} href={link.href} label={link.label} />
      ))}
      <ContactLink />
    </nav>
  );
}
