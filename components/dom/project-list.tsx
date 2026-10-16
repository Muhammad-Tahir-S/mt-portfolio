"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TransitionLink } from "@/components/motion/transition-link";
import type { ProjectSummary } from "@/content/projects";
import styles from "./project-list.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type ProjectListProps = {
  projects: readonly ProjectSummary[];
};

export function ProjectList({ projects }: ProjectListProps) {
  const listRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        return;
      }

      const rows = gsap.utils.toArray<HTMLElement>("[data-project-row]");

      rows.forEach((row) => {
        // fromTo hides the row. Leave visibility unset so the link stays in the tab order.
        gsap.fromTo(
          row,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              once: true,
            },
          },
        );
      });
    },
    { scope: listRef },
  );

  return (
    <ul ref={listRef} className={styles.list}>
      {projects.map((project) => (
        <li key={project.slug ?? project.title} className={styles.row} data-project-row>
          <h2 className={styles.title}>
            {project.slug ? (
              <TransitionLink
                className={styles.link}
                href={`/work/${project.slug}`}
                nameTitle
              >
                {project.title}
              </TransitionLink>
            ) : (
              project.title
            )}
          </h2>
          <p className={styles.summary}>{project.summary}</p>
        </li>
      ))}
    </ul>
  );
}
