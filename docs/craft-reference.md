# Craft reference: how the Unseen site works, and how this portfolio will learn it

Read this file before you change layout, motion, routing, or WebGL.

Agents also follow `.cursor/rules/teaching-and-ste.mdc`. Sentences stay short. A new tool gets context before a definition.

The study date is 9 October 2026. The source is the live HTML, CSS, and theme bundles at [unseen.co](https://unseen.co/). The source also includes every URL in the Yoast sitemaps, the project list on the home page, and the lab links. The notes come from that shipped code. Frame times were not measured in a running browser.

The goal is the same level of care. Do not copy their brand, words, models, sound, or fonts.

## Agent contract

1. Build one continuous space. A page is a state of that space.
2. Earn each effect. A clear case study is better than a shader that stutters.
3. Keep a real HTML document under the canvas. Content, search, and the keyboard must work with no WebGL.
4. Sound is optional. The first screen gives a real choice.
5. Match their care. Fix the access gaps in section 10. Do not set `user-scalable=0`. Do not ship motion with no reduced-motion path.
6. Do not copy their fonts, GLB files, textures, or audio. Pair a plain grotesque with a light italic serif. The pair can be open or licensed.
7. **Studio practice** means a method from their articles about client work. It does not mean the method is in the home-page bundle. Do not claim that it ships on the studio home page.

### Locked decisions (9 October 2026)

- The app stack is Next.js (App Router), React, and TypeScript. React Three Fiber and GSAP come when the course reaches them.
- Motion today is CSS transitions, and at most a little Framer Motion. There is no shipped GSAP, Three.js, or GLSL. Module 1 is mandatory. Do not skip to a canvas.
- The time budget is 5 to 10 focused hours each week. Modules 0 to 11 take about 14 to 18 weeks at that pace. Do not drop the DOM modules to go faster.
- The site is for the author. The craft is the proof. The audience is not "only studios" or "only product teams".
- Do the technical exercises first. Set the visual direction later. Do not design the final look in week one.
- The author already has front-end project work. You may rewrite the story. Do not invent clients. A sharper story can wait. It does not block modules 1 to 7.

---

## 1. What the site is

### New term: a theme bundle

In your React work, Vite or webpack packs components into JavaScript files. The browser downloads those files and runs them.

On this site, WordPress still prints the HTML. A custom theme at `wp-content/themes/unseen` adds the experience. Webpack packs that experience. The runtime name is `webpackChunkunseen`.

WordPress holds the case studies, the SEO plugin (Yoast), and a JSON list of projects. Three scripts start the experience:

- `public/scripts/manifest.js` is the webpack runtime.
- `public/scripts/vendor.js` holds libraries. It is about 1.1 MB.
- `public/scripts/theme.js` is the studio code. It is about 409 KB.

### New term: WebGL canvas

In your React work, the page is DOM nodes. CSS paints boxes.

WebGL gives the GPU a list of triangles. The GPU paints pixels on a `<canvas>`. You use it when CSS cannot bend an image, move a camera, or draw a 3D object.

This site keeps one canvas. The id is `gl`. The canvas does not unmount when the user changes page.

### New term: Highway

In your React work, the router changes the URL and swaps the page component. A layout above that page can stay mounted.

Highway does the same job for server HTML. The request header is `X-Requested-With: Highway`. Highway fetches the next WordPress page. It replaces the node that has `data-router-view`. The canvas stays.

Each route is a named view. A pair of routes can name a transition.

Views in the router: `home`, `projects`, `project`, `world`, `contact` (the DOM view name is `homeContact`), `notFound`, `ktxPreview`.

| Transition id | What it does |
| --- | --- |
| `default` | A fallback mix of the two scenes |
| `homeToProject` | Home field into a case study |
| `toProjectMenu` | Home into the project menu |
| `toProject` | Menu into a case study. It carries the background colour and the light or dark mode |
| `projectToProject` | One case study into the next |
| `toWorld` | Enter the scene you can drag |
| `toHome` | Return home |
| `toContact` | Enter the contact state |

Registered routes in the bundle include:

- `/` to `/contact/` uses `toContact`
- `/` to `/world/` uses `toWorld`
- `/` to `/projects/` uses `toProjectMenu`

### New term: smooth scroll

In your React work, the browser moves the document when the user turns the wheel. The jump can feel stepped.

A smooth-scroll library catches the wheel. It stores a virtual position. It eases that number toward the target. CSS and WebGL can both read the same number.

This site uses [ASScroll](https://github.com/ashthornton/asscroll). The `html` element starts with the class `asscroll-disabled`. The `main` element has the attribute `asscroll`. Shaders read `u_scrollPos` and `u_velocity`. Scroll is not only a way to move the document.

For this portfolio, use Lenis. It solves the same problem. It is the library you should install now. ASScroll is the historical tool on their site.

### What the runtime remembers

One theme object stores:

- The viewport size
- The mouse in pixels and in clip space
- A smoothed mouse position
- `matchMedia` breakpoints
- URL parameters
- Touch and iOS flags
- The current project-menu id
- Light mode
- Shared services: `ASScroll`, `AssetLoader`, `TaskScheduler`, `Dom2Webgl`

Breakpoints:

- `xs`: max-width 415px
- `sm`: min-width 768px
- `md`: min-width 1024px
- `lg`: min-width 1366px
- `xlg`: min-width 1921px

The bend shader turns on only when `sm` matches. A small screen gets a flat plane.

---

## 2. Map of the site

| URL | Router view | What the user gets |
| --- | --- | --- |
| https://unseen.co/ | `home`, with `homeContact` in the DOM | A loader, then selected work, then a contact block in the same document |
| https://unseen.co/projects/ | `projects` | A 3D menu you can filter. Filters: All, Branding, Digital, Motion, Experiment |
| https://unseen.co/world/ | `world` | A small scene. The line on screen is "Drag to explore our world" |
| https://unseen.co/contact/ | contact | Addresses, two emails, and social links. Home can also show this state |

Nav labels, in order: 01 Index, 02 Projects, 03 Contact, 04 World.

The menu draws each label twice. One copy is the rest state. One copy is the hover state. An underline sits with them. This is not a second menu.

### Case studies

Each case study uses `data-router-view="project"`. The pattern is stable. You get a title, an overview, services, a date, a client, and a location. Then you get process sections, media, often "View project", and the next project.

`blueyard-capital` is still placeholder text. Treat it as unpublished.

| Slug | Client | Services on the page | Outbound link |
| --- | --- | --- | --- |
| shape-studio | Shape Studio | Brand strategy, digital strategy, website, videography | shapestudio.co.uk |
| asaro | Asaro | Branding, website, CGI | asaro.craftedbygc.com |
| contra | Contra | Art direction, interaction, CGI, WebGL | contra.com industry report |
| dreamscapes | Dreamscapes | Case study page | — |
| blue-yard | BlueYard | WebGL, digital design, brand, motion, 3D | blueyard.com |
| allies-of-skin | Allies of Skin | Campaign visuals, 3D, motion, art direction | — |
| lewa-house | Lewa House | Branding, website, CGI | lewahouse.com |
| superlist | Superlist | UX, UI, front end, WebGL, 3D models | superlist.craftedbygc.com. The page explains matcaps, baked motion, and face removal in Houdini |
| letter | Letter | Case study page | — |
| dala | Dala | Case study page | — |
| seascape-survey | Blue Marine and Convex | WebGL, 3D, strategy, UI, UX, AR, WebXR | convexseascapesurvey.com |
| kikk-2024-brand-identity | KIKK | Case study page | — |
| robco-3d-motion | RobCo | Storyboards, 3D models, motion | — |
| hiring-calculator | Hiring calculator | Case study page | — |
| crosswire | Crosswire | Branding, digital, WebGL | Codrops case study, 2023 |
| quai-network | Quai | Digital, WebGL, 3D, interaction, strategy, branding | — |
| blueyard-capital | Stub | Placeholder services | — |
| true | TRUE Staging | Brand strategy, branding, digital | truestaging.co.uk |
| blue-marine-foundation | The Sea We Breathe | WebGL, UX, UI, strategy, 3D, motion, CGI | theseawebreathe.com |
| nikolas-type | Nikolas Type | Art direction, 3D motion, web | casadisolare.com is a related link |
| walk-with-whales | Blue Marine XR | VR, AR, an Instagram filter, Houdini | vrbluemarine.com |
| cult-of-the-north | Cult of the North | Case study page | — |
| clou | CLOU Architects | UX, UI, digital, WebGL | clouarchitects.com |
| organimo | Organimo | Digital, realtime 3D, e-commerce | organimo.com |
| illoca | Illoca | Case study page | — |

Several studies ship 8 to 17 `<video>` tags and 20 to 50 images. The canvas is still on those pages. The WebGL layer and the article exist together.

### The home list is not the sitemap

The home page embeds a `projects` JSON array. It has 36 items. That array feeds the interactive field. It is not the sitemap.

Counts in that data: digital 20, experiment 6, motion 5, branding 5.

Some items link out. They have no case study on unseen.co. Examples: Hubtown, Poly, OceanX 2025, Symphony of Vines, Klook, RSPCA Animal Futures, blueyard.com, Cosmos, and 25 Residences.

Four items include a `.glb` file, a material, a position, a rotate speed, and a scale. Those four are RobCo, Nikolas Type, Crosswire, and Blue Marine. Videos are URLs. They are not always files inside the theme.

| URL | What the HTML is |
| --- | --- |
| https://unseen.co/labs/blossom/ | An older experiment, "La Parfumerie" |
| https://unseen.co/labs/cellular/ | A cellular-technologies experiment |
| https://unseen.co/labs/optical-flow/ | An optical-flow lab. Credits include Ash Thornton |
| https://unseen.co/labs/webgl-rain/ | A small standalone WebGL bundle |
| https://water-scene.unseen.co/ | "Interactive Water". A separate bundle. The home label is Pool Life |
| Particle Play | A grid item with no href |

### Other links in the shell

- https://2025.unseen.co/ is "Year in Review 2025". It is a separate Next.js site. It is not this WordPress theme.
- Email: hello@unseen.co and projects@unseen.co. Phone: +44 0117 922 6892.
- Social: X, Instagram, LinkedIn, Dribbble, Behance.
- Method articles, marked **studio practice**: [Symphony of Vines](https://unread.unseen.co/the-symphony-of-vines-dev-insights-c284cc4e8aa0) and [Convex seascape](https://unread.unseen.co/insights-convex-seascape-survey-4b64f2cff88b).

Do not copy the tracking. The theme loads GA4 `G-SHZRDC7G64` and a Lead Forensics script (`insightful-cloud-365`).

---

## 3. How the page starts

```
WordPress HTML
  critical CSS (loader, fonts)
  utility CSS (style.css, about 46 KB)
  inline project JSON
        |
        v
Boot
  measure window, dpr, breakpoints, touch, iOS
  AssetLoader + TaskScheduler
  WebGLRenderer on #gl
  Howler bus, muted until the user chooses
  Highway router
  ASScroll (on after the loader)
        |
        v
One scene graph, many rooms
  home field / project menu / world / transition mix
        |
        v
DOM view swap
  replace [data-router-view]
  Dom2Webgl binds planes to the new DOM
  a GSAP timeline plays the named transition
```

### New term: a scene graph

In your React work, components form a tree. A parent holds children.

A WebGL scene is also a tree. A scene holds meshes. A mesh holds geometry and a material. You show a "room" by showing one branch and hiding the others. You do not build a new canvas.

Event names in the theme: `GRAF`, `GMouseMove`, `GMouseDrag`, `GMouseDown`, `GMouseUp`, `GResize`, `TouchDetected`, `GWheel`.

A touch device adds the class `is-touch` on `body`. It uses a different pointer path. If a mouse appears later, the code can still call `detectMouse()`.

`?skiploader` hides the intro. Keep a query flag like that in this portfolio.

### New term: a task queue

A GPU upload can freeze one frame if you do it in the same turn as the paint.

`TaskScheduler` queues heavy uploads and decodes. Copy the idea. The class name can be ours.

---

## 4. Rendering

### The renderer

The renderer is created with these flags:

- `alpha: true`. The page colour can show through the canvas.
- `antialias: false`. Edges are cleaned later. FXAA is in the vendor bundle. Multisample antialiasing costs more bandwidth.
- `powerPreference: "high-performance"`.
- `stencil: false`. The stencil buffer is unused, so they do not pay for it.
- Pixel ratio is `min(devicePixelRatio, 2)`.

### New term: device pixel ratio

In your CSS work, a 100px box can cover 200 or 300 device pixels on a dense screen.

`devicePixelRatio` is that scale. If you size the canvas by the full ratio on a phone, you can fill a 4K buffer for a small page. Cap the ratio at 2. Later, expose levels `1`, `1.5`, and `2` for a weak GPU.

### A camera that matches CSS pixels

```ts
const distance = 1500;
const fov =
  (2 * Math.atan(viewportHeight / 2 / distance) * 180) / Math.PI;
```

### New term: field of view

A perspective camera is an eye in 3D space. Field of view is how wide that eye opens. You already know this from a photo lens. A wide lens shows more of the room.

They place the camera at `z = 1500`. They set the field of view so the visible height equals the viewport height, in world units. Then one CSS pixel matches one world unit at that plane.

You can copy `getBoundingClientRect()` onto a plane. You do not need a second scale. This match is why an image can sit "in the page" and also bend in WebGL.

On resize, update the aspect, the field of view, the renderer size, and the plane sizes. The field of view depends on the height, so a resize must recompute it.

The bundle also emits `cssrenderer:cacheUpdated` when the field of view changes. It writes that value into a CSS `perspective`.

Two projections run together:

1. WebGL planes bind to DOM boxes (`Dom2Webgl`).
2. A CSS 3D layer keeps the same perspective. Inputs and links stay sharp DOM. They still sit in the same space as the scene.

Use WebGL for images, video frames, bent type, and 3D models. Use real DOM for anything the user must select, tab to, or hear from a screen reader.

### DOM and WebGL together

`dom2webgl` is an attribute on videos.

On a desktop, WebGL samples the video. The DOM video then calls `pause()` after the first frame. The browser does not decode the film twice. `src` often comes from `data-src`, and only when the page needs it. iOS gets a `suspend` listener. Mobile video load stalls in a different way.

### New term: a uniform

A shader is a small program on the GPU. You cannot pass a React prop into it directly. A uniform is the input you set from JavaScript. CSS custom properties are the closest cousin. You set `--progress` on a parent. The CSS reads it. You set `u_progress` from GSAP. The shader reads it.

Planes carry these uniforms:

- `u_progress` for a reveal and for a transition
- `u_innerX`, `u_innerY`, `u_innerScale` for parallax inside a frame. The start values are `u_innerY = -0.2` and `u_innerScale = 1.2`
- `u_enableBend`, `u_bendAmount`, `u_bendPoint` for the peel
- `u_meshSize` and `u_imageSize`, with `backgroundCoverUv`. The image uses object-fit cover. It does not stretch
- `u_scrollPos` and `u_velocity`. Scroll can shear or lag the sample
- `fogColor`, `fogNear`, and `fogFar` on most 3D materials

### New term: a GSAP effect

In CSS you reuse one transition by naming it. GSAP can register a named effect the same way. A timeline can call that name like any other tween.

Registered effects:

- `webglTextReveal` sets `u_progress` from 0 and tweens it.
- `webglParallaxEffect` sets the inner offset and the inner scale.
- `webglPeelEffect` enables bend at `sm` and above, then tweens `u_progress`.

They set `extendTimeline: true`. Copy this pattern. The shader exposes one or two uniforms. GSAP owns the clock.

### Materials and light

### New term: a matcap

A normal 3D material computes light from lamps in the scene. That cost repeats for every object.

A matcap is a photo of a sphere under the light you want. The shader looks up that photo by the view-space normal. You get the look of light with no lamps and no shadow maps.

Project-menu models use matcaps: `images/matcap-black.png`, `matcap-white.png`, `project-model-matcap.png`, and `project-model-matcap-dark.png`. The four GLB items in the JSON also carry a material name, `glass`. That name does not mean a full glass simulation. It is a cheap shader plus a slow `rotate_speed`.

The bundle also contains `MeshPhysicalMaterial` (clearcoat, transmission, iridescence, sheen). Use a physical material for one hero object. Use a matcap when the object is one of many.

Fog is the depth cue for the world and the menu. It costs less than a full atmosphere. It also hides objects that pop in at the far end of a scroll.

### What the bundle draws

Home and menu:

- Image planes with cover UVs, fluid distortion, and a smear from velocity
- Troika text for the font name `Neue Montreal` (`sdfGlyphSize`, `textAlign: "center"`)
- Particles with flock rules: `u_separationDistance`, `u_alignmentDistance`, `u_cohesionDistance`, speed limit 8, bounds ±2500
- God rays (`aOffset`, scroll offset 1500, the same distance as the camera)
- A fluid sim. The steps are velocity, divergence, pressure, then subtract the pressure. Mouse radius, viscosity, and iteration count are uniforms. The visible pass moves UVs by the fluid. It can also fade opacity
- Mix targets named "Home Final" and "Project Menu Scene Texture"

World:

- `land-group.glb`, grass blades (`u_blade` atlas, discard when alpha is low), water with `uTextureMatrix` and `vMirrorCoord`, and noise on the land colour
- Set models: `room-1.glb`, `room-2.glb`, `chair.glb`, `table-3.glb`, `pillows.glb`, `rocks.glb`, `grass-simple.glb`, `models/phone.glb`
- Cursor models: `models/world/pointer.glb`, `grab.glb`, `grabbing.glb`, plus matching PNGs
- A save pass named "World Final"

The menu also loads `models/project-menu/arch-dc.glb`, `floor-dc.glb`, `butterfly.glb` (diffuse atlas and normal atlas), and `models/home/objectsData.glb`.

### Passes after the scene

### New term: a pass

The GPU can paint the scene into an image, not onto the screen. A later program reads that image and changes it. Film grain, a vignette, and a page wipe are passes. CSS filters are the cousin, but a pass can also mix two full scenes.

Shaders in the theme start with `#define GLSLIFY 1`. glslify is a tool that joins shader files at build time. It is like an import for GPU code.

The vendor bundle contains Three's `EffectComposer`, `RenderPass`, `ShaderPass`, and FXAA. The theme adds its own passes.

| Pass | What it does |
| --- | --- |
| Fluid mix | Reads the sim, offsets UVs, and can distort the image |
| Motion trail | Mixes `tOld` and `tNew` with `damp` about 0.96. It is a fade of the last frame, not a blur library |
| Grain | A hash of `gl_FragCoord` plus `u_time`. Some grades use a 2.2 gamma step |
| Vignette | `u_vignetteStrength` darkens the corners |
| Barrel | A polar distort around the centre |
| Glitch | A horizontal slice offset |
| Colour grade | A mix toward a tint by `u_strength` |
| Wipes | A noise mix of `u_fromScene` and `u_toScene`, or a diamond wipe. `u_progress` and smoothness 0.6 follow the route id |
| God rays | Additive streaks from a light colour. They scroll with the page |
| FXAA | Cleans edges because hardware antialiasing is off |

Each full scene can render into a texture. `savePass.enabled` toggles that. A transition mixes those textures. The site does not light two full worlds in one view on every frame.

### Three sims, in plain steps

**Fluid.** Two buffers swap each frame. That swap is called ping-pong. One buffer is the previous velocity. The next step writes the new velocity. The steps move the field, measure divergence, solve pressure, and then subtract the pressure gradient. The pixels you see only read that velocity and nudge UVs. The pointer is a force. That is why a hover feels like liquid, not like a CSS spring.

**Flocking.** Each particle wants space, wants to match its neighbours, and wants to stay with the group. Those three forces are separation, alignment, and cohesion. The draw uses a small texture (`u_particleTex`) and a light position. This is dust in the scene. It is not the project cards.

**Grass and water.** Grass is a flat card or a blade. Low alpha is discarded. Two colours tint it. Water shows a texture that the scene rendered, through a projection matrix. That is the usual Three.js reflector. Run both only on the world route. Do not run them on a case study.

---

## 5. Type and layout

### The two fonts

The page preloads woff2, with woff as a fallback.

- Neue Montreal Regular, from Pangram Pangram, is the UI face. It is used for nav, labels, and the loader. The stack is `"Neue Montreal", system-ui, …`.
- Saol Display Light and Light Italic, from Schick Toikka, are the voice. One display size in the CSS is 6.25rem with a 6.25rem line height. One italic size is 3.15rem.

The grotesque does the job of a tool. The italic serif says the one emotional line. Most of the page is near one colour. Photos and WebGL carry the rest of the colour.

### New term: SDF text

CSS paints letters as shapes in the DOM. You cannot bend those shapes in a vertex shader.

Troika builds a signed-distance image of the font. A mesh samples that image. The peel and the fluid can then move the letters. Body copy stays in CSS, so it stays sharp and selectable.

SDF data comes from the font file at build time or at load time. CSS uses the same family name, so the DOM and the canvas match. Preload the two woff2 files that the first paint needs. Do not preload every weight you might use later.

### Their utility CSS

`style.css` is their own utility sheet. It is not Tailwind. You will recognise the jobs:

- Display: `d-flex`, `d-block`, `d-none`, `flex-column`, `items-center`, `justify-center`
- Type: `t-serif`, `t-italic`, `t-uppercase`, `t-center`, `t-ls-tighter`, `t-lh-1.1`, `t-lh-0.9`
- Size: `t-1.2`, `t-1.3`, `t-2`, `t-3`, `t-5`, `t-10` map to rem sizes. `t-300`, `t-500`, and `t-600` are weights
- Width: `w-1/1`, `w-1/2`, and other fractions
- A suffix `@sm` or `@md` is a min-width override. Example: `.d-none.d-flex@md`
- `.container` has max-width 80rem. Padding is 1rem, then 2rem from 768px
- Aspect boxes use padding-top for 16/9, 1/1, and 3/2
- `.sr` hides text visually and keeps it for a screen reader

### Colour

These values come from the loader and the shell. They do not come from a large token file.

| Role | Value |
| --- | --- |
| Loader and ink background | `#212121` |
| Muted UI grey | `#424242` |
| Paper | `#fff` |
| Blush field | `#efded9`, `#F8D8D8` |
| Signal orange | `#FF4E1B` |

Utility variables: `--text`, `--background`, `--fill`, `--border`, `--hover`, `--hoverText`, `--hoverFill`, `--hoverBorder`, `--dark`, `--light`, `--cursor`.

Orange is rare. Most of the chrome is black, white, or warm grey. A project transition carries `bgColor` and `lightMode` for that project. The shell takes the colour of the work. Pages do not share one theme.

### Rules to keep

- Keep display line height equal to the font size, or at 0.9.
- Use uppercase labels for nav and meta.
- Use the italic serif for one sentence on a screen, not for a paragraph.
- Treat the 6.25rem line as the hero, not as a heading above a paragraph.
- Make hover physical. Slide a second copy of the word. Grow an underline. Fill a circle. Do not use opacity alone.

---

## 6. Assets

### Models

### New term: glTF

A GLB file is a packed 3D model. It holds the mesh, the materials, and sometimes the animation. It is the interchange file, the way SVG is an interchange file for a flat icon. Three loads it with `GLTFLoader`.

The theme also loads:

- `DRACOLoader`. Draco compresses the vertex data. The file is smaller. The browser unpacks it.
- `KTX2Loader` and a Basis transcoder. The image stays compressed on the GPU. The code checks `WEBGL_compressed_texture_*` for ASTC, ETC, ETC1, S3TC, and PVRTC.
- `MeshoptDecoder`. Meshopt compresses the mesh in a second, simpler way. It is fast to decode.

`arch-dc.glb` and `floor-dc.glb` are the Draco exports. The source mesh stays in a 3D tool. The site receives only the cooked file.

### Textures

- Matcaps are PNGs.
- Gradient noise and small noise are JPG or PNG. Shaders read them. They are not photos on the page.
- KTX2 files hold GPU images (`arch.ktx2`, `*.options.ktx2`).
- The butterfly uses a diffuse PNG and a normal PNG.
- A video frame becomes a `VideoTexture` through the `dom2webgl` path.

**Studio practice, from the Convex article:** load only the textures that the first scene needs. Stream the rest as KTX2 so the GPU upload does not hitch. Do the same here. Put the first route in the critical set. Load the rest after the first interaction.

### Sound

### New term: an audio sprite

In CSS you might use one sprite sheet for many icons. Howler can pack many short sounds into one file. You play a named slice. The theme uses `Howl` and `Howler`.

Ids from the DOM attribute `data-audio-enter` and from the theme:

`audio.backing`, `audio.hover`, `audio.ratchet`, `audio.navlinks_hover`, `audio.menu_swoosh`, `audio.menu_close`, `audio.contact_swoosh`, `audio.world-loop`, `audio.world_static`, `audio.new_water_projects`.

The enter control chooses sound on or off before the bed starts. Mute is a global button, `js-global-mute-btn`, with its own GSAP timeline. The world has a loop. Contact has a swoosh. A hover sound is an attribute on the element. It is not hard-coded in each component. Copy that API: `data-audio-enter="hover"`.

### Images in case studies

WordPress serves JPGs. The JSON often stores a size such as `[1024, 538]`. The interactive field uses one still, and sometimes a video, for each project. The case study uses the long cut. Keep two tiers:

1. **Index tier.** A small still, an optional short loop, and an optional GLB.
2. **Study tier.** The full image set and the films. Load them with the project view. Do not load them with the home page.

---

## 7. Motion and page changes

### One clock

### New term: GSAP

A CSS transition plays one change. It is hard to reverse halfway, and hard to keep in step with a canvas.

GSAP is a JavaScript timeline. You place tweens on a clock, like clips on a video track. You can pause, reverse, or set the progress from a scroll position. GreenSock is in the vendor bundle. The bundle also contains the version string `3.11.2`. ScrollTrigger, Observer, and CustomEase are present.

The render loop is `gsap.ticker`. It emits `GRAF`. Scroll, DOM, and uniforms stay in step. Do not add a second `requestAnimationFrame` loop that fights this clock. The Three clock is secondary.

Eases in the calls: `power2.inOut`, `power2`, `power3`, `power4`, `expo`, `sine`, `circ`, `elastic`, and CustomEase paths. UI fades in the loader last about 0.5s to 0.8s. The loader wrap scales from 0 to 1, or to 0.5 in one variant, over 0.8s. Then the code adds the class `loader--animate`.

### The loader

DOM hooks: `js-loader`, `js-naked-loader`, six `js-naked-loader-box` cells (the letter boxes), a progress bar, and `js-eyes` (left, right, upper lid, lower lid, a heart variant, a normal variant). Buttons: `js-enter-btn` and `js-enter-no-audio-btn`.

The eyes follow the pointer. Enter is a click or a hold. It is not an automatic dismiss. That pause is the brand. It is also the audio choice. Keep a gate if this portfolio uses sound. Skip the gate when sound is off and the user prefers reduced motion.

### Scroll

ASScroll smooths the wheel and writes a virtual position. ScrollTrigger reads that proxy, with the usual `scrollerProxy` pattern. A pin and a scrub then agree with the smooth value. Shaders read the same number for parallax and for god rays.

On the project menu, scroll or drag moves the camera through the cards.

### New term: a raycaster

The mouse is a 2D point. A raycaster shoots a ray from the camera through that point. The first mesh on the ray is the hover target. It is the 3D version of `elementFromPoint`.

Only the hovered card is active. That keeps the test cheap. A click is ignored unless the target is the scroll container. That rule avoids stolen link clicks. The hovered item stores `bgColor`, `lightMode`, and an id. The `toProject` transition reads them.

### Page transitions

Highway leaves the current view, fetches HTML, enters the next view, and updates history. WebGL does this in parallel:

1. Render the outgoing scene into a texture, if it is not cached.
2. Swap the active branch to the next room. Keep it hidden behind the mix.
3. Tween `u_progress` on the mix pass. The pass can be a noise wipe, a radial wipe, or a colour mix with `u_fromColor` and `u_toColor`.
4. When the tween ends, disable the mix pass. Show the live scene.
5. Bind Dom2Webgl to the new DOM.

`projectToProject` exists so "next project" does not return to the menu. Carry the next background colour on the transition data. Do not pop a global theme after the navigation.

### Hover

- Nav: two labels and an underline (`js-menu-text`, `js-menu-hover-text`, `js-active-underline`).
- Buttons: an inner wash and an icon swap (`js-btn-inner`, `js-btn-icon`).
- World button: a circle, a globe icon, the split label "Unseen / World", and a hover icon.
- Cursor: a DOM follower (`js-cursor`). Modes are a default circle, drag, a hold ring, a progress ring, and video play or pause. `data-cursor` on a target switches the mode (`hide`, `progress`, and the video set).
- In the world, the cursor is a 3D model (pointer, grab, grabbing). The DOM cursor hides.

Build the cursor as one state machine. Do not create a new element for each mode.

---

## 8. Input

| Input | Desktop | Touch (`is-touch`) |
| --- | --- | --- |
| Move | Custom cursor, eye track, fluid force, raycast hover | No custom cursor. Reduce the eyes and the fluid |
| Drag | World orbit or menu drag (`GMouseDrag`) | The same gesture, with touch listeners |
| Wheel | ASScroll | Native scroll or ASScroll. The menu also allows drag |
| Hold | Loader, and the "click and hold" cursor | A tap |
| Video | WebGL samples it. The DOM video pauses | Use the DOM video path. Do not assume autoplay |

The keyboard path on the original site is weak. See section 10. In this portfolio, every card is a real link. The menu control is a button. A skip link jumps past the canvas to the document.

---

## 9. Performance

| Technique | Why it matters | The bar for this repo |
| --- | --- | --- |
| DPR cap at 2 | Buffer size | Never above 2. Drop to 1.25 if a frame stays above 22 ms |
| MSAA off, FXAA on | Bandwidth | Same. Allow FXAA off on the lowest tier |
| Matcap for repeated models | Light cost | A hero may be physical. A field of objects is a matcap, or one directional light |
| Draco, Meshopt, and KTX2 | Download and GPU upload | Required for any GLB we ship |
| Two load tiers | Time to first use | Critical set: font, loader, first scene. The rest waits |
| `data-src`, and pause when WebGL owns the frame | Decode | One playing video texture in a field of cards |
| `stencil: false`, no shadow maps on the field | Fill rate | Shadows only in a case-study scene, and baked if possible |
| One GSAP ticker | Sync and idle | Pause the ticker when `document.hidden` |
| Passes per room | Extra paint | World passes (water, god rays, grass) unmount when the route leaves |
| Instancing and baked motion | Draw calls | If a shape repeats, instance it. Bake rigid motion into the glTF |
| `?skiploader` and a task queue | Dev speed and hitch | Same |

**Studio practice for a heavy scene:** block the camera in the 3D tool before final art. Upload later KTX2 files after the first scene. Delete faces that the camera never sees. Prefer baked light. They used Theatre.js to direct the Symphony of Vines camera. That tool is optional here. A GSAP timeline on a path is enough until a scene has many channels.

Targets for this portfolio, on a desktop, first load, fast connection:

- The loader is ready in under 3 s. Full quality is ready in under 8 s.
- The index holds 60 fps on an M-series laptop at DPR 2. 30 fps is not acceptable for UI motion.
- A case-study route shows the first new frame in under 1 s. Images may sharpen after that.

---

## 10. Access

What the site does well:

- `lang="en-GB"`
- A visually hidden `.sr` class
- Real buttons for menu, mute, and enter
- Sound is opt-in
- Touch has its own path
- `role="main"` on the world main

What we will not copy:

- The viewport sets `maximum-scale=1` and `user-scalable=0`. That blocks pinch zoom. Our viewport allows scale.
- The bundles do not mention `prefers-reduced-motion`. We will treat reduced motion as a real mode. No smooth-scroll ease. No peel. No fluid. No camera scrub. The content is the document. The loader finishes on its own.
- A full-screen canvas and a custom cursor can trap focus. Mark the canvas `aria-hidden` when it is decorative. Keep a text list of projects in the DOM. That list is the access tree.
- After a view swap, move focus to the new `h1`. Restore scroll only through our scroll proxy.
- Video needs a control, or a named play button. Add captions if we speak. Do not autoplay sound.
- `#424242` on `#212121` is for decorative loader marks. Body text must meet WCAG AA on its background.
- The custom cursor uses `pointer-events: none`. It is never the only sign of a link. Keep underlines and labels.

---

## 11. The creative decisions

The stack serves a few decisions. If you copy the libraries and miss these, the site will look like a demo.

1. **One room, many doors.** The user does not see a white flash of a new document. Colour, camera, and sound cross with them.
2. **Type has two jobs.** One serif sentence does the emotional work. The grotesque does the work of a tool.
3. **Colour stays quiet.** Orange is a signal. Project colour belongs to the work.
4. **Motion has weight.** Scale from 0. Ease with `power2` or `power3`. Then stop. A loop needs a reason. Grain, water, and a slow rotate are the exceptions.
5. **The pointer is a character.** Eyes on the loader. A cursor that changes job. A hand that grabs the world.
6. **Sound is foley.** A ratchet on a mechanical control. A swoosh when the room changes. A loop only inside the world. Silence is the default until the user asks.
7. **Show the process.** A case study shows trials, not only the final film. Our studies need that chapter.
8. **Put experiments next to client work.** A small studies route is in scope after the index and two case studies are solid.
9. **Scroll is a camera move.** The user moves through a designed path. Each project has a position. You author the path. You do not only reveal stacked sections.
10. **Use few shaders.** The home page works because a few systems are composed. Those systems are type, planes, one fluid, and one transition. Twenty effects at once will not help.

Do not rebuild their office, their eyes, or their wordmark. The room structure can be similar: a gate, a field of work, case studies, and contact. The world itself should be yours. Set that look after the exercises, not before.

---

## 12. Target shape of this repo

```
app/
  layout.tsx              canvas, audio, cursor, and nav stay mounted
  page.tsx                index field (DOM list + WebGL bind)
  work/page.tsx           project menu
  work/[slug]/page.tsx    case study article
  world/page.tsx          later, optional
  contact/page.tsx
  studies/page.tsx        labs, later
components/
  dom/                    nav, loader, case-study blocks, cursor
  gl/                     canvas, scenes, materials, passes
  gl/shaders/             peel, reveal, cover, transition, grain
  motion/                 GSAP effects, registered once
  audio/                  Howler bus, data-audio attributes
content/
  projects.ts             typed index and case studies
lib/
  camera.ts               the 1500-unit fit
  quality.ts              dpr and pass tiers
  reduced-motion.ts
```

Keep these in state, not in the URL: loader visibility, audio consent, menu open, cursor mode, transition progress, and quality tier.

```ts
type Project = {
  slug: string;
  title: string;
  summary: string;
  categories: Array<"branding" | "digital" | "motion" | "experiment">;
  year: string;
  client?: string;
  role: string[];
  href?: string; // external, when the live site is elsewhere
  theme: { background: string; light: boolean };
  index: {
    still: string;
    video?: string;
    model?: { src: string; material: "matcap" | "glass"; rotate: number };
    position: [number, number, number];
  };
  study?: {
    sections: Array<{ heading: string; body: string; media: Media[] }>;
  };
};
```

The DOM renders this data. WebGL reads the same module. Do not keep a second copy.

Build order for agents:

1. Build the case-study page in the DOM only. Include the type scale and the content schema.
2. Add the persistent layout, the nav hover, and a colour-and-type transition. Do not add WebGL yet.
3. Add the canvas, the matched camera, and one plane for each project. Bind each plane to a DOM box.
4. Move the camera through those planes with scroll.
5. Add the loader and the audio choice.
6. Add the mix pass between the index and a study.
7. Add one matcap model, for one project that needs it.
8. Add one post pass: grain and a vignette.
9. Add quality tiers and reduced motion.
10. Only then add fluid, a world scene, or a custom cursor character.

If you want to start at step 10, stop.

---

## 13. Course

This course is for a front-end developer with about five years in React and TypeScript. It does not assume WebGL. Each module ends with something you can see in this repo. Do the modules in order.

A module is done when the check passes at a phone width and at 1440px, with the keyboard only.

The time budget is 5 to 10 hours each week. Modules 0 to 11 take about 14 to 18 weeks. Modules 12 to 14 are the stretch that makes the work studio-grade.

Module 0 is orientation. It does not design the final look. Visual direction waits until the exercises hold.

### Module 0 — Learn the map

**Learn.** A normal site loads a new document. This site keeps one scene and changes state. Read sections 1, 11, and 12.

**Apply.** In your own words, explain Highway, the single canvas, and the camera that matches CSS pixels. Do not write the final art direction yet.

**Done when.** You can point an agent at module 1 without a new brief.

### Module 1 — Motion in the DOM

**Learn.** A GSAP timeline, labels, `fromTo`, and stagger. Learn `power2`, `power3`, and `expo`. Learn how to stop a tween on unmount (`overwrite`, and a revert).

In your React work, a CSS transition often plays in one direction. If the pointer leaves halfway, the return trip can jump. A timeline can reverse from the current progress.

**Apply.** Nav hover: stack two labels, clip the hover line in, and draw an underline from the left. Fill a button background from the centre. If the user prefers reduced motion, jump to the end state.

**Done when.** Hover, focus-visible, and touch read as the same control. Timelines die on unmount. The layout does not shift.

### Module 2 — Type as a system

**Learn.** Two font families. Fluid size with `clamp`. Tight line height on display type. A label is uppercase grotesque. A voice line is italic serif. Respect the licence.

**Apply.** Set the case-study template. Include an eyebrow, a display line, a body measure of about 65 characters, a services row, and a figure with a caption. Use an open pair, or a pair you licensed. Do not import Neue Montreal or Saol unless you have a licence.

**Done when.** The study page looks considered with no images. Body text passes contrast. At 200% zoom, the display line does not clip.

### Module 3 — Scroll as one number

**Learn.** Why their site uses ASScroll. The wheel becomes one shared number. Install Lenis for that job. If the scroller is not the window, connect GSAP ScrollTrigger with `scrollerProxy`. Learn the difference between a scrub and a toggle.

**Apply.** Build a vertical project list. Reveal each summary once, with a short move and a short fade. Smooth the scroll with Lenis. Reduced motion uses native scroll and no scrub.

**Done when.** One store exposes the scroll position. A refresh restores the browser position without a flash of the wrong scene. The real scrollbar still works.

### Module 4 — Transitions with no WebGL

**Learn.** Highway keeps a shell and swaps an outlet. The transition has a name. In Next.js, the root layout stays mounted. A transition component can key off the pathname. Use the View Transitions API where the browser has it. Use GSAP as the fallback.

**Apply.** From the index to a study, animate the background to `project.theme.background` and animate the title. From one study to the next, do the same. Do not visit the index in between. Move focus to the `h1`.

**Done when.** The URL can be shared. The back button works. A keyboard user does not lose focus.

### Module 5 — A camera that matches the page

**Learn.** Perspective cameras, field of view, and the 1500-unit formula in section 4. Learn device pixel ratio, and why `antialias: false` is a choice.

### New term: React Three Fiber

Three.js usually lives in imperative code. You call `scene.add(mesh)`. React Three Fiber lets you write that scene as JSX. `<mesh>` is a React element that owns a Three mesh. You still need the camera math from section 4. The library does not remove it.

**Apply.** Put a fixed canvas behind the index. Create one plane for each project. Size and place it from `getBoundingClientRect` on resize and on scroll. Put an image on the plane with cover UVs. Drive the render loop from the GSAP ticker.

**Done when.** Planes sit on the DOM cards at 375px and at 1440px. A resize does not leave a stale plane. The canvas is `aria-hidden`. The DOM links still receive the click.

### Module 6 — A camera path you author

**Learn.** Map scroll progress through a list of keyframes, or through a spline. Learn `MathUtils.damp` versus a hard snap. Put the path in a GSAP timeline. Set the timeline progress from the scroll progress.

**Apply.** Give the index cards a shallow 3D layout, with small z offsets. Move the camera along a path you draw. DOM cards can fade once WebGL shows the same work. The links stay hit targets, or the planes raycast to the same href.

**Done when.** You can scrub the scroll and predict the camera. The path has a start, a middle, and an end. It does not orbit forever.

### Module 7 — Shaders you can explain

**Learn.** A fragment shader is a function of UV and time. Learn uniforms. Learn cover UVs.

Their three effects:

- A reveal is a mask driven by `u_progress`.
- Inner parallax is a UV offset.
- A peel moves `position.y` in the vertex shader by a curve of `u_progress`. It runs only above the `sm` breakpoint.

**Apply.** Write `cover.glsl`, `reveal.glsl`, and `peel.glsl` yourself. Do not paste chunks from their bundle. Drive them with the GSAP effect pattern (`name`, `extendTimeline`).

**Done when.** You can change `u_progress` from a GUI or from a timeline and predict the picture. The peel is off under 768px. The peel is off when the user prefers reduced motion.

### Module 8 — Models, matcaps, and compression

**Learn.** glTF, Draco, Meshopt, and KTX2. Learn a matcap lookup in view space. On their menu, "glass" is a material name on a cheap shader. It is not a transmission render. In Blender or Spline, apply transforms, delete hidden faces, and keep one texture set.

**Apply.** One project gets a small model that you made, or a model with a clear licence. Shade it with a matcap. Rotate it only while it is hovered or in view. Load it through the compressed pipeline.

**Done when.** You write down a size budget. Start at 1.5 MB compressed. When the model enters, the frame time moves by 2 ms or less.

### Module 9 — The gate

**Learn.** Howler sprites. A consent gate. Eyes as two lids and two pupils on a pointer angle. Do not use a face library. Cursor modes are a union type.

**Apply.** Build a loader with your own mark. Drive progress from a real asset list. Offer two actions: enter with sound, or enter with no sound. Cursor modes: default, link, drag, and hold. World grab cursors are out of scope here.

**Done when.** No sound plays before the gesture. Mute lasts for the session. Reduced motion skips the performance. `?skiploader` works.

### Module 10 — Scene transitions

**Learn.** A render target is an image the GPU paints into. A pass mixes two of those images with `u_progress` and a noise function you write. Dispose the targets on unmount.

**Apply.** During a route change, render the index and the study into textures and wipe between them. At rest, render only the active scene. Colour uniforms read `project.theme`.

**Done when.** You can pause mid-wipe and see both scenes. After the wipe, the hidden scene does not render. Fast navigation does not stack tweens.

### Module 11 — Quality and failure

**Learn.** A tier object: `{ dpr, fxaa, post, shadows, video }`. Learn `webglcontextlost` and `document.hidden`. If WebGL fails to start, the DOM is the page.

**Apply.** Implement the tiers. On context loss, show the DOM index. Do not spin. On `visibilitychange`, stop the ticker. Log frame time in dev only.

**Done when.** The portfolio is complete with WebGL disabled. An idle tab drops CPU use.

### Module 12 — One simulation

**Learn.** Pick one. Fluid: the pointer is a force in a buffer at one quarter of the viewport. Or a particle field. Learn ping-pong targets. The sim size is not the screen size. A small buffer is the point. The visible pass only reads it.

**Apply.** Use it in one place. That place is the index background, or one case study. Turn it off on the low tier. Turn it off for reduced motion.

**Done when.** You can explain the buffer size and the iteration count. If you remove the sim, navigation still works.

### Module 13 — A world, only after the rest

**Learn.** A scene you drag, fog, one reflective surface, and a repeated motif such as grass. A grab cursor. A sound loop that plays only on this route.

**Apply.** Add `/world` as a reward. It is not the home page. The intro line is yours.

**Done when.** When the route changes, you dispose the reflector and stop the loop. The home page is still as fast as it was in module 11.

### Module 14 — Case studies

Do the visual direction at the start of this module, not in module 0. Write `docs/art-direction.md`. Include the audience, three feelings that are not "make it like Unseen", the type pair, the palette (ink, paper, one signal colour), and the real projects. Pick two projects for full studies. Pick four for the index.

**Learn.** Their study rhythm: context, role, constraints, trials, outcome, and next. Learn crops, video posters, captions, and a quiet credit line.

**Apply.** Write two full studies and an index of the rest. Each study has a process section with real artifacts. Include a sketch, a rejected direction, and a performance note. Check keyboard, 200% zoom, reduced motion, and a mid-tier phone.

**Done when.** A stranger can tell what you did, what was hard, and what you would redo. You do not need to be in the room.

### How to practise

- Keep a `studies/` route for shader trials. Move a trial into the main scene only when it has an off switch.
- Record 10 seconds of each transition. Watch it frame by frame once.
- Write the uniform list at the top of each shader. If you cannot say why a uniform exists, delete it.
- Review on a phone after every module. Their bend is already off there. Design for that width. Do not crop a desktop scene and hope.

### References

- Three.js manual, for the camera, textures, and render targets: https://threejs.org/manual/
- React Three Fiber: https://r3f.docs.pmnd.rs
- GSAP and ScrollTrigger: https://gsap.com/docs/v3/
- Lenis: https://github.com/darkroomengineering/lenis
- Troika three-text, only if a headline must bend: https://github.com/protectwise/troika
- glTF compression: https://github.com/zeux/meshoptimizer and Khronos KTX
- Unseen method articles (**studio practice**, other projects): [Symphony of Vines](https://unread.unseen.co/the-symphony-of-vines-dev-insights-c284cc4e8aa0), [Convex seascape](https://unread.unseen.co/insights-convex-seascape-survey-4b64f2cff88b)
- A public thread on their scroll scene. It matches the bundle. Scroll sets the camera and the uniforms. It does not scrub a video: https://discourse.threejs.org/t/how-is-the-scrolling-animation-implemented-on-the-unseen-studio-website/87789

---

## 14. Still open

Do not block the exercises on these items.

1. Will the type pair be licensed, or open? Default: open fonts until art direction starts.
2. Is a draggable world in version 1? Default: no. It is module 13, after the quality tier.
3. Is there a deadline, a domain, or a hosting limit? None was given.

Already locked at the top of this file: CSS-level motion only, 5 to 10 hours a week, Next.js, exercises before art direction, existing front-end work, and a personal site whose craft should stand out.
