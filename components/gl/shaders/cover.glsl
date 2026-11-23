// Uniforms this file reads: u_meshSize, u_imageSize, u_innerX, u_innerY, u_innerScale.
// The plane shader passes those values into these functions.

vec2 innerUv(vec2 uv, float innerX, float innerY, float innerScale) {
  vec2 centered = (uv - 0.5) / max(innerScale, 0.0001);
  return centered + 0.5 + vec2(innerX, innerY);
}

vec2 coverUv(vec2 uv, vec2 meshSize, vec2 imageSize) {
  float imageAspect = imageSize.x / max(imageSize.y, 0.0001);
  float meshAspect = meshSize.x / max(meshSize.y, 0.0001);
  vec2 scale = vec2(1.0);

  if (imageAspect > meshAspect) {
    scale.x = meshAspect / imageAspect;
  } else {
    scale.y = imageAspect / meshAspect;
  }

  return (uv - 0.5) * scale + 0.5;
}
