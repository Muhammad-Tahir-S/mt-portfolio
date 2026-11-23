"use client";

import { useEffect, useState } from "react";
import { cameraPathKeyframes, planeDepthForIndex } from "@/lib/camera-path";
import {
  readModule6Sample,
  type Module6Sample,
} from "@/lib/module-6-readout";
import styles from "./module-6-check.module.css";

const depths = [0, 1, 2, 3].map((index) => planeDepthForIndex(index));

function format(value: number) {
  return value.toFixed(2);
}

function poseLabel(progress: number) {
  const span = Math.max(cameraPathKeyframes.length - 1, 1);
  const scaled = progress * span;
  const from = Math.min(Math.floor(scaled + 1e-6), span - 1);
  const blend = Math.min(Math.max(scaled - from, 0), 1);

  return {
    from,
    to: from + 1,
    blend,
  };
}

/**
 * Temporary study aid for Module 6.
 * Delete this component when Module 7 starts.
 */
export function Module6Check() {
  const [sample, setSample] = useState<Module6Sample>(readModule6Sample());

  useEffect(() => {
    let frame = 0;

    const tick = () => {
      setSample({ ...readModule6Sample() });
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  if (!sample.ready) {
    return null;
  }

  const pose = poseLabel(sample.progress);
  const routeLabel =
    sample.route === "off-index"
      ? "off index"
      : sample.route === "reduced"
        ? "reduced motion"
        : "index";

  return (
    <aside className={styles.panel} data-module-check="6" aria-hidden="true">
      <p className={styles.title}>Module 6 · camera path</p>
      <div className={styles.track}>
        <span style={{ width: `${sample.progress * 100}%` }} />
      </div>
      <p>
        target {format(sample.target)} · progress {format(sample.progress)} ·{" "}
        {sample.mode}
      </p>
      <p>
        camera {format(sample.x)}, {format(sample.y)}, {format(sample.z)}
      </p>
      <p>
        look {format(sample.lookX)}, {format(sample.lookY)} · fov{" "}
        {sample.fov.toFixed(1)}°
      </p>
      <p>
        pose {pose.from} → {pose.to} · blend {format(pose.blend)} · {routeLabel}
      </p>
      <p className={styles.quiet}>plane z {depths.join(", ")}</p>
    </aside>
  );
}
