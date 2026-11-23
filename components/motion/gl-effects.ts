import gsap from "gsap";

export type ShadeState = {
  reveal: number;
  innerX: number;
  innerY: number;
  innerScale: number;
  bendRequest: number;
};

type ShadeTimeline = gsap.core.Timeline & {
  webglReveal: (
    target: ShadeState,
    vars?: { duration?: number },
    position?: number,
  ) => ShadeTimeline;
  webglParallax: (
    target: ShadeState,
    vars?: { duration?: number },
    position?: number,
  ) => ShadeTimeline;
  webglPeel: (
    target: ShadeState,
    vars?: { enableBend?: boolean },
    position?: number,
  ) => ShadeTimeline;
};

let registered = false;

export function registerGlEffects() {
  if (registered) {
    return;
  }

  registered = true;

  gsap.registerEffect({
    name: "webglReveal",
    effect: (targets: ShadeState[], config: { duration: number }) => {
      const state = targets[0];

      if (!state) {
        return gsap.to({}, {});
      }

      return gsap.fromTo(
        state,
        { reveal: 0 },
        { reveal: 1, duration: config.duration, ease: "none" },
      );
    },
    defaults: { duration: 1.15 },
    extendTimeline: true,
  });

  gsap.registerEffect({
    name: "webglParallax",
    effect: (targets: ShadeState[], config: { duration: number }) => {
      const state = targets[0];

      if (!state) {
        return gsap.to({}, {});
      }

      return gsap.fromTo(
        state,
        { innerX: 0, innerY: -0.2, innerScale: 1.2 },
        {
          innerX: 0,
          innerY: 0,
          innerScale: 1,
          duration: config.duration,
          ease: "none",
        },
      );
    },
    defaults: { duration: 1.15 },
    extendTimeline: true,
  });

  gsap.registerEffect({
    name: "webglPeel",
    effect: (targets: ShadeState[], config: { enableBend: boolean }) => {
      const state = targets[0];

      if (!state) {
        return gsap.to({}, {});
      }

      const next = config.enableBend ? 1 : 0;

      return gsap.fromTo(
        state,
        { bendRequest: 0 },
        { bendRequest: next, duration: 0.01, ease: "none" },
      );
    },
    defaults: { enableBend: true },
    extendTimeline: true,
  });
}

export function createShadeTimeline(state: ShadeState) {
  registerGlEffects();

  const timeline = gsap.timeline({ paused: true }) as ShadeTimeline;
  timeline.webglPeel(state, { enableBend: true }, 0);
  timeline.webglReveal(state, { duration: 1.15 }, 0);
  timeline.webglParallax(state, { duration: 1.15 }, 0);
  timeline.progress(0);

  return timeline;
}
