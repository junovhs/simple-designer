# Simple Designer: A Modular, Browser-Native Vector Cockpit

![Simple Designer UI Screenshot](https://via.placeholder.com/1200x800?text=Simple+Designer+Cockpit)  
*(Replace with actual screenshot: Grid layout with tools left, toolbar top, infinite canvas center, props right, dock bottom. Demo blue rect in canvas.)*

## 🚀 Overview & Goals
**Simple Designer** is a free, forever-open-for-use (proprietary code) browser-based design tool that delivers ~90% of what a professional UI/graphic designer needs for daily workflows—think quick banners, icons, layouts, and exports—without the bloat of Affinity Designer or Adobe's subs. It's not a full killer app; it's a lean "cockpit" for pros like you: Drag an image to start an artboard, layer vectors/raster, tweak with HSL colors/kerning/gradients/shadows, align/transform, and batch-export PNG/SVG/PDF. Inspired by Affinity's Node Tool + Export Persona, but web-native and modular for iterative AI-assisted builds.

### Core Philosophy (Law of Least Power)
- **Minimalism First**: Vanilla JS/HTML/SVG/Canvas only—no React/Vue/Angular bloat. Bundle <500KB, 60FPS on mid-range hardware (4k effective canvas, 50 layers).
- **Modular Bricks**: Build/test in isolation (one chat/module). Drop into `/pages/cat.*/`—runtime scan auto-wires via events/store. No glue code; each ~100-300 lines.
- **Unified Cockpit**: Full-screen Affinity-like UI (no browser chrome): Tools panel (left), toolbar (top), infinite canvas (center), properties (right), layers/effects dock (bottom). PWA for offline.
- **AI-Driven Dev**: You're the architect; I (Grok) implement. Iterative: "Nail scaffold" → "Build artboard brick" → Deploy/test. Philosophy from chats: Subtract until elegant; emulate smooth tools like Lovart/SVG Path Editor without straying.
- **Monetization Dream**: Free forever → Viral (Reddit/HN shares) → Poach Adobe/Affinity users → $100k buyout offer (kill clause OK). Track "Adobe refugees" via analytics.

### MVP Scope (90% Pro Needs)
From your Affinity workflow:
- Infinite canvas/artboards (image drag → auto-rect).
- Typography: System fonts, kerning/tracking/leading.
- Alignment: H/V suite to last selected/artboard.
- Layers/masks: Vector/raster mix, non-destructive.
- Colors: HSL stroke/fill, eyedropper.
- Effects: Drop shadow, gradients (nodes), transparency (alpha gradient automask).
- Shapes: Circles/quads.
- Transforms: x/y/w/h/r/s, 8-point handles, pixel-snap.
- Exports: Artboard slices, PNG/SVG/PDF batch (Affinity Persona-style).

Launch when: All 12 modules integrated, 50-layer perf, end-to-end flow (image → export). See [Module Spec](#module-spec) below.

## 🏗️ Architecture
Adapted from Sporebench (runtime introspection, no build-time manifest). Philosophy: Agility > Scale—add module, push, live.

### Key Components
- **Shell (index.html + assets/app.js)**: CSS Grid cockpit layout. Global `bus` (CustomEvent pub/sub for hooks like 'toolSelect', 'shapeAdded'). `store` (simple state: selected/layers/artboards/viewBox; localStorage + 50-step undo/redo).
- **Manifest (/api/nav.js)**: Vercel serverless—scans `/pages/` for `cat.*` folders/subdirs with `index.html`. Outputs JSON: `{ cats: [{ name: "Canvas", modules: [{ id: "infinite-canvas", path: "...", slots: ["#canvas-center"], hooks: ["init"] }] }] }`. Parses module meta from HTML comment: `<!-- module: {"id": "...", "slots": ["#..."], "hooks": ["init"]} -->`.
- **Modules (/pages/cat.*/)**: Self-contained `index.html` (DOM fragment + inline JS/CSS). On load: Shell fetches, parses/appends to slots (e.g., #tools-left), injects scripts, calls `window.modId.init({bus, store})`.
- **Canvas Core**: SVG for vectors (infinite viewBox), <canvas> overlay for raster. Tiling/virtualization for >4k (load 1k chunks on zoom).
- **Events/Shortcuts**: Bus routes (e.g., 'T' → 'toolSelect: text'). Ctrl+Z undo, Ctrl+drag ignore snap.
- **Perf**: rAF batches, layer culling (hide off-view), snap to px/grid. Target: <16ms frames on M1/Chrome.

### Data Flow
1. Load → Fetch /api/nav → Loop modules: Fetch HTML → Parse/append DOM → Inject scripts → Call init({bus, store}).
2. User action (e.g., drag image) → Bus emit 'dragStart' → Artboard module listens → Store update → Canvas redraw.
3. Export → Toolbar button → /api/export (future endpoint) or client-side (html2canvas/jsPDF).

### File Structure
```
simple-designer/
├── api/                 # Serverless (Vercel)
│   └── nav.js           # Manifest scanner
├── assets/              # Shell scripts
│   └── app.js           # Bus, store, loader
├── pages/               # Modules (add cats here)
│   └── cat.Canvas/      # Example cat
│       └── infinite-canvas/
│           └── index.html  # Brick: Grid/zoom/pan
├── index.html           # Cockpit UI
└── vercel.json          # Rewrites/functions
```

## 📦 Setup & Deployment
### Local Dev
1. Clone: `git clone https://github.com/youruser/simple-designer.git`
2. Serve: `npx serve .` (or `python -m http.server 8000`)—hits /api/nav as static fallback (empty JSON OK for testing).
3. Test Module: Open `/pages/cat.Canvas/infinite-canvas/index.html` standalone—logs "initialized".
4. Add Brick: Create `/pages/cat.Tools/shapes/index.html`, push—redeploy, auto-loads.

### Deploy (Vercel)
1. Connect GitHub repo to Vercel (free).
2. Settings: Root `/`, Build: None (static + serverless), Functions: api/nav.js (max 10s).
3. Push → Auto-deploy. URL: simple-designer.vercel.app.
4. PWA: Add `/manifest.json` later (icon/name, offline cache via SW).

### Testing
- Console: "Manifest loaded: {cats:[]}", "Loaded module: infinite-canvas".
- UI: Pan (space+drag/middle-click), zoom (wheel, around mouse), grid visible.
- State: localStorage persists viewBox; Ctrl+Z undoes (add shapes later).

## 🔧 Module Spec (Build Order)
Build/test one-by-one. Each: Standalone HTML, meta comment, init hook. ~100-300 lines. Slots/hooks from table.

| Module Path | Features | Slots/Hooks | Est. Lines | Status |
|-------------|----------|-------------|------------|--------|
| cat.Core/shell-layout | Grid panels, theme toggle, responsive. | N/A (shell) | 100 | ✅ Done |
| cat.Canvas/infinite-canvas | Infinite SVG, zoom/pan/snap, grid/ticks. | #canvas-center; init({bus,store}) | 200 | ✅ Loaded |
| cat.Canvas/artboard-tool | Drag image → <rect>/<g> artboard, resize handles. | #toolbar-top (btn); 'dragStart' → 'artboardCreated' | 150 | ⏳ Next? |
| cat.Tools/shapes | Circle/rect draw (click/drag), fill/stroke. | #tools-left (icons); 'toolSelect' → 'shapeAdded' | 100 | ⏳ |
| cat.Tools/typography | Fonts list, kerning/track/leading; <text> on click. | #tools-left/#props-right; 'canvasClick' → 'textAdded' | 250 | ⏳ |
| cat.Tools/alignment | H/V to last/artboard, distribute. | #toolbar-top; 'multiSelect' → 'alignApplied' | 150 | ⏳ |
| cat.Layers/core-layers | Tree, reorder/lock/visibility, vector/raster. | #dock-bottom; 'layerAdded' → 'layerSelect' | 200 | ⏳ |
| cat.Layers/masks | <clipPath>/alpha, apply to groups. | #dock-bottom/#props-right; 'layerSelect' → 'maskApplied' | 200 | ⏳ |
| cat.Tools/color | HSL wheel/sliders, eyedropper. | #props-right; 'selection' → 'colorChanged' | 150 | ⏳ |
| cat.Tools/transform | x/y/w/h/r/s inputs, 8-handles. | #props-right; 'selection' → 'transformApplied' | 200 | ⏳ |
| cat.Effects/drop-shadow | feDropShadow toggle/sliders. | #props-right; 'selection' → 'effectApplied' | 100 | ⏳ |
| cat.Effects/gradient | Linear/radial stops, drag nodes. | #tools-left/#props-right; 'toolSelect' → 'gradientApplied' | 300 | ⏳ |
| cat.Effects/transparency | Alpha gradient automask. | #tools-left; 'toolSelect' → 'transparencyApplied' | 150 | ⏳ |
| cat.Export/export-suite | Slices, PNG/SVG/PDF batch. | #toolbar-top; 'artboards' → /api/export | 200 | ⏳ |

**Launch Checklist**:
- [ ] All modules loaded, no conflicts.
- [ ] Flow: Image drag → Layer/shape/text → Color/align/transform/mask/effect → Export.
- [ ] Perf: 50 layers/4k zoom <16ms frames.
- [ ] Shortcuts: V/P/T/A, Ctrl+Z/Y.
- [ ] Offline: PWA caches core.
- [ ] Exports: Crisp PNG, clean SVG.

## 🎯 Workflow for Future Chats/AIs
1. **Isolation Rule**: Prompt: "Build [module] as standalone index.html. Include meta comment, init hook to bus/store. Test: Open file, logs init. Features: [list]. Under 300 lines."
2. **Integration**: Drop to `/pages/cat.[Group]/[module]/index.html`, push—scan auto-loads. Test cockpit: Events fire? Store updates?
3. **Debug**: Console: "Loaded [id]". Errors? Check fetch paths/slots.
4. **Extend Shell**: Rare—only if bus/store needs (e.g., add 'export' event). Prompt: "Update app.js: Add [feature] to store/bus. Keep <500 lines."
5. **Perf/Edges**: Test 50 layers; use code_execution tool for matrix math if needed.
6. **Virality**: Post-MVP: Add share link (URL state), analytics (/api/track). SEO: "Free Affinity alternative".

## 📈 Future Ideas
- AI Hooks: Integrate your monorepo's cat.AI/brainstorm for "prompt → auto-layer" (e.g., "gradient banner").
- Emulations: Lovart perf (tile rasters), SVG Path Editor paths (pen tool module).
- Pro Tier: Cloud saves ($5/mo), but free core forever.
- Exit Prep: Analytics for user stats; watermark "Powered by Simple Designer".

## 🤝 Credits & Chat History
- Built via Grok (xAI) chats: From SVG Path Editor fork idea → Sporebench adapt → Modular MVP.
- Influences: Affinity workflow, Lovart canvas, Figma collab dreams.
- License: Proprietary (you own); free use forever. Questions? Ping the repo issues.

---

*Last Updated: Sep 26, 2025. Ready for takeoff—next chat: "Build artboard-tool module."*