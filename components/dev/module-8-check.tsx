"use client";

import { useEffect, useState } from "react";
import {
  readModule8Sample,
  type Module8Sample,
} from "@/lib/module-8-readout";
import styles from "./module-8-check.module.css";

function formatMs(value: number) {
  return value.toFixed(2);
}

function formatKb(bytes: number) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

/**
 * Temporary study aid for Module 8.
 * Delete this component when Module 9 starts.
 */
export function Module8Check() {
  const [sample, setSample] = useState<Module8Sample>(readModule8Sample());

  useEffect(() => {
    let frame = 0;

    const tick = () => {
      const next = readModule8Sample();

      setSample((current) => {
        if (
          current.ready === next.ready &&
          current.motion === next.motion &&
          current.bytes === next.bytes &&
          current.yaw.toFixed(2) === next.yaw.toFixed(2) &&
          current.addedMs.toFixed(2) === next.addedMs.toFixed(2)
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

  return (
    <aside className={styles.panel} data-module-check="8">
      <p className={styles.title}>Module 8 · model</p>
      {sample.ready ? (
        <>
          <p>
            {sample.slug} · {sample.codec}
          </p>
          <p>
            file {formatKb(sample.bytes)} · budget {formatKb(sample.budget)}
          </p>
          <p>
            motion {sample.motion} · yaw {sample.yaw.toFixed(2)}
          </p>
          <p>
            load {formatMs(sample.loadMs)} ms · frame {formatMs(sample.frameMs)}{" "}
            ms
          </p>
          <p className={styles.quiet}>
            added {formatMs(sample.addedMs)} ms when the model entered
          </p>
        </>
      ) : (
        <p>The study model is idle on this route.</p>
      )}
    </aside>
  );
}
