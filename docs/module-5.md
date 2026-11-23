# Module 5

The canvas stays mounted. The scene inside it can change.

React Three Fiber writes the Three.js scene as JSX. The camera math still belongs to us. The camera sits at `z = 1500`. The field of view matches the viewport height. At the page plane, one CSS pixel equals one world unit.

Each index frame is a DOM box with `data-gl-plane`. A plane copies that box through `getBoundingClientRect` on the GSAP ticker. The canvas is `aria-hidden`. It does not take pointer events. The link in the document still receives the click.

Stills are theme colour textures for now. Cover UVs are wired. Real images can replace the stand-in without a new bind path.
