"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  DoubleSide,
  ShaderMaterial,
  Vector2,
  type Mesh,
} from "three";
import { rectToWorldOnPlane } from "@/lib/camera";
import { createThemeTexture } from "@/lib/theme-texture";
import {
  offerModule7Sample,
  readModule7Control,
} from "@/lib/module-7-readout";
import {
  createShadeTimeline,
  type ShadeState,
} from "@/components/motion/gl-effects";
import {
  planeFragmentShader,
  planeVertexShader,
} from "./shaders/plane-shader";

type BoundPlaneProps = {
  slug: string;
  element: HTMLElement;
  color: string;
  depth?: number;
};

const WIDE_QUERY = "(min-width: 768px)";
const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

function peelReason(width: number, reduce: boolean) {
  if (reduce) {
    return "reduced" as const;
  }

  if (width >= 768) {
    return "wide" as const;
  }

  return "narrow" as const;
}

/**
 * One plane locked to one DOM box through the live camera.
 * A GSAP timeline drives reveal, parallax, and peel.
 */
export function BoundPlane({
  slug,
  element,
  color,
  depth = 0,
}: BoundPlaneProps) {
  const meshRef = useRef<Mesh>(null);
  const placed = useRef(false);
  const played = useRef(false);
  const seenReplay = useRef(0);
  const timelineRef = useRef<ReturnType<typeof createShadeTimeline> | null>(
    null,
  );
  const camera = useThree((state) => state.camera);
  const texture = useMemo(() => createThemeTexture(color), [color]);
  const shade = useRef<ShadeState>({
    reveal: 0,
    innerX: 0,
    innerY: -0.2,
    innerScale: 1.2,
    bendRequest: 0,
  });
  const uniforms = useMemo(
    () => ({
      u_map: { value: texture },
      u_progress: { value: 0 },
      u_enableBend: { value: 0 },
      u_bendAmount: { value: 1 },
      u_meshSize: { value: new Vector2(1, 1) },
      u_imageSize: { value: new Vector2(1024, 1024) },
      u_innerX: { value: 0 },
      u_innerY: { value: -0.2 },
      u_innerScale: { value: 1.2 },
    }),
    [texture],
  );
  const material = useMemo(() => {
    return new ShaderMaterial({
      uniforms,
      vertexShader: planeVertexShader,
      fragmentShader: planeFragmentShader,
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
      toneMapped: false,
    });
  }, [uniforms]);

  useEffect(() => {
    return () => {
      material.dispose();
      texture.dispose();
    };
  }, [material, texture]);

  useLayoutEffect(() => {
    const timeline = createShadeTimeline(shade.current);
    timelineRef.current = timeline;

    if (window.matchMedia(REDUCE_QUERY).matches) {
      timeline.progress(1);
      played.current = true;
    }

    return () => {
      timeline.kill();
      timelineRef.current = null;
    };
  }, []);

  // Priority stays at 0. A higher priority stops the canvas render.
  useFrame(() => {
    const mesh = meshRef.current;
    const state = shade.current;
    const active = timelineRef.current;

    if (!mesh || !active) {
      return;
    }
    const rect = element.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const reduce = window.matchMedia(REDUCE_QUERY).matches;
    const wide = window.matchMedia(WIDE_QUERY).matches;
    const control = readModule7Control();

    if (control.replay !== seenReplay.current) {
      seenReplay.current = control.replay;

      if (control.override === null && !reduce) {
        active.pause(0);
        active.play();
        played.current = true;
      }
    }

    if (control.override !== null) {
      const value = Math.min(1, Math.max(0, control.override));
      active.pause();
      active.progress(value);
      state.reveal = value;
      state.innerX = 0;
      state.innerY = -0.2 * (1 - value);
      state.innerScale = 1 + 0.2 * (1 - value);
      state.bendRequest = value;
      played.current = true;
    } else if (reduce) {
      active.pause();
      active.progress(1);
      state.reveal = 1;
      state.innerY = 0;
      state.innerScale = 1;
      state.bendRequest = 0;
      played.current = true;
    }

    const allowPeel = wide && !reduce;
    uniforms.u_progress.value = state.reveal;
    uniforms.u_enableBend.value = allowPeel ? 1 : 0;
    uniforms.u_bendAmount.value = state.bendRequest;
    uniforms.u_innerX.value = state.innerX;
    uniforms.u_innerY.value = state.innerY;
    uniforms.u_innerScale.value = state.innerScale;

    const onScreen =
      rect.bottom > 0 &&
      rect.top < viewport.height &&
      rect.right > 0 &&
      rect.left < viewport.width &&
      rect.width > 1 &&
      rect.height > 1;

    mesh.visible = onScreen;

    if (!onScreen) {
      return;
    }

    const plane = rectToWorldOnPlane(rect, camera, depth, viewport);

    if (!plane) {
      if (!placed.current) {
        mesh.visible = false;
      }
      return;
    }

    placed.current = true;
    mesh.visible = true;
    mesh.position.set(plane.x, plane.y, plane.z);
    mesh.quaternion.copy(plane.quaternion);
    mesh.scale.set(plane.width, plane.height, 1);
    uniforms.u_meshSize.value.set(plane.width, plane.height);

    const image = texture.image as { width?: number; height?: number };
    uniforms.u_imageSize.value.set(image.width ?? 1024, image.height ?? 1024);

    const mid = rect.top + rect.height / 2;

    offerModule7Sample({
      ready: true,
      slug,
      progress: state.reveal,
      innerY: state.innerY,
      innerScale: state.innerScale,
      bend: uniforms.u_enableBend.value,
      reason: peelReason(viewport.width, reduce),
      source: control.override === null ? "timeline" : "slider",
      width: viewport.width,
      meshW: plane.width,
      meshH: plane.height,
      imageW: image.width ?? 1024,
      imageH: image.height ?? 1024,
      distance: Math.abs(mid - viewport.height / 2),
    });
  });

  return (
    <mesh ref={meshRef} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
