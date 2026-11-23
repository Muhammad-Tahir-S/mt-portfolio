import { CanvasTexture, LinearSRGBColorSpace } from "three";

/**
 * Square stand-in still until a real project image ships.
 * The frame is 16:9. Cover crops this square. A stretch would oval the circle.
 */
export function createThemeTexture(color: string) {
  const width = 1024;
  const height = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = LinearSRGBColorSpace;
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

  context.lineWidth = 22;
  context.strokeStyle = "#ffffff";
  context.beginPath();
  context.arc(width / 2, height / 2, width * 0.18, 0, Math.PI * 2);
  context.stroke();
  context.lineWidth = 8;
  context.strokeStyle = "#000000";
  context.stroke();

  context.strokeStyle = "rgba(0,0,0,0.55)";
  context.lineWidth = 8;
  const tick = 72;
  context.strokeRect(36, 36, tick, 8);
  context.strokeRect(width - 36 - tick, 36, tick, 8);
  context.strokeRect(36, height - 44, tick, 8);
  context.strokeRect(width - 36 - tick, height - 44, tick, 8);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = LinearSRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
