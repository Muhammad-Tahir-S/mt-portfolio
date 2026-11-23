// Uniform this file reads: u_progress.
// 0 hides the plane. 1 shows the whole plane. The wipe moves up.

float revealMask(vec2 uv, float progress) {
  float edge = 0.08;
  float head = progress * (1.0 + edge);
  return 1.0 - smoothstep(head - edge, head, uv.y);
}
