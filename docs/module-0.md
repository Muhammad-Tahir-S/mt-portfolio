# Module 0

The shell stays mounted. The outlet changes with the route.

Highway is the router on the Unseen site. It fetches the next HTML page. It replaces one node. The canvas stays.

This portfolio uses the Next.js root layout as the shell. `children` in `app/layout.tsx` is the outlet. `app/page.tsx` is the first outlet.

There is one canvas. It stays mounted across path changes. Only the scene inside the canvas changes. The canvas arrives in module 5. It will live in the root layout.

The camera sits at `z = 1500`. That number is a distance. The field of view is computed from the viewport height. At the plane in front of the camera, one CSS pixel matches one world unit. You can copy a DOM box onto a plane.

`1.5` is a later pixel-ratio step for a weak GPU. It is not the camera distance.

Art direction is not part of this module.
