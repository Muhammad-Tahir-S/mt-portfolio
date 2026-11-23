"use client";

import { useEffect, useState } from "react";
import {
  readModule7Sample,
  replayModule7,
  setModule7Progress,
  type Module7Sample,
} from "@/lib/module-7-readout";
import styles from "./module-7-check.module.css";

function format(value: number) {
  return value.toFixed(2);
}

/**
 * Temporary study aid for Module 7.
 * Delete this component when Module 8 starts.
 */
export function Module7Check() {
  const [sample, setSample] = useState<Module7Sample>(readModule7Sample());

  useEffect(() => {
    let frame = 0;

    const tick = () => {
      const next = readModule7Sample();

      setSample((current) => {
        if (
          current.ready === next.ready &&
          current.slug === next.slug &&
          current.reason === next.reason &&
          current.source === next.source &&
          current.progress.toFixed(2) === next.progress.toFixed(2) &&
          current.innerScale.toFixed(2) === next.innerScale.toFixed(2) &&
          current.bend === next.bend
        ) {
          return current;
        }

        return { ...next };
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  const peel =
    sample.reason === "wide" ? "peel on" : `peel off · ${sample.reason}`;

  return (
    <aside className={styles.panel} data-module-check="7">
      <p className={styles.title}>Module 7 · shaders</p>
      <div className={styles.track}>
        <span style={{ width: `${sample.progress * 100}%` }} />
      </div>
      {sample.ready ? (
        <>
          <p>
            u_progress {format(sample.progress)} · {sample.source}
          </p>
          <p>{sample.slug}</p>
          <p>
            inner y {format(sample.innerY)} · scale {format(sample.innerScale)}
          </p>
          <p>
            {peel} · viewport {Math.round(sample.width)}
          </p>
          <p className={styles.quiet}>
            cover {Math.round(sample.imageW)}×{Math.round(sample.imageH)} in{" "}
            {Math.round(sample.meshW)}×{Math.round(sample.meshH)}
          </p>
          <p className={styles.quiet}>Scroll does not move u_progress.</p>
        </>
      ) : (
        <p>Index planes are idle on this route.</p>
      )}
      <label className={styles.control}>
        u_progress
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={sample.progress}
          onChange={(event) => {
            setModule7Progress(Number(event.target.value));
          }}
        />
      </label>
      <button type="button" className={styles.replay} onClick={replayModule7}>
        Replay
      </button>
    </aside>
  );
}
