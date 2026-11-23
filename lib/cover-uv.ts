/**
 * object-fit: cover for a texture on a plane.
 * The image keeps its aspect. The plane crops the overflow.
 */
export function coverUv(
  imageWidth: number,
  imageHeight: number,
  planeWidth: number,
  planeHeight: number,
) {
  if (
    imageWidth <= 0 ||
    imageHeight <= 0 ||
    planeWidth <= 0 ||
    planeHeight <= 0
  ) {
    return { offset: { x: 0, y: 0 }, repeat: { x: 1, y: 1 } };
  }

  const imageAspect = imageWidth / imageHeight;
  const planeAspect = planeWidth / planeHeight;

  if (imageAspect > planeAspect) {
    const repeatX = planeAspect / imageAspect;
    return {
      offset: { x: (1 - repeatX) / 2, y: 0 },
      repeat: { x: repeatX, y: 1 },
    };
  }

  const repeatY = imageAspect / planeAspect;
  return {
    offset: { x: 0, y: (1 - repeatY) / 2 },
    repeat: { x: 1, y: repeatY },
  };
}
