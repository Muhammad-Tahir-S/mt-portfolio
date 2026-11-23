"use client";

import { useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { normalizePath, projects } from "@/content/projects";
import { planeDepthForIndex } from "@/lib/camera-path";
import { BoundPlane } from "./bound-plane";

type PlaneTarget = {
  slug: string;
  color: string;
  depth: number;
  element: HTMLElement;
};

const GL_FIELD_CLASS = "has-index-gl";

/**
 * Read the index DOM boxes and spawn one plane per project.
 * The canvas stays mounted. This scene only binds on "/".
 */
export function IndexPlanes() {
  const pathname = usePathname();
  const [targets, setTargets] = useState<PlaneTarget[]>([]);

  useLayoutEffect(() => {
    const onIndex = normalizePath(pathname) === "/";
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!onIndex) {
      document.documentElement.classList.remove(GL_FIELD_CLASS);
      setTargets([]);
      return;
    }

    // Fade the DOM frames once the field planes are active.
    if (!reduce) {
      document.documentElement.classList.add(GL_FIELD_CLASS);
    } else {
      document.documentElement.classList.remove(GL_FIELD_CLASS);
    }

    const sameTargets = (current: PlaneTarget[], next: PlaneTarget[]) => {
      if (current.length !== next.length) {
        return false;
      }

      return current.every((item, index) => {
        const other = next[index];
        return (
          other !== undefined &&
          item.slug === other.slug &&
          item.color === other.color &&
          item.depth === other.depth &&
          item.element === other.element
        );
      });
    };

    const read = () => {
      const next: PlaneTarget[] = [];
      let index = 0;

      for (const project of projects) {
        if (!project.slug || !project.theme) {
          continue;
        }

        const element = document.querySelector<HTMLElement>(
          `[data-gl-plane="${project.slug}"]`,
        );

        if (!element) {
          continue;
        }

        next.push({
          slug: project.slug,
          color: project.theme.background,
          depth: reduce ? 0 : planeDepthForIndex(index),
          element,
        });
        index += 1;
      }

      setTargets((current) => (sameTargets(current, next) ? current : next));
    };

    read();

    const field = document.querySelector("[data-index-field]");
    const observer = new MutationObserver(read);

    if (field) {
      observer.observe(field, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove(GL_FIELD_CLASS);
    };
  }, [pathname]);

  return (
    <>
      {targets.map((target) => (
        <BoundPlane
          key={target.slug}
          element={target.element}
          color={target.color}
          depth={target.depth}
        />
      ))}
    </>
  );
}
