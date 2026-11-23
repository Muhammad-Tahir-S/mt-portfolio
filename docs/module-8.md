# Module 8

Aim. One study holds a small model you can load, shade, and spin.
This serves the site because the HTML figure stays in the document. The model dresses that frame. The page still works with WebGL off.

A glTF file is a scene description. It names the mesh, the material, and the bytes. A GLB is that file packed into one binary.

Three codecs show up on a careful site:

- Draco compresses the mesh with a Google decoder. This file does not use it. One primitive holds one geometry codec.
- Meshopt compresses the same buffers with `EXT_meshopt_compression`. The decoder ships inside Three.
- KTX2 stores the matcap as a GPU texture. Basis ETC1S is the supercompression inside that container. The browser transcodes it at load.

A matcap is a picture of a sphere under a light. The shader reads it with the view-space normal. `normalMatrix` puts the normal in view space. The highlight stays at the top of the view. A model-space normal would spin the highlight with the mesh.

On the Unseen menu, "glass" is a material name on a cheap shader. It is not a transmission render. This gem uses the same idea. The matcap is the whole shade.

A round body hides the turn. The mesh is a flat gem, so the silhouette changes as it yaws. This repo builds it. The script is `scripts/build-study-model.mjs`. Run `pnpm model` to write the file again. The encoder wasm stays in `scripts/.cache`. It is not part of the site.

The gem lives on the Addressable study, in the figure. The other studies keep an empty frame. The gem spins while the frame is in view. Hover spins it faster. Reduced motion holds the yaw still.

## Size budget

The compressed GLB must stay under **1.5 MB**. The current file is 4232 bytes. The Basis transcoder in `public/basis` is the decoder. It is Apache-2.0. It is not part of the model budget.

When the gem enters the view, the frame interval should rise by 2 ms or less. The readout shows that rise as `added`. Scroll the figure out of the window first. Then scroll it back. `added` compares that enter frame with the frames before it.

## What the readout shows

The panel is `[data-module-check="8"]`. It sits at the lower left. Clicks pass through it.

The Console object is `__module8`. It exists in development only.

`__module8.sample` is the gem. Off the Addressable study, `motion` is `idle`.

`motion` is `view` while the frame sits in the window. It is `hover` while the pointer is also on the frame. It is `rest` when the frame is off screen. It is `reduced` when reduced motion is on.

`yaw` grows while `motion` is `view` or `hover`. `load` is the decode time. `frame` is the interval on the enter frame. `added` is how far that interval sat above the frames before it.

## How to test in DevTools

1. Open `/work/addressable`.
2. Open DevTools.
3. Open the Elements tab.
4. Press Command+F.
5. Search for `data-module-check`.
6. Confirm the node is `data-module-check="8"`.
7. Open the Network tab.
8. Reload the page.
9. Confirm `study-sphere.glb` is under 1.5 MB.
10. Open the Console.
11. Type `__module8.sample` and press Return.
12. Scroll until the figure is below the window.
13. Scroll until the figure is in the window again.
14. Confirm `motion` is `view` and `yaw` changes.
15. Confirm `added` is `2.00` or less.
16. Move the pointer onto the frame.
17. Confirm `motion` is `hover` and the spin is faster.
18. Move the pointer off the frame.
19. Confirm `motion` returns to `view`.
20. Scroll the figure above the window.
21. Confirm `motion` is `rest` and `yaw` holds still.
22. Open `/work/worknet-ai`.
23. Confirm the panel says the study model is idle.
24. Open the Rendering drawer from More tools.
25. Set `prefers-reduced-motion` to `reduce`.
26. Return to `/work/addressable`.
27. Confirm `motion` is `reduced` and `yaw` holds still.
28. Set emulation back to `No preference`.
