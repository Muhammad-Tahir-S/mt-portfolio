# Module 6

The Module 6 readout was removed at the start of Module 7. The camera path remains in `lib/camera-path.ts`.



Aim. Scroll moves the camera along a path you can predict.
This serves the site because the index stays one document. The path is a state of that space. The HTML links stay the hit targets.

Scroll sets a target from 0 to 1. A paused GSAP timeline holds the camera poses. `MathUtils.damp` eases the timeline progress toward the target. Reduced motion snaps. Off the index, the target is 0.

Each index plane has a shallow z offset. The plane faces the camera. The screen box stays on the DOM frame. The offset does not cover the title.

The poses live in `lib/camera-path.ts`. The camera writes them in `components/gl/page-camera.tsx`.

## What the readout shows

The panel is `[data-module-check="6"]`. It sits at the lower left. It is not in the page flow. Clicks pass through it.

The Console object is `__module6`. It is the same sample the panel reads. It exists in development only.

`target` is the scroll fraction. `progress` is the damped timeline value. `mode` is `damp` or `snap`. `pose` names the two keyframes the timeline blends.

The plane z line is the depth pattern. It does not change as you scroll.

## How to test in DevTools

1. Open the index at `/`.
2. Open DevTools.
3. Open the Elements tab.
4. Press Command+F.
5. Search for `data-module-check`.
6. Confirm the node is `data-module-check="6"`.
7. Open the Console tab.
8. Type `__module6` and press Return.
9. Scroll the index slowly.
10. Type `__module6` again and expand the object.
11. Confirm `target` rises with the scroll.
12. Confirm `progress` follows `target` and stays a little behind it.
13. Confirm `z` drops below 1500 in the middle poses.
14. Open the Rendering drawer.
15. In Chrome, use the DevTools menu, then More tools, then Rendering.
16. Set `prefers-reduced-motion` to `reduce`.
17. Scroll the index again.
18. Confirm `mode` is `snap`.
19. Confirm `progress` equals `target`.
20. Set the emulation back to `No preference`.
21. Open `/work`.
22. Confirm `route` is `off-index`.
23. Confirm `target` and `progress` return to 0.
24. Confirm `z` returns to 1500.
25. Open `/` again.
26. Inspect a node with `[data-gl-plane]`.
27. Open Computed for that node.
28. Read `background-color`. It is that project theme.
29. Confirm the frame sits under the summary.
30. Resize the window taller and shorter.
31. Confirm `fov` changes. A taller view uses a smaller field of view.
