"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { DoubleSide, type Mesh } from "three";
import { rectToWorldOnPlane } from "@/lib/camera";
import { coverUv } from "@/lib/cover-uv";
import { createThemeTexture } from "@/lib/theme-texture";

type BoundPlaneProps = {
  element: HTMLElement;
  color: string;
  depth?: number;
};

/**
 * One plane locked to one DOM box through the live camera.
 * Runs after PageCamera so the bind uses the current pose.
 */
export function BoundPlane({ element, color, depth = 0 }: BoundPlaneProps) {
  const meshRef = useRef<Mesh>(null);
  const placed = useRef(false);
  const camera = useThree((state) => state.camera);
  const texture = useMemo(() => createThemeTexture(color), [color]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  useFrame(() => {
    const mesh = meshRef.current;

    if (!mesh) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
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

    const image = texture.image as { width: number; height: number };
    const cover = coverUv(
      image.width,
      image.height,
      plane.width,
      plane.height,
    );
    texture.offset.set(cover.offset.x, cover.offset.y);
    texture.repeat.set(cover.repeat.x, cover.repeat.y);
  }, 1);

  return (
    <mesh ref={meshRef} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color={color}
        map={texture}
        side={DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}
