// Uniform this file reads: u_matcap.
// viewNormal is the normal after normalMatrix. That matrix puts the normal in view space.
// The highlight stays with the camera. A model-space normal would spin the highlight with the mesh.

vec3 matcapColor(vec3 viewNormal) {
  vec3 normal = normalize(viewNormal);
  vec2 uv = vec2(normal.x * 0.5 + 0.5, 0.5 - normal.y * 0.5);
  return texture2D(u_matcap, uv).rgb;
}
