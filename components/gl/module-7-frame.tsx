"use client";

import { useFrame } from "@react-three/fiber";
import { beginModule7Frame } from "@/lib/module-7-readout";

/**
 * Open a readout frame before the planes write their uniforms.
 */
export function Module7Frame() {
  useFrame(() => {
    beginModule7Frame();
  }, -2);

  return null;
}
