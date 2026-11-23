import coverSource from "./cover.glsl";
import peelSource from "./peel.glsl";
import revealSource from "./reveal.glsl";

function glslSource(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (
    value &&
    typeof value === "object" &&
    "default" in value &&
    typeof value.default === "string"
  ) {
    return value.default;
  }

  return "";
}

const cover = glslSource(coverSource);
const peel = glslSource(peelSource);
const reveal = glslSource(revealSource);

export const planeVertexShader = `
uniform float u_progress;
uniform float u_enableBend;
uniform float u_bendAmount;
varying vec2 v_uv;
${peel}
void main() {
  v_uv = uv;
  vec3 peeled = peelPosition(position, uv);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(peeled, 1.0);
}
`;

export const planeFragmentShader = `
uniform sampler2D u_map;
uniform vec2 u_meshSize;
uniform vec2 u_imageSize;
uniform float u_progress;
uniform float u_innerX;
uniform float u_innerY;
uniform float u_innerScale;
varying vec2 v_uv;
${cover}
${reveal}
void main() {
  vec2 mapped = coverUv(innerUv(v_uv, u_innerX, u_innerY, u_innerScale), u_meshSize, u_imageSize);
  vec3 color = texture2D(u_map, clamp(mapped, 0.0, 1.0)).rgb;
  float mask = revealMask(v_uv, u_progress);
  if (mask < 0.02) discard;
  gl_FragColor = vec4(color, mask);
}
`;
