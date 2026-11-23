import { CanvasTexture, SRGBColorSpace } from "three";

/** 16:9 stand-in still until a real project image ships. */
export function createThemeTexture(color: string) {
  const width = 1024;
  const height = 576;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }

  context.fillStyle = color;
  context.fillRect(0, 0, width, height);

  // A quiet second wash so cover UVs have an edge to show.
  const wash = context.createLinearGradient(0, 0, width, height);
  wash.addColorStop(0, "rgba(255,255,255,0.08)");
  wash.addColorStop(1, "rgba(0,0,0,0.12)");
  context.fillStyle = wash;
  context.fillRect(0, 0, width, height);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
