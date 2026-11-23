"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";

/**
 * Drive R3F from the GSAP ticker.
 * Scroll, DOM motion, and the canvas share one clock.
 */
export function Ticker() {
  const advance = useThree((state) => state.advance);

  useEffect(() => {
    const onTick = () => {
      // GSAP ticker time is in seconds. R3F advance wants a clock in ms.
      advance(performance.now());
    };

    gsap.ticker.add(onTick);

    return () => {
      gsap.ticker.remove(onTick);
    };
  }, [advance]);

  return null;
}
