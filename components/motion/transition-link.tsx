"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { go } from "./route-transition";

type TransitionLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  nameTitle?: boolean;
};

function isPlainClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

export function TransitionLink({
  href,
  className,
  children,
  nameTitle = false,
}: TransitionLinkProps) {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!isPlainClick(event)) {
      return;
    }

    event.preventDefault();

    if (nameTitle && typeof document.startViewTransition === "function") {
      const title = event.currentTarget.closest("h2");
      if (title instanceof HTMLElement) {
        document.querySelectorAll("h1, h2").forEach((node) => {
          if (node instanceof HTMLElement) {
            node.style.viewTransitionName = "";
          }
        });
        title.style.viewTransitionName = "project-title";
      }
    }

    go(href);
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
