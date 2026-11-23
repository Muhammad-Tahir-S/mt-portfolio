import { CAMERA_DISTANCE } from "@/lib/camera";

export type CameraPose = {
  x: number;
  y: number;
  z: number;
  lookX: number;
  lookY: number;
};

/** Rest pose. Matches the Module 5 page camera. */
export const cameraPathStart: CameraPose = {
  x: 0,
  y: 0,
  z: CAMERA_DISTANCE,
  lookX: 0,
  lookY: 0,
};

/**
 * Authored path for the index field.
 * Progress 0 is the start. Progress 1 is the end.
 * The path does not loop.
 */
export const cameraPathKeyframes: readonly CameraPose[] = [
  cameraPathStart,
  {
    x: 56,
    y: 28,
    z: CAMERA_DISTANCE - 90,
    lookX: 24,
    lookY: -36,
  },
  {
    x: -44,
    y: -32,
    z: CAMERA_DISTANCE - 150,
    lookX: -16,
    lookY: -72,
  },
  {
    x: 20,
    y: -48,
    z: CAMERA_DISTANCE - 70,
    lookX: 0,
    lookY: -28,
  },
];

/** Shallow depth for a plane. Keeps the field readable. */
export function planeDepthForIndex(index: number) {
  const pattern = [0, -28, -56, -36] as const;
  return pattern[index % pattern.length] ?? 0;
}
