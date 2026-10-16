"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./study.module.css";

type StudyTitleProps = {
  children: ReactNode;
};

export function StudyTitle({ children }: StudyTitleProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = ref.current;
    if (!heading || typeof document.startViewTransition !== "function") {
      return;
    }
    // A route change names this heading before the new photograph.
    if (heading.style.viewTransitionName === "project-title") {
      return;
    }
    heading.style.viewTransitionName = "project-title";
  }, []);

  return (
    <h1 ref={ref} className={styles.display} tabIndex={-1}>
      {children}
    </h1>
  );
}
