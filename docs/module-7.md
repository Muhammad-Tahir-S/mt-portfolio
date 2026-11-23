# Module 7

The Module 7 readout was removed at the start of Module 8. The shaders remain on the index planes.



Aim. You can predict the picture from one number, `u_progress`.
This serves the site because the index stays one document. The shaders dress the planes. The HTML links stay the hit targets.

A fragment shader paints each pixel. A vertex shader moves each corner. A uniform is the input JavaScript sets. CSS custom properties are the cousin.

Three programs share the index planes:

- `cover.glsl` fits a square image inside the 16:9 frame. The circle stays round.
- `reveal.glsl` hides the plane at `0` and shows it at `1`. The wipe moves up.
- `peel.glsl` lifts the top edge as `u_progress` rises. It is off under 768px. It is off when reduced motion is on.

`components/motion/gl-effects.ts` registers `webglReveal`, `webglParallax`, and `webglPeel`. Each effect uses `extendTimeline: true`. One paused timeline per plane calls all three.

The DOM frame keeps the theme colour when WebGL is off. `html.has-index-gl` clears that fill so the shader can show through.

## What the readout shows

The panel is `[data-module-check="7"]`. It sits at the lower right so it does not cover the frames. The slider and the Replay button take clicks. The rest of the panel does not.

The Console object is `__module7`. It exists in development only.

`__module7.sample` is the plane nearest the middle of the viewport. `__module7.setProgress(0.5)` sets `u_progress` on every plane. `__module7.replay()` plays the timelines from `0` to `1`.

Scroll does not move `u_progress`. The page opens at `0`.

At `0` the frame is empty. At `0.5` the lower half is visible and `inner scale` is `1.10`. At `1` the frame is full, the circle is round, and `inner scale` is `1.00`. The top edge comes forward when peel is on.

## How to test in DevTools

1. Open the index at `/`.
2. Open DevTools.
3. Open the Elements tab.
4. Press Command+F.
5. Search for `data-module-check`.
6. Confirm the node is `data-module-check="7"`.
7. Open the Console.
8. Type `__module7.sample` and press Return.
9. Confirm `progress` is `0` and `source` is `timeline`.
10. Confirm the frame inside the border is empty.
11. Scroll the page.
12. Confirm `progress` stays `0`.
13. Scroll Worknet AI to the middle of the window.
14. Type `__module7.setProgress(0.5)` and press Return.
15. Confirm the lower half of that frame is dark.
16. Confirm the upper half of that frame is empty.
17. Confirm `innerScale` is `1.10` and `source` is `slider`.
18. Type `__module7.setProgress(1)` and press Return.
19. Confirm the frame is full and the circle is round.
20. Confirm the top ticks of the square image are cropped.
21. Drag the window narrower than 768px.
22. Confirm `reason` is `narrow` and `bend` is `0`.
23. Widen the window to 768px or more.
24. Set progress to `1` again.
25. Confirm `reason` is `wide` and `bend` is `1`.
26. Open the Rendering drawer from More tools.
27. Set `prefers-reduced-motion` to `reduce`.
28. Confirm `reason` is `reduced` and `bend` is `0`.
29. Confirm `html` has no class `has-index-gl`.
30. Confirm the frame fill is the theme colour again.
31. Set emulation back to `No preference`.
32. Reload `/`.
33. Open `/work`.
34. Confirm the panel says the index planes are idle.
