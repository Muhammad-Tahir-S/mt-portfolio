import matcapSource from "./matcap.glsl";

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

const matcap = glslSource(matcapSource);

export const matcapVertexShader = `
varying vec3 v_viewNormal;
void main() {
  v_viewNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const matcapFragmentShader = `
uniform sampler2D u_matcap;
varying vec3 v_viewNormal;
${matcap}
void main() {
  vec3 color = matcapColor(v_viewNormal);
  gl_FragColor = vec4(color, 1.0);
}
`;
