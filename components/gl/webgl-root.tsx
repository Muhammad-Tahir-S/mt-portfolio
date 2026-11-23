"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import styles from "./webgl-root.module.css";
import { IndexPlanes } from "./index-planes";
import { Module7Frame } from "./module-7-frame";
import { PageCamera } from "./page-camera";
import { Ticker } from "./ticker";

/**
 * One canvas for the whole site.
 * It stays mounted. pointer-events stay off so DOM links keep the click.
 * Mount only after hydration. WebGL needs a browser.
 */
export function WebGLRoot() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <div className={styles.root} aria-hidden="true">
      <Canvas
        frameloop="never"
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: false,
          stencil: false,
          powerPreference: "high-performance",
        }}
        camera={{
          position: [0, 0, 1500],
          near: 1,
          far: 4000,
          fov: 50,
        }}
      >
        <Module7Frame />
        <PageCamera />
        <Ticker />
        <IndexPlanes />
      </Canvas>
    </div>
  );
}
