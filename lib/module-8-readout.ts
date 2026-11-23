export type Module8Motion = "idle" | "rest" | "view" | "hover" | "reduced";

export type Module8Sample = {
  ready: boolean;
  slug: string;
  bytes: number;
  budget: number;
  codec: string;
  motion: Module8Motion;
  yaw: number;
  loadMs: number;
  frameMs: number;
  addedMs: number;
};

const idle: Module8Sample = {
  ready: false,
  slug: "",
  bytes: 0,
  budget: 0,
  codec: "meshopt + ktx2",
  motion: "idle",
  yaw: 0,
  loadMs: 0,
  frameMs: 0,
  addedMs: 0,
};

let committed: Module8Sample = idle;

type Module8Api = {
  sample: Module8Sample;
};

type Module8Window = Window & {
  __module8?: Module8Api;
};

const api: Module8Api = {
  sample: committed,
};

function publish() {
  api.sample = committed;

  if (typeof window === "undefined") {
    return;
  }

  if (process.env.NODE_ENV !== "development") {
    return;
  }

  (window as Module8Window).__module8 = api;
}

export function readModule8Sample() {
  return committed;
}

export function publishModule8Sample(sample: Module8Sample) {
  committed = sample;
  publish();
}

export function resetModule8Sample() {
  committed = idle;
  publish();
}
