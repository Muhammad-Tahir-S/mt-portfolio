export type ScrollSnapshot = {
  position: number;
  velocity: number;
};

let snapshot: ScrollSnapshot = { position: 0, velocity: 0 };
let paused = false;
let mover: ((position: number) => void) | null = null;
let adopter: (() => void) | null = null;

export function readScroll() {
  return snapshot;
}

export function writeScroll(next: ScrollSnapshot) {
  snapshot = next;
}

export function pauseScroll() {
  paused = true;
}

export function scrollIsPaused() {
  return paused;
}

export function bindScrollMove(next: (position: number) => void) {
  mover = next;
  return () => {
    if (mover === next) {
      mover = null;
    }
  };
}

export function bindScrollAdopt(next: () => void) {
  adopter = next;
  return () => {
    if (adopter === next) {
      adopter = null;
    }
  };
}

export function adoptNativeScroll() {
  adopter?.();
  paused = false;
}

export function moveScroll(position: number, resume = true) {
  if (resume) {
    paused = false;
  }
  if (mover) {
    mover(position);
    return;
  }
  window.scrollTo(0, position);
}
