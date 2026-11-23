import type { CSSProperties } from "react";
import { TransitionLink } from "@/components/motion/transition-link";
import type { ProjectSummary } from "@/content/projects";
import styles from "./index-field.module.css";

type IndexFieldProps = {
  projects: readonly ProjectSummary[];
};

/**
 * DOM list for the index field.
 * Each frame is a bind target for a WebGL plane.
 */
export function IndexField({ projects }: IndexFieldProps) {
  return (
    <ul className={styles.list} data-index-field>
      {projects.map((project) => {
        if (!project.slug || !project.theme) {
          return null;
        }

        return (
          <li key={project.slug} className={styles.row}>
            <h2 className={styles.title}>
              <TransitionLink
                className={styles.link}
                href={`/work/${project.slug}`}
                nameTitle
              >
                {project.title}
              </TransitionLink>
            </h2>
            <p className={styles.summary}>{project.summary}</p>
            <div
              className={styles.frame}
              data-gl-plane={project.slug}
              style={
                { "--frame-fill": project.theme.background } as CSSProperties
              }
              aria-hidden="true"
            />
          </li>
        );
      })}
    </ul>
  );
}
