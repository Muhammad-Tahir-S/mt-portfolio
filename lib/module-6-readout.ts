export type Module6Route = "index" | "off-index" | "reduced";

export type Module6Mode = "damp" | "snap";

export type Module6Sample = {
  ready: boolean;
  target: number;
  progress: number;
  x: number;
  y: number;
  z: number;
  lookX: number;
  lookY: number;
  fov: number;
  mode: Module6Mode;
  route: Module6Route;
};

const sample: Module6Sample = {
  ready: false,
  target: 0,
  progress: 0,
  x: 0,
  y: 0,
  z: 0,
  lookX: 0,
  lookY: 0,
  fov: 0,
  mode: "damp",
  route: "index",
};

type Module6Window = Window & {
  __module6?: Module6Sample;
};

export function readModule6Sample() {
  return sample;
}

export function writeModule6Sample(next: Module6Sample) {
  Object.assign(sample, next);

  if (typeof window === "undefined") {
    return;
  }

  if (process.env.NODE_ENV !== "development") {
    return;
  }

  (window as Module6Window).__module6 = sample;
}
