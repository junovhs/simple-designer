# Simple Designer

*A lean, modular, web-native cockpit for everyday pro design.*

> **Mantra:** Subtract until elegant. Ship bricks, not buildings. Keep it fast, simple, and yours.

---

## Why Simple Designer

**I want a tool that feels like home for daily production—not a cathedral.**

* I need to make banners, icons, small layouts, and exports quickly.
* I don’t want subscriptions or heavyweight stacks.
* I want **~90% of pro features** I actually use, delivered simply.
* I want it **web‑native**, offline‑friendly, and modular so I can iterate in small passes.

**Goal:** A focused cockpit that treats images and vectors as peers, respects my time, and never punishes me for opening it.

**Promise to self:** If it grows heavy, I cut it. If it grows noisy, I quiet it. If it grows confusing, I simplify it.

---

## Feelings, Taste, and Product Stance

* **Speed is respect.** If it’s slow, it’s rude. Every action should *feel* immediate.
* **Low cognitive overhead.** The UI should read like a tidy bench, not a control room.
* **Trust by transparency.** Clear states, obvious handles, visible layers, predictable transforms.
* **Right-sized ambition.** Not a “killer of X.” A compact, opinionated daily companion.
* **Quiet power.** Smart defaults, crisp affordances, zero ceremony.
* **No bloat.** Add only what reduces total complexity.
* **Ownable craft.** Proprietary code, free to use forever; I choose the pace and direction.
* **Hands stay on canvas.** Menus exist, but flow lives in the workspace.
* **Tasteful restraint.** When in doubt, choose less chrome and more clarity.

---

## What This Is / What This Isn’t

**Is:**

* A **vanilla HTML/JS/SVG/Canvas** design cockpit.
* **Module-first**, each brick independent, 100–300 lines whenever possible.
* **Affinity-ish** in flow: Node tool feel, artboards, an Export persona vibe.
* **Raster + vector** layered together, non-destructive where sensible.
* **Local-first** by default; files live with me.

**Isn’t:**

* A full DCC suite.
* A component-driven framework project.
* A complex plugin ecosystem.
* A beginners’ tutorial tool; it’s for **working designers**.
* A place for novelty UI experiments that add friction.

---

## Guiding Principles

1. **Law of Least Power:** Choose the simplest tool that can do the job.
2. **Everything optional:** If a feature isn’t used weekly, it probably doesn’t belong.
3. **Single-responsibility modules:** Small bricks, clean interfaces.
4. **Sane defaults > settings:** Fewer knobs, better preconceived decisions.
5. **Performance is a feature:** 60FPS targets, no jank.
6. **Refactor ruthlessly:** If it gets messy, pull it apart and simplify.
7. **Write it so future-me smiles.**
8. **Observable states:** The app should always tell me what’s selected, where I am, and what will happen.
9. **Undo is sacred:** Every change should be confidently reversible.
10. **Finish small things completely:** Many finished pebbles beat one unfinished boulder.

---

## Development Philosophy: Visual-First, Modular Always

**The method:**

1. **Visual first.** I mock the whole app *visually*—a calm cockpit with all major regions present. No interactivity, no wiring, just shaped space.
2. **Breathe life into pieces.** I animate one region at a time with tiny, focused modules. Each module is shippable on its own.
3. **Big → small passes.** I sweep across the entire app in broad strokes, then again in smaller strokes, again smaller still—until any tool I click feels considered.
4. **Stop when it’s good enough.** This is an *endless cycle*; I can pause at any level of detail and still have a coherent, useful tool.

**Why this works for me:**

* It matches how designers iterate on canvases: block in, refine, polish.
* It prevents local over-investment; I revisit everything regularly.
* It keeps complexity low because each pass removes rough edges rather than adding knobs.
* It’s resilient to time: I can do a 30-minute pass or a 3-day pass and move forward either way.

---

## The Big-to-Small Cycle (Phased Detail)

> **Cycle mantra:** Broad pass across the whole app → rest → narrower pass → rest → polish pass.

### Pass 0 — Framing (The Empty Room)

* Draft the **static cockpit**: left tools, top toolbars, infinite canvas center, right properties/layers, bottom status.
* Lock **type scale** and **spacing rhythm**. Choose tokens (colors, border radii, shadow heights) that keep things legible.
* Keep it inert: no listeners, no animations, no false promises.
* **Exit criteria:** I can take a screenshot and it reads like a real app at a glance.

### Pass 1 — Broad Strokes (Everything Moves a Little)

* **Canvas Viewport** breathes: pan, zoom, rulers tick at 10/50.
* **Artboards** exist: create, resize, rename; drag-in image → auto artboard.
* **Selection & Transforms**: click-select, marquee, 8 handles, numeric fields mirror x/y/w/h.
* **Shapes**: rectangle/ellipse, fill/stroke.
* **Typography**: basic text box, system fonts, tracking/leading sliders (visual only if needed).
* **Status Bar**: cursor coords, zoom percent, snap indicator.
* **Exit criteria:** The app is usable for a simple banner with one artboard.

### Pass 2 — Medium Strokes (Edges Get Sharp)

* **Alignment suite**: to selection or artboard; distribute spacing.
* **Snap pass**: grid, guides, pixel; snapping feels helpful not bossy.
* **Layers & Masks**: reorder, lock/hide, simple mask group.
* **Colors**: HSL sliders feel coherent; swatches behave; opacity is obvious.
* **Effects**: tasteful drop shadow; basic linear gradient with two stops.
* **Exports**: one-click PNG/SVG of an artboard; predictable file names.
* **Exit criteria:** I can build a two‑artboard social set and export variants calmly.

### Pass 3 — Fine Strokes (Friction Removal)

* **Refine transforms**: rotation handles feel clean; numeric fields don’t drift.
* **Text niceties**: baseline alignment feels right; selection handles don’t lie.
* **Gradient nodes**: two becomes three; handles are readable at all zooms.
* **Smoothing & performance**: pan/zoom steady at 60FPS on mid hardware.
* **Export persona**: slices from selections; 1×/2× sanity checks.
* **Exit criteria:** Nothing obviously rough; I can recommend it to a peer for daily small tasks.

### Pass 4 — Polish and Posture (Optional, On Taste)

* **Microcopy**: labels are friendlier; tooltips are plain not cute.
* **A11y**: focus rings, keyboard reachability, reduced‑motion considerations.
* **Aesthetic trims**: spacing nits, multi-theme crispness, visual balance.
* **Exit criteria:** It feels like an instrument, not a prototype.

---

## Work Order, Rephrased

* **Big picture first** (mock the whole cockpit), then **small truths everywhere** (light up each region).
* **Sweep the whole surface** at each level of detail—do not build a single area to completion while others stagnate.
* **Stop comfortably** at any time; the app remains coherent.

---

## User & Use Cases

* **Primary user:** Pros and advanced enthusiasts making fast, high-quality assets.
* **Scenarios I care about:**

  * Make three hero banners in two sizes, each with an image, headline, and CTA.
  * Create a set of social tiles with consistent typography and shadows.
  * Draw a simple icon set with pixel-snapped vectors and export as SVG.
  * Combine a photo with vector overlays; gradient mask for depth; export PNG.

**Success looks like:** Minimal clicking, predictable results, zero fear of export.

---

## Experience North Star

* **Open to usable canvas** in one heartbeat.
* **Selection, then intent.** Tools serve selection; properties reflect context.
* **Minimum surprise.** Integrate common design idioms, avoid novelty.
* **Flow over density.** Less chrome, more work.
* **State at a glance.** Layers, artboard bounds, active tool, transform handles.
* **Nothing is more than two moves away.** If it is, rethink.

---

## Performance & Footprint

* **Bundle ceiling:** < 500 KB (gz/brotli) for the core shell + minimum bricks.
* **Target hardware:** Mid-range laptop; 4K canvas; ~50 layers; 60FPS pan/zoom.
* **Runtime discipline:**

  * 0 third-party UI frameworks.
  * No heavy runtime state engines.
  * Avoid layout thrash; prefer transforms.
  * Only compute on interaction; lazy everything else.
* **Budgeting:** Every module declares a byte budget, a redraw budget, and a complexity budget.

---

## The Module Way

* **Shape:** 100–300 lines when possible; split when cramped.
* **Scope:** One purpose. If it needs two toggles and a helper, okay. If it needs a router, no.
* **Surface:** A tiny set of events and a small patch of DOM.
* **Swapability:** I should be able to rip a module out without a cascade of edits.
* **Graceful absence:** If a module is missing, the app still boots and remains honest.

**Module kinds (examples):**

* View: canvas viewport, rulers, grid.
* Edit: selection, transform handles, node tool.
* Paint: color HSL, gradient editor, transparency mask.
* Shape: rectangle, ellipse, text.
* Ops: alignment, distribute, snap policy.
* IO: artboard manager, exports, clipboard.
* HUD: status bar, coordinates, zoom readout.

---

## Order of Modules (First Season)

1. **M00 — Static Cockpit Skeleton** (inert, beautiful, legible)
2. **M01 — Canvas Viewport** (pan, zoom, rulers, grid)
3. **M02 — Artboards** (image→artboard; resize; rename)
4. **M03 — Selection & Transforms** (8 handles; x/y/w/h/r)
5. **M04 — Shapes** (rect, ellipse; stroke/fill)
6. **M05 — Typography** (system fonts; tracking/leading)
7. **M06 — Colors** (HSL; opacity; swatches)
8. **M07 — Alignment** (to artboard/selection; distribute)
9. **M08 — Layers & Masks** (stack; lock/hide; mask group)
10. **M09 — Effects** (shadow; linear gradient; transparency)
11. **M10 — Exports** (slices; PNG/SVG/PDF; naming patterns)
12. **M11 — Quality Sweep** (a11y; perf; small delights)

Each module is shippable alone, demoable alone, and refactorable alone.

---

## Definitions of Done (Per Module)

* **Has a purpose** written in one sentence.
* **Has a demo** scenario I can perform in under 2 minutes.
* **Has a byte budget** and meets it.
* **Has a performance sniff test** and passes it.
* **Has no secrets:** states are visible or logged.
* **Leaves the code cleaner** than before.

---

## Simplicity Guardrails

* Prefer a constant over a setting.
* Prefer a visible control over a hidden menu.
* Prefer one good default over three weak options.
* Prefer subtraction over invention.
* Prefer reading code over reading docs.

If a feature requires a long explanation, it’s either too early or not a fit.

---

## Naming, Copy, and Tone

* **Labels:** short and literal (e.g., *Blur*, *Offset*, *Opacity*).
* **Tooltips:** helpful, not cute.
* **Errors:** plain language, quiet colors.
* **Status:** declarative, not chatty (e.g., *Zoom 100%*, *Snap Off*).

---

## Keyboard Philosophy

* **Direct:** V (Move), A (Node), P (Pen), T (Text), Z (Zoom), Space (Hand).
* **Conventional:** Ctrl/Cmd+Z, Shift+Ctrl/Cmd+Z for redo.
* **Precise:** Arrows nudge; Shift for 10×.
* **Respect muscle memory:** Don’t fight established patterns.

---

## Color & Type Philosophy

* **HSL-first:** hue, saturation, lightness; opacity is a sibling, not a secret.
* **Readable sliders:** numbers and handles that don’t wiggle.
* **Text focus:** tracking and leading are obvious; the baseline behaves.
* **Contrast discipline:** never gray-on-gray; dark mode remains crisp.

---

## Layers & Non-Destructive Editing

* **Everything is a layer.**
* **Masks are just groups** with special affordances.
* **Visibility/lock are fast.** Icons tell the truth.
* **Edits are reversible.** Destructive ops must be explicit.

---

## Exports (Persona-Inspired)

* **Slices live with artboards.**
* **Naming patterns:** `{artboard}-{slice}-{w}x{h}`.
* **Targets:** PNG, SVG, PDF.
* **Scales:** 1× first, 2× second, custom last.
* **Predictability over knobs.** Less is more.

---

## Persistence & Privacy

* **Local-first.** No cloud unless asked.
* **Respect storage limits.** Don’t hoard caches.
* **Import essentials:** PNG, JPG, SVG now; more later only if light.

---

## Offline & PWA

* **Boot offline.**
* **Cache the core.**
* **Never trap the user:** if storage runs out, say it and recover.

---

## Accessibility & Inclusivity

* **Keyboard reachable** surfaces.
* **Reasonable targets** for touch and mouse.
* **Motion-respectful** animations; prefer none by default.
* **Readable sizes** without custom scaling.

---

## Quality Rhythm

* **Before starting a new module, tidy the last one.**
* **Delete dead code on sight.**
* **Measure once per pass:** FPS, bytes, and perceived latency.
* **Keep a punch list** and burn it down weekly.

---

## Complexity Budget

* **Bytes:** under 500 KB total for the initial season.
* **Cognitive:** no feature should require reading a wiki.
* **DOM:** prefer fewer nodes; reuse where possible.

If a change exceeds budget, re-scope until it fits.

---

## Risks and Mitigations

* **Performance creep** → Guard with budgets, profile early.
* **Scope creep** → The 90% rule protects me; the icebox holds the rest.
* **Browser quirks** → Test Chromium/Firefox/Safari on each pass.
* **Complexity drift** → Refactor rhythm + module size limits.

---

## Personal Rules of Thumb

* Ship something small before lunch.
* If I can’t explain it in a sentence, it’s not ready.
* Make the default path obvious; let power users discover depth.
* Re-read this README when I feel wobbly.

---

## The Visual-First Pledge

* I design the cockpit at a glance. I do not chase pixel-perfect fantasy.
* I trust quick mockups to flush taste decisions early.
* I let real usage guide polish, not vice versa.

---

## The Endless Cycle (How I’ll Work Week to Week)

1. **Monday:** Sketch a broad pass across the whole surface (mock or refine).
2. **Midweek:** Light up 1–2 modules that most improve daily use.
3. **Friday:** Small polish pass; remove papercuts; write down the next broad issues.
4. **Weekend (optional):** Play; try ideas in an isolated branch; keep or toss.

**Output each week:** a calmer tool.

---

## Stop Rules (When to Pause a Thread)

* When finishing it would cost more clarity than it adds.
* When polishing hides that I need to rethink a bigger shape.
* When the budget says no and the joy says later.

I can stop any time and still have a working instrument.

---

## A Note on Taste

* Sharp type, soft corners, real shadows (not fog).
* Iconography hints, not cartoons.
* A palette that helps content shine: UI colors are neutrals; artwork carries color.

---

## Communication With Myself

* Keep commit messages like journal entries.
* Write tiny module READMEs with purpose, scope, and a short demo script.
* When the app feels muddy, write—then cut.

---

## Mini Checklists (Fast Confidence)

**Viewport:** pan 60FPS, zoom to cursor, rulers tick true.

**Artboards:** name, resize, export; snapping doesn’t surprise.

**Transforms:** handles match numbers; rotation feels anchored.

**Type:** text boxes drag well; tracking/leading are legible.

**Color:** HSL makes sense; swatch squares speak first.

**Effects:** shadow reads at 1×; gradients don’t wobble.

**Exports:** filenames are sane; SVG is clean; PDF prints right.

---

## Icebox (Maybe Someday, Maybe Never)

* Eyedropper (post-M06) if footprint allows.
* Radial gradients (after linear is delightful).
* Smart distribute spacing editor.
* Quick social templates.
* Color styles library (if it stays light).
* Asset symbols (only if they don’t require a framework brain).

---

## FAQ

**Why not React/Vue?**
Law of Least Power. I want speed, legibility, and ownership.

**Will it sync to cloud?**
Local-first; optional cloud later if it stays respectful.

**Is it a Figma replacement?**
No. Different job. This is a personal production cockpit.

**Will there be plugins?**
Not now. Internal modules keep scope tight.

**What about team features?**
Out of scope for the first season.

---

## License & Use

**Proprietary. Free to use forever.** I own direction, pace, and code. You keep your files.

---

## Appendix — Working Notes Template

```
# Week <N>

## Broad Observations
- What felt smooth?
- What felt heavy?

## Module Focus
- <Module Name>: purpose this week
- Acceptance notes

## Budgets
- Bytes: <number>
- FPS: <observation>

## Next Pass
- Three broad things to sweep
```

---

## Closing

Simple Designer is a promise to future-me: a small, fast, friendly instrument that respects my time and taste. I will build it visually first, breathe life into it brick by brick, and work in broad-to-fine passes across the whole surface until it feels good enough to stop.

# Simple Designer

*A lean, modular, web-native cockpit for everyday pro design.*

> **Mantra:** Subtract until elegant. Ship bricks, not buildings. Keep it fast, simple, and yours.

---

## Why Simple Designer

**I want a tool that feels like home for daily production—not a cathedral.**

* I need to make banners, icons, small layouts, and exports quickly.
* I don’t want subscriptions or heavyweight stacks.
* I want **~90% of pro features** I actually use, delivered simply.
* I want it **web‑native**, offline‑friendly, and modular so I can iterate in small passes.

**Goal:** A focused cockpit that treats images and vectors as peers, respects my time, and never punishes me for opening it.

**Promise to self:** If it grows heavy, I cut it. If it grows noisy, I quiet it. If it grows confusing, I simplify it.

---

## Feelings, Taste, and Product Stance

* **Speed is respect.** If it’s slow, it’s rude. Every action should *feel* immediate.
* **Low cognitive overhead.** The UI should read like a tidy bench, not a control room.
* **Trust by transparency.** Clear states, obvious handles, visible layers, predictable transforms.
* **Right-sized ambition.** Not a “killer of X.” A compact, opinionated daily companion.
* **Quiet power.** Smart defaults, crisp affordances, zero ceremony.
* **No bloat.** Add only what reduces total complexity.
* **Ownable craft.** Proprietary code, free to use forever; I choose the pace and direction.
* **Hands stay on canvas.** Menus exist, but flow lives in the workspace.
* **Tasteful restraint.** When in doubt, choose less chrome and more clarity.

---

## What This Is / What This Isn’t

**Is:**

* A **vanilla HTML/JS/SVG/Canvas** design cockpit.
* **Module-first**, each brick independent, 100–300 lines whenever possible.
* **Affinity-ish** in flow: Node tool feel, artboards, an Export persona vibe.
* **Raster + vector** layered together, non-destructive where sensible.
* **Local-first** by default; files live with me.

**Isn’t:**

* A full DCC suite.
* A component-driven framework project.
* A complex plugin ecosystem.
* A beginners’ tutorial tool; it’s for **working designers**.
* A place for novelty UI experiments that add friction.

---

## Guiding Principles

1. **Law of Least Power:** Choose the simplest tool that can do the job.
2. **Everything optional:** If a feature isn’t used weekly, it probably doesn’t belong.
3. **Single-responsibility modules:** Small bricks, clean interfaces.
4. **Sane defaults > settings:** Fewer knobs, better preconceived decisions.
5. **Performance is a feature:** 60FPS targets, no jank.
6. **Refactor ruthlessly:** If it gets messy, pull it apart and simplify.
7. **Write it so future-me smiles.**
8. **Observable states:** The app should always tell me what’s selected, where I am, and what will happen.
9. **Undo is sacred:** Every change should be confidently reversible.
10. **Finish small things completely:** Many finished pebbles beat one unfinished boulder.

---

## Development Philosophy: Visual-First, Modular Always

**The method:**

1. **Visual first.** I mock the whole app *visually*—a calm cockpit with all major regions present. No interactivity, no wiring, just shaped space.
2. **Breathe life into pieces.** I animate one region at a time with tiny, focused modules. Each module is shippable on its own.
3. **Big → small passes.** I sweep across the entire app in broad strokes, then again in smaller strokes, again smaller still—until any tool I click feels considered.
4. **Stop when it’s good enough.** This is an *endless cycle*; I can pause at any level of detail and still have a coherent, useful tool.

**Why this works for me:**

* It matches how designers iterate on canvases: block in, refine, polish.
* It prevents local over-investment; I revisit everything regularly.
* It keeps complexity low because each pass removes rough edges rather than adding knobs.
* It’s resilient to time: I can do a 30-minute pass or a 3-day pass and move forward either way.

---

## The Big-to-Small Cycle (Phased Detail)

> **Cycle mantra:** Broad pass across the whole app → rest → narrower pass → rest → polish pass.

### Pass 0 — Framing (The Empty Room)

* Draft the **static cockpit**: left tools, top toolbars, infinite canvas center, right properties/layers, bottom status.
* Lock **type scale** and **spacing rhythm**. Choose tokens (colors, border radii, shadow heights) that keep things legible.
* Keep it inert: no listeners, no animations, no false promises.
* **Exit criteria:** I can take a screenshot and it reads like a real app at a glance.

### Pass 1 — Broad Strokes (Everything Moves a Little)

* **Canvas Viewport** breathes: pan, zoom, rulers tick at 10/50.
* **Artboards** exist: create, resize, rename; drag-in image → auto artboard.
* **Selection & Transforms**: click-select, marquee, 8 handles, numeric fields mirror x/y/w/h.
* **Shapes**: rectangle/ellipse, fill/stroke.
* **Typography**: basic text box, system fonts, tracking/leading sliders (visual only if needed).
* **Status Bar**: cursor coords, zoom percent, snap indicator.
* **Exit criteria:** The app is usable for a simple banner with one artboard.

### Pass 2 — Medium Strokes (Edges Get Sharp)

* **Alignment suite**: to selection or artboard; distribute spacing.
* **Snap pass**: grid, guides, pixel; snapping feels helpful not bossy.
* **Layers & Masks**: reorder, lock/hide, simple mask group.
* **Colors**: HSL sliders feel coherent; swatches behave; opacity is obvious.
* **Effects**: tasteful drop shadow; basic linear gradient with two stops.
* **Exports**: one-click PNG/SVG of an artboard; predictable file names.
* **Exit criteria:** I can build a two‑artboard social set and export variants calmly.

### Pass 3 — Fine Strokes (Friction Removal)

* **Refine transforms**: rotation handles feel clean; numeric fields don’t drift.
* **Text niceties**: baseline alignment feels right; selection handles don’t lie.
* **Gradient nodes**: two becomes three; handles are readable at all zooms.
* **Smoothing & performance**: pan/zoom steady at 60FPS on mid hardware.
* **Export persona**: slices from selections; 1×/2× sanity checks.
* **Exit criteria:** Nothing obviously rough; I can recommend it to a peer for daily small tasks.

### Pass 4 — Polish and Posture (Optional, On Taste)

* **Microcopy**: labels are friendlier; tooltips are plain not cute.
* **A11y**: focus rings, keyboard reachability, reduced‑motion considerations.
* **Aesthetic trims**: spacing nits, multi-theme crispness, visual balance.
* **Exit criteria:** It feels like an instrument, not a prototype.

---

## Work Order, Rephrased

* **Big picture first** (mock the whole cockpit), then **small truths everywhere** (light up each region).
* **Sweep the whole surface** at each level of detail—do not build a single area to completion while others stagnate.
* **Stop comfortably** at any time; the app remains coherent.

---

## User & Use Cases

* **Primary user:** Pros and advanced enthusiasts making fast, high-quality assets.
* **Scenarios I care about:**

  * Make three hero banners in two sizes, each with an image, headline, and CTA.
  * Create a set of social tiles with consistent typography and shadows.
  * Draw a simple icon set with pixel-snapped vectors and export as SVG.
  * Combine a photo with vector overlays; gradient mask for depth; export PNG.

**Success looks like:** Minimal clicking, predictable results, zero fear of export.

---

## Experience North Star

* **Open to usable canvas** in one heartbeat.
* **Selection, then intent.** Tools serve selection; properties reflect context.
* **Minimum surprise.** Integrate common design idioms, avoid novelty.
* **Flow over density.** Less chrome, more work.
* **State at a glance.** Layers, artboard bounds, active tool, transform handles.
* **Nothing is more than two moves away.** If it is, rethink.

---

## Performance & Footprint

* **Bundle ceiling:** < 500 KB (gz/brotli) for the core shell + minimum bricks.
* **Target hardware:** Mid-range laptop; 4K canvas; ~50 layers; 60FPS pan/zoom.
* **Runtime discipline:**

  * 0 third-party UI frameworks.
  * No heavy runtime state engines.
  * Avoid layout thrash; prefer transforms.
  * Only compute on interaction; lazy everything else.
* **Budgeting:** Every module declares a byte budget, a redraw budget, and a complexity budget.

---

## The Module Way

* **Shape:** 100–300 lines when possible; split when cramped.
* **Scope:** One purpose. If it needs two toggles and a helper, okay. If it needs a router, no.
* **Surface:** A tiny set of events and a small patch of DOM.
* **Swapability:** I should be able to rip a module out without a cascade of edits.
* **Graceful absence:** If a module is missing, the app still boots and remains honest.

**Module kinds (examples):**

* View: canvas viewport, rulers, grid.
* Edit: selection, transform handles, node tool.
* Paint: color HSL, gradient editor, transparency mask.
* Shape: rectangle, ellipse, text.
* Ops: alignment, distribute, snap policy.
* IO: artboard manager, exports, clipboard.
* HUD: status bar, coordinates, zoom readout.

---

## Order of Modules (First Season)

1. **M00 — Static Cockpit Skeleton** (inert, beautiful, legible)
2. **M01 — Canvas Viewport** (pan, zoom, rulers, grid)
3. **M02 — Artboards** (image→artboard; resize; rename)
4. **M03 — Selection & Transforms** (8 handles; x/y/w/h/r)
5. **M04 — Shapes** (rect, ellipse; stroke/fill)
6. **M05 — Typography** (system fonts; tracking/leading)
7. **M06 — Colors** (HSL; opacity; swatches)
8. **M07 — Alignment** (to artboard/selection; distribute)
9. **M08 — Layers & Masks** (stack; lock/hide; mask group)
10. **M09 — Effects** (shadow; linear gradient; transparency)
11. **M10 — Exports** (slices; PNG/SVG/PDF; naming patterns)
12. **M11 — Quality Sweep** (a11y; perf; small delights)

Each module is shippable alone, demoable alone, and refactorable alone.

---

## Definitions of Done (Per Module)

* **Has a purpose** written in one sentence.
* **Has a demo** scenario I can perform in under 2 minutes.
* **Has a byte budget** and meets it.
* **Has a performance sniff test** and passes it.
* **Has no secrets:** states are visible or logged.
* **Leaves the code cleaner** than before.

---

## Simplicity Guardrails

* Prefer a constant over a setting.
* Prefer a visible control over a hidden menu.
* Prefer one good default over three weak options.
* Prefer subtraction over invention.
* Prefer reading code over reading docs.

If a feature requires a long explanation, it’s either too early or not a fit.

---

## Naming, Copy, and Tone

* **Labels:** short and literal (e.g., *Blur*, *Offset*, *Opacity*).
* **Tooltips:** helpful, not cute.
* **Errors:** plain language, quiet colors.
* **Status:** declarative, not chatty (e.g., *Zoom 100%*, *Snap Off*).

---

## Keyboard Philosophy

* **Direct:** V (Move), A (Node), P (Pen), T (Text), Z (Zoom), Space (Hand).
* **Conventional:** Ctrl/Cmd+Z, Shift+Ctrl/Cmd+Z for redo.
* **Precise:** Arrows nudge; Shift for 10×.
* **Respect muscle memory:** Don’t fight established patterns.

---

## Color & Type Philosophy

* **HSL-first:** hue, saturation, lightness; opacity is a sibling, not a secret.
* **Readable sliders:** numbers and handles that don’t wiggle.
* **Text focus:** tracking and leading are obvious; the baseline behaves.
* **Contrast discipline:** never gray-on-gray; dark mode remains crisp.

---

## Layers & Non-Destructive Editing

* **Everything is a layer.**
* **Masks are just groups** with special affordances.
* **Visibility/lock are fast.** Icons tell the truth.
* **Edits are reversible.** Destructive ops must be explicit.

---

## Exports (Persona-Inspired)

* **Slices live with artboards.**
* **Naming patterns:** `{artboard}-{slice}-{w}x{h}`.
* **Targets:** PNG, SVG, PDF.
* **Scales:** 1× first, 2× second, custom last.
* **Predictability over knobs.** Less is more.

---

## Persistence & Privacy

* **Local-first.** No cloud unless asked.
* **Respect storage limits.** Don’t hoard caches.
* **Import essentials:** PNG, JPG, SVG now; more later only if light.

---

## Offline & PWA

* **Boot offline.**
* **Cache the core.**
* **Never trap the user:** if storage runs out, say it and recover.

---

## Accessibility & Inclusivity

* **Keyboard reachable** surfaces.
* **Reasonable targets** for touch and mouse.
* **Motion-respectful** animations; prefer none by default.
* **Readable sizes** without custom scaling.

---

## Quality Rhythm

* **Before starting a new module, tidy the last one.**
* **Delete dead code on sight.**
* **Measure once per pass:** FPS, bytes, and perceived latency.
* **Keep a punch list** and burn it down weekly.

---

## Complexity Budget

* **Bytes:** under 500 KB total for the initial season.
* **Cognitive:** no feature should require reading a wiki.
* **DOM:** prefer fewer nodes; reuse where possible.

If a change exceeds budget, re-scope until it fits.

---

## Risks and Mitigations

* **Performance creep** → Guard with budgets, profile early.
* **Scope creep** → The 90% rule protects me; the icebox holds the rest.
* **Browser quirks** → Test Chromium/Firefox/Safari on each pass.
* **Complexity drift** → Refactor rhythm + module size limits.

---

## Personal Rules of Thumb

* Ship something small before lunch.
* If I can’t explain it in a sentence, it’s not ready.
* Make the default path obvious; let power users discover depth.
* Re-read this README when I feel wobbly.

---

## The Visual-First Pledge

* I design the cockpit at a glance. I do not chase pixel-perfect fantasy.
* I trust quick mockups to flush taste decisions early.
* I let real usage guide polish, not vice versa.

---

## The Endless Cycle (How I’ll Work Week to Week)

1. **Monday:** Sketch a broad pass across the whole surface (mock or refine).
2. **Midweek:** Light up 1–2 modules that most improve daily use.
3. **Friday:** Small polish pass; remove papercuts; write down the next broad issues.
4. **Weekend (optional):** Play; try ideas in an isolated branch; keep or toss.

**Output each week:** a calmer tool.

---

## Stop Rules (When to Pause a Thread)

* When finishing it would cost more clarity than it adds.
* When polishing hides that I need to rethink a bigger shape.
* When the budget says no and the joy says later.

I can stop any time and still have a working instrument.

---

## A Note on Taste

* Sharp type, soft corners, real shadows (not fog).
* Iconography hints, not cartoons.
* A palette that helps content shine: UI colors are neutrals; artwork carries color.

---

## Communication With Myself

* Keep commit messages like journal entries.
* Write tiny module READMEs with purpose, scope, and a short demo script.
* When the app feels muddy, write—then cut.

---

## Mini Checklists (Fast Confidence)

**Viewport:** pan 60FPS, zoom to cursor, rulers tick true.

**Artboards:** name, resize, export; snapping doesn’t surprise.

**Transforms:** handles match numbers; rotation feels anchored.

**Type:** text boxes drag well; tracking/leading are legible.

**Color:** HSL makes sense; swatch squares speak first.

**Effects:** shadow reads at 1×; gradients don’t wobble.

**Exports:** filenames are sane; SVG is clean; PDF prints right.

---

## Icebox (Maybe Someday, Maybe Never)

* Eyedropper (post-M06) if footprint allows.
* Radial gradients (after linear is delightful).
* Smart distribute spacing editor.
* Quick social templates.
* Color styles library (if it stays light).
* Asset symbols (only if they don’t require a framework brain).

---

## FAQ

**Why not React/Vue?**
Law of Least Power. I want speed, legibility, and ownership.

**Will it sync to cloud?**
Local-first; optional cloud later if it stays respectful.

**Is it a Figma replacement?**
No. Different job. This is a personal production cockpit.

**Will there be plugins?**
Not now. Internal modules keep scope tight.

**What about team features?**
Out of scope for the first season.

---

## License & Use

**Proprietary. Free to use forever.** I own direction, pace, and code. You keep your files.

---

## Appendix — Working Notes Template

```
# Week <N>

## Broad Observations
- What felt smooth?
- What felt heavy?

## Module Focus
- <Module Name>: purpose this week
- Acceptance notes

## Budgets
- Bytes: <number>
- FPS: <observation>

## Next Pass
- Three broad things to sweep
```

---

## Closing

Simple Designer is a promise to future-me: a small, fast, friendly instrument that respects my time and taste. I will build it visually first, breathe life into it brick by brick, and work in broad-to-fine passes across the whole surface until it feels good enough to stop.
