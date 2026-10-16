"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  bindScrollAdopt,
  bindScrollMove,
  scrollIsPaused,
  writeScroll,
} from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

export function ScrollRoot() {
  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      const writeNativeScroll = () => {
        writeScroll({ position: window.scrollY, velocity: 0 });
      };
      const unbind = bindScrollMove((position) => {
        window.scrollTo(0, position);
      });

      writeNativeScroll();
      window.addEventListener("scroll", writeNativeScroll, { passive: true });

      return () => {
        unbind();
        window.removeEventListener("scroll", writeNativeScroll);
      };
    }

    const lenis = new Lenis({ autoRaf: false });
    const unbind = bindScrollMove((position) => {
      lenis.scrollTo(position, { immediate: true });
    });
    const unbindAdopt = bindScrollAdopt(() => {
      lenis.resize();
    });

    const onLenisScroll = (instance: Lenis) => {
      writeScroll({
        position: instance.scroll,
        velocity: instance.velocity,
      });
      ScrollTrigger.update();
    };

    lenis.on("scroll", onLenisScroll);
    lenis.scrollTo(window.scrollY, { immediate: true });
    writeScroll({ position: lenis.scroll, velocity: lenis.velocity });

    const onTick = (time: number) => {
      if (scrollIsPaused()) {
        return;
      }
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      unbind();
      unbindAdopt();
      lenis.off("scroll", onLenisScroll);
      gsap.ticker.remove(onTick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
