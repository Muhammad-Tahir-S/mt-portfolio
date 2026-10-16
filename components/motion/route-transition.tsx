"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import {
  normalizePath,
  projects,
  slugFromPath,
  themeForPath,
  themeInk,
  type Theme,
} from "@/content/projects";
import { adoptNativeScroll, moveScroll, pauseScroll } from "@/lib/scroll";

type Pair = "toProject" | "projectToProject";

let routerRef: ReturnType<typeof useRouter> | null = null;
let releaseView: (() => void) | null = null;
let popId = 0;
let seenPopId = 0;

function studySlug(pathname: string) {
  const slug = slugFromPath(pathname);
  if (!slug) {
    return null;
  }
  const project = projects.find((item) => item.slug === slug && item.study);
  return project?.slug ?? null;
}

function pairName(from: string, to: string): Pair | null {
  const fromPath = normalizePath(from);
  const toSlug = studySlug(to);
  const fromSlug = studySlug(fromPath);
  if (fromSlug && toSlug && fromSlug !== toSlug) {
    return "projectToProject";
  }
  if (!fromSlug && toSlug && fromPath === "/work") {
    return "toProject";
  }
  return null;
}

function prefersReduce() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function canViewTransition() {
  return typeof document.startViewTransition === "function";
}

function namePair(pair: Pair | null) {
  if (pair) {
    document.documentElement.dataset.transition = pair;
    return;
  }
  delete document.documentElement.dataset.transition;
}

export function go(href: string) {
  const navigate = () => {
    routerRef?.push(href);
  };

  if (!routerRef) {
    return;
  }

  if (prefersReduce() || !canViewTransition()) {
    navigate();
    return;
  }

  namePair(pairName(window.location.pathname, href));

  // router.push can commit before this function returns. The layout effect
  // has to release the photograph during that commit, so the release exists first.
  let settled = false;
  let finish = () => {};
  const pending = new Promise<void>((resolve) => {
    finish = () => {
      if (settled) {
        return;
      }
      settled = true;
      if (releaseView === finish) {
        releaseView = null;
      }
      resolve();
    };
    releaseView = finish;
    window.setTimeout(finish, 2000);
  });

  try {
    const transition = document.startViewTransition(() => {
      navigate();
      return pending;
    });
    // ready and finished both reject when a second move interrupts this one.
    transition.ready.catch(() => {});
    transition.finished.catch(() => {});
  } catch {
    releaseView = null;
    finish();
    navigate();
  }
}

function visibleHeading() {
  for (const main of document.querySelectorAll("main")) {
    if (!(main instanceof HTMLElement)) {
      continue;
    }
    if (main.hidden || getComputedStyle(main).display === "none") {
      continue;
    }
    const heading = main.querySelector("h1");
    if (heading instanceof HTMLElement) {
      return heading;
    }
  }
  return null;
}

function placeTitleName(heading: HTMLElement | null) {
  document.querySelectorAll("h1, h2").forEach((node) => {
    if (node instanceof HTMLElement) {
      node.style.viewTransitionName = "";
    }
  });
  if (!heading || !canViewTransition()) {
    return;
  }
  // One name. The hidden page must not keep a second copy.
  heading.style.viewTransitionName = "project-title";
}

function playTheme(theme: Theme, revealTitle: boolean, heading: HTMLElement | null) {
  const color = themeInk(theme);
  gsap.killTweensOf([document.body, document.documentElement]);

  if (prefersReduce()) {
    gsap.set(document.body, { backgroundColor: theme.background, color });
    gsap.set(document.documentElement, { backgroundColor: theme.background });
    return;
  }

  const timeline = gsap.timeline({ defaults: { overwrite: "auto" } });
  timeline.to(
    document.body,
    {
      backgroundColor: theme.background,
      color,
      duration: 0.7,
      ease: "power2.inOut",
    },
    0,
  );
  timeline.to(
    document.documentElement,
    {
      backgroundColor: theme.background,
      duration: 0.7,
      ease: "power2.inOut",
    },
    0,
  );

  if (!revealTitle || !heading) {
    return;
  }

  gsap.killTweensOf(heading);
  timeline.fromTo(
    heading,
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power2.inOut",
      clearProps: "transform",
    },
    0,
  );
}

function adoptHistoryScroll() {
  const started = window.scrollY;
  let done = false;
  const finish = () => {
    if (done) {
      return;
    }
    done = true;
    window.removeEventListener("scroll", onScroll);
    // popstate runs before the browser restores the old position.
    adoptNativeScroll();
  };
  const onScroll = () => {
    if (window.scrollY === started) {
      return;
    }
    finish();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.setTimeout(finish, 120);
}

export function RouteTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const previous = useRef<string | null>(null);

  useLayoutEffect(() => {
    routerRef = router;
  }, [router]);

  useLayoutEffect(() => {
    const onPop = () => {
      popId += 1;
      // Hold Lenis so its next frame does not wipe the restored position.
      pauseScroll();
      // Repay that hold here. A hash or a query can pop without a new pathname.
      adoptHistoryScroll();
      const nextPath = normalizePath(window.location.pathname);
      const current = previous.current;
      if (current !== null && normalizePath(current) === nextPath) {
        seenPopId = popId;
      }
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  useLayoutEffect(() => {
    const from = previous.current;
    previous.current = pathname;
    const theme = themeForPath(pathname);

    if (from === null || from === pathname) {
      if (from === null) {
        gsap.set(document.body, {
          backgroundColor: theme.background,
          color: themeInk(theme),
        });
        gsap.set(document.documentElement, {
          backgroundColor: theme.background,
        });
      }
      return;
    }

    namePair(pairName(from, pathname));

    const historyMove = popId !== seenPopId;
    if (historyMove) {
      seenPopId = popId;
    }

    const heading = visibleHeading();
    const revealTitle = !prefersReduce() && !canViewTransition();
    playTheme(theme, revealTitle, heading);

    if (heading) {
      heading.tabIndex = -1;
      // A plain focus() scrolls, and Lenis fights that scroll.
      heading.focus({ preventScroll: true });
    }

    if (!historyMove) {
      moveScroll(0);
    }

    placeTitleName(heading);

    const release = releaseView;
    releaseView = null;
    release?.();
  }, [pathname]);

  return null;
}
