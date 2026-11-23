"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { MathUtils, PerspectiveCamera } from "three";
import {
  cameraPathKeyframes,
  cameraPathStart,
  type CameraPose,
} from "@/lib/camera-path";
import { fieldOfViewForHeight } from "@/lib/camera";
import { normalizePath } from "@/content/projects";
import { writeModule6Sample } from "@/lib/module-6-readout";
import { readScroll } from "@/lib/scroll";

function scrollProgress() {
  const { position, limit } = readScroll();

  if (limit <= 0) {
    return 0;
  }

  return MathUtils.clamp(position / limit, 0, 1);
}

function prefersReduce() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Match FOV to the viewport, then scrub an authored path from scroll.
 * Damp keeps the move from snapping to every wheel tick.
 */
export function PageCamera() {
  const pathname = usePathname();
  const size = useThree((state) => state.size);
  const camera = useThree((state) => state.camera);
  const pose = useRef<CameraPose>({ ...cameraPathStart });
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const progressRef = useRef(0);

  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) {
      return;
    }

    camera.near = 1;
    camera.far = 4000;
    camera.fov = fieldOfViewForHeight(size.height);
    camera.aspect = size.width / Math.max(size.height, 1);
    camera.updateProjectionMatrix();
  }, [camera, size.height, size.width]);

  useLayoutEffect(() => {
    const target = pose.current;
    Object.assign(target, cameraPathStart);

    const timeline = gsap.timeline({ paused: true });
    const frames = cameraPathKeyframes;
    const segment = 1;

    for (let index = 1; index < frames.length; index += 1) {
      const frame = frames[index];

      if (!frame) {
        continue;
      }

      timeline.to(
        target,
        {
          ...frame,
          duration: segment,
          ease: "none",
        },
        (index - 1) * segment,
      );
    }

    timelineRef.current = timeline;
    timeline.progress(0);

    return () => {
      timeline.kill();
      timelineRef.current = null;
    };
  }, []);

  // Priority -1 runs before BoundPlane, so the bind sees this pose.
  useFrame((_, delta) => {
    if (!(camera instanceof PerspectiveCamera)) {
      return;
    }

    const timeline = timelineRef.current;

    if (!timeline) {
      return;
    }

    const onIndex = normalizePath(pathname) === "/";
    const target = onIndex ? scrollProgress() : 0;
    const reduce = prefersReduce();

    if (reduce || !onIndex) {
      progressRef.current = target;
    } else {
      progressRef.current = MathUtils.damp(
        progressRef.current,
        target,
        6,
        delta,
      );
    }

    timeline.progress(progressRef.current);

    const next = pose.current;
    camera.position.set(next.x, next.y, next.z);
    camera.lookAt(next.lookX, next.lookY, 0);
    camera.updateMatrixWorld();

    const mode = reduce || !onIndex ? "snap" : "damp";
    const route = !onIndex ? "off-index" : reduce ? "reduced" : "index";

    writeModule6Sample({
      ready: true,
      target,
      progress: progressRef.current,
      x: next.x,
      y: next.y,
      z: next.z,
      lookX: next.lookX,
      lookY: next.lookY,
      fov: camera.fov,
      mode,
      route,
    });
  }, -1);

  return null;
}
