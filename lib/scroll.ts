export type ScrollSnapshot = {
  position: number;
  velocity: number;
};

let snapshot: ScrollSnapshot = { position: 0, velocity: 0 };

export function readScroll() {
  return snapshot;
}

export function writeScroll(next: ScrollSnapshot) {
  snapshot = next;
}
