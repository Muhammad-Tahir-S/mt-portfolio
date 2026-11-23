// Uniforms this file reads: u_progress, u_enableBend, u_bendAmount.
// u_enableBend is 0 under 768px and when reduced motion is on.
// The curve lifts the top edge on Y and brings it toward the camera on Z.

vec3 peelPosition(vec3 position, vec2 uv) {
  float amount = u_enableBend * u_progress * u_bendAmount;
  float curve = uv.y * uv.y;
  position.y += curve * amount * 0.015;
  position.z += curve * amount * 16.0;
  return position;
}
