export type Module7Reason = "wide" | "narrow" | "reduced" | "idle";

export type Module7Source = "timeline" | "slider";

export type Module7Sample = {
  ready: boolean;
  slug: string;
  progress: number;
  innerY: number;
  innerScale: number;
  bend: number;
  reason: Module7Reason;
  source: Module7Source;
  width: number;
  meshW: number;
  meshH: number;
  imageW: number;
  imageH: number;
  distance: number;
};

type Module7Control = {
  override: number | null;
  replay: number;
};

const idle: Module7Sample = {
  ready: false,
  slug: "",
  progress: 0,
  innerY: 0,
  innerScale: 1,
  bend: 0,
  reason: "idle",
  source: "timeline",
  width: 0,
  meshW: 0,
  meshH: 0,
  imageW: 0,
  imageH: 0,
  distance: Number.POSITIVE_INFINITY,
};

const control: Module7Control = {
  override: null,
  replay: 0,
};

let frame = 0;
let pending: Module7Sample | null = null;
let committed: Module7Sample = idle;

type Module7Api = {
  sample: Module7Sample;
  setProgress: (value: number | null) => void;
  replay: () => void;
};

type Module7Window = Window & {
  __module7?: Module7Api;
};

const api: Module7Api = {
  sample: committed,
  setProgress(value) {
    control.override = value;
  },
  replay() {
    replayModule7();
  },
};

function publish() {
  api.sample = committed;

  if (typeof window === "undefined") {
    return;
  }

  if (process.env.NODE_ENV !== "development") {
    return;
  }

  (window as Module7Window).__module7 = api;
}

export function readModule7Sample() {
  return committed;
}

export function readModule7Control() {
  return control;
}

export function setModule7Progress(value: number | null) {
  control.override = value;
}

export function replayModule7() {
  control.override = null;
  control.replay += 1;
}

export function beginModule7Frame() {
  if (frame > 0) {
    committed = pending ?? idle;
  }

  pending = null;
  frame += 1;
  publish();
}

export function offerModule7Sample(sample: Module7Sample) {
  if (!pending || sample.distance < pending.distance) {
    pending = sample;
  }
}
