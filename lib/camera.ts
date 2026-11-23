import {
  Plane,
  Quaternion,
  Raycaster,
  Vector2,
  Vector3,
  type Camera,
} from "three";

/** Distance from the camera to the page plane, in world units. */
export const CAMERA_DISTANCE = 1500;

/**
 * Field of view so one CSS pixel equals one world unit at z = 0.
 * The camera sits at z = CAMERA_DISTANCE and looks at the origin.
 */
export function fieldOfViewForHeight(viewportHeight: number) {
  if (viewportHeight <= 0) {
    return 1;
  }

  return (
    ((2 * Math.atan(viewportHeight / 2 / CAMERA_DISTANCE)) * 180) / Math.PI
  );
}

/**
 * Map a DOM box into the page plane when the camera is at rest.
 * X grows right. Y grows up. The origin sits at the centre of the viewport.
 */
export function rectToPlane(
  rect: DOMRectReadOnly,
  viewport: {
    width: number;
    height: number;
  },
) {
  return {
    x: rect.left + rect.width / 2 - viewport.width / 2,
    y: -(rect.top + rect.height / 2 - viewport.height / 2),
    width: Math.max(rect.width, 1),
    height: Math.max(rect.height, 1),
  };
}

const ndc = new Vector2();
const hit = new Vector3();
const leftHit = new Vector3();
const rightHit = new Vector3();
const topHit = new Vector3();
const bottomHit = new Vector3();
const viewDirection = new Vector3();
const planePoint = new Vector3();
const xAxis = new Vector3();
const yAxis = new Vector3();
const edge = new Vector3();
const bindQuaternion = new Quaternion();
const raycaster = new Raycaster();
const bindPlane = new Plane();

function clientToNdc(
  clientX: number,
  clientY: number,
  viewport: { width: number; height: number },
) {
  ndc.set(
    (clientX / viewport.width) * 2 - 1,
    -(clientY / viewport.height) * 2 + 1,
  );
  return ndc;
}

function intersectClient(
  clientX: number,
  clientY: number,
  camera: Camera,
  viewport: { width: number; height: number },
  target: Vector3,
) {
  raycaster.setFromCamera(clientToNdc(clientX, clientY, viewport), camera);
  const point = raycaster.ray.intersectPlane(bindPlane, target);
  return point !== null;
}

export type PlaneBind = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  quaternion: Quaternion;
};

/**
 * Map a DOM box onto a plane that faces the camera.
 * depth moves that plane along the view. The quad still covers the box.
 * Returns null when a ray misses, so the caller can keep the last good pose.
 */
export function rectToWorldOnPlane(
  rect: DOMRectReadOnly,
  camera: Camera,
  depth: number,
  viewport: { width: number; height: number },
): PlaneBind | null {
  camera.getWorldDirection(viewDirection);
  const distance = Math.max(CAMERA_DISTANCE + depth, 200);
  planePoint.copy(camera.position).addScaledVector(viewDirection, distance);
  bindPlane.setFromNormalAndCoplanarPoint(viewDirection, planePoint);

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const okCenter = intersectClient(centerX, centerY, camera, viewport, hit);
  const okLeft = intersectClient(rect.left, centerY, camera, viewport, leftHit);
  const okRight = intersectClient(
    rect.right,
    centerY,
    camera,
    viewport,
    rightHit,
  );
  const okTop = intersectClient(centerX, rect.top, camera, viewport, topHit);
  const okBottom = intersectClient(
    centerX,
    rect.bottom,
    camera,
    viewport,
    bottomHit,
  );

  if (!okCenter || !okLeft || !okRight || !okTop || !okBottom) {
    return null;
  }

  camera.getWorldQuaternion(bindQuaternion);
  xAxis.set(1, 0, 0).applyQuaternion(bindQuaternion);
  yAxis.set(0, 1, 0).applyQuaternion(bindQuaternion);

  return {
    x: hit.x,
    y: hit.y,
    z: hit.z,
    width: Math.max(Math.abs(edge.copy(rightHit).sub(leftHit).dot(xAxis)), 1),
    height: Math.max(Math.abs(edge.copy(topHit).sub(bottomHit).dot(yAxis)), 1),
    quaternion: bindQuaternion,
  };
}
