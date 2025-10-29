# Simple Designer - Development Roadmap

## Vision

A professional-grade design tool that runs entirely in the browser, rivaling desktop applications in performance and features while remaining open-source and accessible.

---

## Phase 1: Canvas Foundation (Current)

**Goal:** Working infinite canvas with shapes, transforms, and export.

### ✅ 1.1: WebGL Foundation (COMPLETE)
- [x] Three-canvas setup (background/content/overlay)
- [x] WebGL context initialization
- [x] Error handling and validation
- [x] Zero-copy WASM ↔ JS data flow
- [x] Project scaffold with mandate compliance

**Completion Date:** 2024-10-29

### 🚧 1.2: Instanced Rendering Pipeline (IN PROGRESS)
- [ ] Vertex + fragment shader compilation
- [ ] Quad geometry buffer (shared mesh)
- [ ] Instance buffer (10k transform matrices)
- [ ] `drawArraysInstanced()` implementation
- [ ] Render 100 rectangles proof-of-concept
- [ ] Performance test: 10k rects in <5ms

**Files to Add:**
- `rust-core/src/shader.rs` - Shader source strings
- `web-frontend/src/webgl/shader.ts` - Shader compilation
- `web-frontend/src/webgl/geometry.ts` - Quad mesh
- `web-frontend/src/webgl/instanced.ts` - Instanced rendering

### 1.3: Viewport + Spatial Index
- [ ] Pan/zoom with mouse (world ↔ screen transforms)
- [ ] R-tree spatial index in Rust
- [ ] Viewport culling query (O(log n))
- [ ] Only render visible objects
- [ ] Bounded pan/zoom (min: 0.1x, max: 10x)

**Files to Add:**
- `rust-core/src/viewport.rs`
- `rust-core/src/spatial_index.rs`
- `web-frontend/src/canvas/viewport.ts`

### 1.4: Layer System + Batching
- [ ] Layer tree in WASM (flat for Phase 1)
- [ ] Layer metadata (visibility, opacity, z-order)
- [ ] Batch API: `update_transforms(Vec<(id, Matrix3)>)`
- [ ] Group layers by material for rendering
- [ ] Z-order sorting (bottom-to-top)

**Files to Add:**
- `rust-core/src/layer.rs`
- `rust-core/src/layer_tree.rs`
- `rust-core/src/batch_ops.rs`

### 1.5: Dirty Rectangle Tracking
- [ ] Track changed objects per frame
- [ ] Calculate dirty regions (union of bounding boxes)
- [ ] Clip draw calls to dirty regions only
- [ ] Test: move 1 object → redraw only that area

**Files to Add:**
- `rust-core/src/dirty_tracker.rs`
- `web-frontend/src/webgl/dirty.ts`

### 1.6: Transform Tools
- [ ] Click selection via R-tree query
- [ ] Drag to move (update transform matrix)
- [ ] 8-node resize handles on overlay canvas
- [ ] Rotation handle (top center)
- [ ] Modifier keys (Shift: constrain, Ctrl: center)
- [ ] Bulk transform updates (no per-object WASM calls)

**Files to Add:**
- `rust-core/src/selection.rs`
- `rust-core/src/transform.rs`
- `web-frontend/src/tools/select.ts`
- `web-frontend/src/tools/transform.ts`

### 1.7: Image Support
- [ ] Drag/drop image files
- [ ] `createImageBitmap()` in Web Worker
- [ ] Upload to WebGL texture
- [ ] Texture atlas (multiple images, one texture)
- [ ] Render as textured quads (instanced)

**Files to Add:**
- `rust-core/src/shape.rs` (add Image variant)
- `web-frontend/src/image/loader.ts`
- `web-frontend/src/webgl/texture.ts`

### 1.8: Export
- [ ] Render all layers to offscreen framebuffer
- [ ] `readPixels()` to get image data
- [ ] PNG export via `canvas.toBlob()`
- [ ] Download file to user's system

**Files to Add:**
- `web-frontend/src/export/png.ts`

### 1.9: PWA Cross-Browser Compatibility
**Problem:** File System Access API unsupported in Safari/Firefox. Need fallbacks.

- [ ] **File Operations**
  - [ ] Feature detection for File System Access API
  - [ ] Fallback: `<input type="file">` for open
  - [ ] Fallback: Blob download for save
  - [ ] Progressive enhancement (Chrome gets native dialogs)
  
- [ ] **Clipboard Operations**
  - [ ] Feature detection for Clipboard API
  - [ ] PNG-only fallback for Safari
  - [ ] Manual copy/paste instructions for unsupported browsers
  
- [ ] **Browser Capability Matrix**
  - [ ] Document supported features per browser
  - [ ] User-facing compatibility table
  - [ ] Graceful degradation messaging

**Files to Add:**
- `web-frontend/src/platform/file-system.ts`
- `web-frontend/src/platform/clipboard.ts`
- `web-frontend/src/platform/detect.ts`

---

## Phase 2: Professional Tools

**Goal:** Feature parity with basic design tools.

### 2.1: Artboard System
- [ ] Multiple artboards per document
- [ ] Artboard presets (iPhone, A4, 1920x1080, etc.)
- [ ] Pan between artboards (infinite canvas)
- [ ] Artboard-specific backgrounds
- [ ] Export individual or all artboards

**Files to Add:**
- `rust-core/src/artboard.rs`
- `web-frontend/src/artboard/manager.ts`

### 2.2: Layer Effects (Non-Destructive)
- [ ] Gaussian blur (radius control)
- [ ] Drop shadow (outer/inner, offset, blur, color)
- [ ] Stroke/outline (width, color, alignment)
- [ ] Effect stacking (multiple effects per layer)
- [ ] Effect toggling (enable/disable)

**Files to Add:**
- `rust-core/src/effects/blur.rs`
- `rust-core/src/effects/shadow.rs`
- `rust-core/src/effects/stroke.rs`
- `web-frontend/src/webgl/effects.ts`

### 2.3: Gradient System
- [ ] Linear and radial gradients
- [ ] Multi-stop gradient editor (add/remove/drag stops)
- [ ] Per-stop color and opacity
- [ ] Gradient transform (angle, scale, offset)
- [ ] Apply to fill or stroke

**Files to Add:**
- `rust-core/src/gradient.rs`
- `web-frontend/src/ui/gradient-editor.tsx`
- `web-frontend/src/webgl/gradient.ts`

### 2.4: Transparency/Masking
- [ ] Alpha masks (layer as mask)
- [ ] Layer clipping (nest layers, auto-clip to parent bounds)
- [ ] Gradient masks (transparency gradient)
- [ ] Mask editing mode

**Files to Add:**
- `rust-core/src/mask.rs`
- `web-frontend/src/webgl/mask.ts`

### 2.5: Stroke System
- [ ] Width control (px or % of object size)
- [ ] Alignment (center/inside/outside)
- [ ] Dash patterns (solid, dashed, dotted, custom)
- [ ] Cap styles (butt, round, square)
- [ ] Join styles (miter, round, bevel)
- [ ] Scale with object toggle

**Files to Add:**
- `rust-core/src/stroke.rs`

### 2.6: History System (Undo/Redo)
- [ ] Command pattern implementation
- [ ] Persistent data structures (structural sharing)
- [ ] Undo stack (100+ steps without memory explosion)
- [ ] Redo stack
- [ ] Keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
- [ ] History panel (optional, shows command list)

**Files to Add:**
- `rust-core/src/command.rs`
- `rust-core/src/history.rs`
- `web-frontend/src/history/manager.ts`

### 2.7: Multi-Format Export
- [ ] PNG export (8-bit, 24-bit, 32-bit)
- [ ] JPG export (quality slider)
- [ ] PDF export (vector + raster)
- [ ] SVG export (vector only)
- [ ] Per-artboard format selection
- [ ] Batch export all artboards
- [ ] Export presets (web, print, @2x retina)

**Files to Add:**
- `web-frontend/src/export/png.ts`
- `web-frontend/src/export/jpg.ts`
- `web-frontend/src/export/pdf.ts`
- `web-frontend/src/export/svg.ts`

### 2.8: Keyboard Input System
**Problem:** Context-aware shortcuts with browser conflict prevention.

- [ ] **Shortcut Registry**
  - [ ] Three-tier context system (Global/Modal/Component)
  - [ ] Conflict detection at registration
  - [ ] Modifier key combinations (Ctrl/Cmd/Shift/Alt)
  - [ ] Platform-specific mappings (Cmd on Mac, Ctrl on Windows)
  
- [ ] **Event Handling**
  - [ ] Capture phase interception
  - [ ] `preventDefault()` for design shortcuts only
  - [ ] Allow browser shortcuts (Ctrl+T, Ctrl+W, F12, etc.)
  - [ ] Focus state management (canvas vs. text input)
  - [ ] Input field detection (don't intercept when typing)
  
- [ ] **Customization**
  - [ ] User-defined keybindings
  - [ ] Import/export keybinding presets
  - [ ] Conflict resolution UI
  - [ ] Shortcut cheat sheet (Help menu)

**Files to Add:**
- `web-frontend/src/keyboard/registry.ts`
- `web-frontend/src/keyboard/context.ts`
- `web-frontend/src/keyboard/handler.ts`
- `web-frontend/src/ui/shortcuts-panel.tsx`

### 2.9: Command Palette
**Problem:** Power users need fuzzy search for actions.

- [ ] **Search Index**
  - [ ] Command metadata (name, category, synonyms, keywords)
  - [ ] Fuzzy matching algorithm (Levenshtein distance or similar)
  - [ ] Contextual ranking (recent commands, frequent commands)
  - [ ] Search history
  
- [ ] **Dual-Mode Design**
  - [ ] Action mode (execute commands)
  - [ ] Search mode (find layers/objects in document)
  - [ ] Mode switching (Tab key to toggle)
  - [ ] Visual indicators for current mode
  
- [ ] **UI Implementation**
  - [ ] Modal overlay with input field
  - [ ] Keyboard navigation (arrow keys, Enter, Esc)
  - [ ] Results list with icons and keyboard shortcuts
  - [ ] Highlighting of matched characters
  - [ ] Recent commands section

**Files to Add:**
- `web-frontend/src/command/palette.tsx`
- `web-frontend/src/command/search.ts`
- `web-frontend/src/command/registry.ts`
- `web-frontend/src/command/fuzzy.ts`

---

## Phase 3: Vector & Text

**Goal:** Full vector editing and professional typography.

### 3.0: Text Rendering Architecture (PREREQUISITE)
**Problem:** Canvas text APIs are insufficient for professional typography.

**Solution:** Custom text rendering pipeline with GPU acceleration.

- [ ] **Research & Integration Decision**
  - [ ] Evaluate HarfBuzz WASM compilation vs. alternatives
  - [ ] Test cosmic-text (Rust) vs. rustybuzz for binary size
  - [ ] Benchmark text shaping performance (1000+ glyphs)
  - [ ] Choose between SDF (Signed Distance Field) vs. bitmap atlas
  
- [ ] **Text Shaping Engine**
  - [ ] Integrate HarfBuzz or rustybuzz (compiled to WASM)
  - [ ] Font file parsing (TTF/OTF/WOFF2)
  - [ ] Glyph positioning engine (kerning tables, advance widths)
  - [ ] OpenType feature support (ligatures, small-caps, stylistic alternates)
  - [ ] Font fallback system (primary font + fallback chain)
  
- [ ] **GPU Text Rendering**
  - [ ] Glyph atlas generation (texture packing algorithm)
  - [ ] SDF rendering for resolution-independent scaling
  - [ ] Text as instanced quads (one quad per glyph)
  - [ ] Subpixel positioning (±0.5px precision)
  - [ ] Color emoji support (separate texture atlas)
  
- [ ] **Text Layout Engine**
  - [ ] Line breaking (Unicode UAX #14 Line Breaking Algorithm)
  - [ ] Word wrapping (greedy vs. optimal fit algorithms)
  - [ ] Bidi text support (Unicode UAX #9 Bidirectional Algorithm)
  - [ ] Vertical alignment in frames (top/center/bottom)
  - [ ] Text measurement (bounding box calculation)

**Files to Add:**
- `rust-core/src/text/shaper.rs` - HarfBuzz/rustybuzz bindings
- `rust-core/src/text/font.rs` - Font parsing and management
- `rust-core/src/text/atlas.rs` - Glyph texture atlas
- `rust-core/src/text/layout.rs` - Line breaking, wrapping, bidi
- `web-frontend/src/webgl/text.ts` - Text quad rendering
- `web-frontend/src/text/metrics.ts` - Text measurement utilities

**CRITICAL:** This is a major subsystem. May require dedicated research sprint.

### 3.1: Pen Tool (Bezier Curves)
- [ ] Click to add anchor points
- [ ] Click-drag to create curved handles
- [ ] Path closing (click first point or press Z)
- [ ] Node editing mode (select, move, delete nodes)
- [ ] Handle manipulation (convert corner ↔ smooth ↔ asymmetric)
- [ ] Add/remove points on existing path
- [ ] Path simplification (reduce node count)

**Files to Add:**
- `rust-core/src/bezier.rs`
- `rust-core/src/path.rs`
- `web-frontend/src/tools/pen.ts`

### 3.2: Text (Artistic)
- [ ] Free-form text placement (click to create)
- [ ] Font selection and loading (system fonts + web fonts)
- [ ] Typography controls:
  - [ ] Font size, weight (100-900), style (italic, oblique)
  - [ ] Letter spacing (tracking)
  - [ ] Line height (leading)
  - [ ] Baseline shift
  - [ ] Horizontal/vertical scale
- [ ] Text decoration (underline, strikethrough)
- [ ] Text case (uppercase, lowercase, capitalize)

**Files to Add:**
- `rust-core/src/text/artistic.rs`
- `web-frontend/src/text/editor.tsx`
- `web-frontend/src/ui/typography-panel.tsx`

### 3.3: Text (Frame)
- [ ] Click-drag to create text frame
- [ ] Auto-flow text in bounding box
- [ ] Text overflow handling (clip, visible, scroll)
- [ ] Justification (left/center/right/justify)
- [ ] Vertical alignment (top/center/bottom)
- [ ] First line indent
- [ ] Paragraph spacing
- [ ] Column support (multi-column text)

**Files to Add:**
- `rust-core/src/text/frame.rs`
- `web-frontend/src/text/frame-editor.tsx`

### 3.4: Shape Conversion & Boolean Operations
- [ ] Convert primitives (rect, circle) to bezier curves
- [ ] Outline stroke (convert stroke to filled path)
- [ ] Boolean operations:
  - [ ] Union (combine shapes)
  - [ ] Subtract (cut out shape)
  - [ ] Intersect (keep overlap only)
  - [ ] Exclude (remove overlap)
- [ ] Path operations:
  - [ ] Flatten (convert curves to line segments)
  - [ ] Simplify (reduce points)
  - [ ] Smooth (bezier smoothing)

**Files to Add:**
- `rust-core/src/boolean.rs` (may use `geo` or `lyon` crates)
- `rust-core/src/path_ops.rs`

### 3.5: Snapping System
**Problem:** Precise alignment requires smart guides and snap targets.

- [ ] **Snap to Grid**
  - [ ] Grid visualization (optional overlay)
  - [ ] Configurable grid size (px, pt, in, cm)
  - [ ] Grid subdivision (major/minor lines)
  - [ ] Snap tolerance (default 8px screen space)
  
- [ ] **Snap to Guides**
  - [ ] Draggable horizontal/vertical guides from rulers
  - [ ] Guide color and visibility
  - [ ] Lock guides (prevent accidental movement)
  
- [ ] **Smart Guides (Object Snapping)**
  - [ ] Snap to object edges (left, right, top, bottom)
  - [ ] Snap to object centers (horizontal, vertical)
  - [ ] Snap to anchor points (bezier curve nodes)
  - [ ] Distance indicators (show spacing between objects)
  - [ ] Alignment guides (temporary lines showing alignment)
  
- [ ] **Snap Settings**
  - [ ] Toggle snap on/off (keyboard shortcut)
  - [ ] Configurable snap candidates (max 6 shown at once)
  - [ ] Include/exclude bounding box midpoints
  - [ ] Snap to pixel grid toggle

**Files to Add:**
- `rust-core/src/snap/grid.rs`
- `rust-core/src/snap/guides.rs`
- `rust-core/src/snap/smart.rs`
- `web-frontend/src/canvas/snap-overlay.ts`

---

## Phase 4: Advanced Features

**Goal:** Professional-grade capabilities for print and advanced compositing.

### 4.1: Adjustment Layers (Non-Destructive)
**All adjustment layers stackable and GPU-accelerated via shaders.**

- [ ] **Levels**
  - [ ] Black level, white level, gamma sliders
  - [ ] Output black/white level
  - [ ] Per-channel control (RGB separate)
  
- [ ] **Curves**
  - [ ] Full XY graph with histogram
  - [ ] Bezier curve handles on diagonal line
  - [ ] Master curve + per-channel (R, G, B, Alpha)
  - [ ] Eyedropper to set black/white points
  
- [ ] **HSL (Hue/Saturation/Lightness)**
  - [ ] Hue shift slider (-180° to +180°)
  - [ ] Saturation shift (-100% to +100%)
  - [ ] Lightness shift (-100% to +100%)
  - [ ] Target specific color ranges (reds, yellows, greens, etc.)
  
- [ ] **Black & White**
  - [ ] Per-color-range sliders (red, yellow, green, cyan, blue, magenta)
  - [ ] Darken or brighten each color range independently
  
- [ ] **Brightness & Contrast**
  - [ ] Two sliders (brightness, contrast)
  
- [ ] **Vibrance & Saturation**
  - [ ] Vibrance slider (affects less-saturated colors more)
  - [ ] Saturation slider (uniform saturation change)
  
- [ ] **Exposure**
  - [ ] Single slider (simulates f-stop changes)
  
- [ ] **Shadows/Highlights**
  - [ ] Separate sliders for shadow and highlight recovery
  
- [ ] **Gradient Map**
  - [ ] Map luminosity to gradient colors
  - [ ] Multi-stop gradient editor
  - [ ] Common presets (sepia, duotone, etc.)
  
- [ ] **Invert**
  - [ ] No interface (toggle on/off)

**Files to Add:**
- `rust-core/src/adjustment/levels.rs`
- `rust-core/src/adjustment/curves.rs`
- `rust-core/src/adjustment/hsl.rs`
- `web-frontend/src/webgl/shaders/adjustments.ts`
- `web-frontend/src/ui/adjustment-panels.tsx`

### 4.2: Blend Modes
- [ ] Normal
- [ ] Multiply, Screen, Overlay
- [ ] Darken, Lighten
- [ ] Color Dodge, Color Burn
- [ ] Hard Light, Soft Light
- [ ] Difference, Exclusion
- [ ] Hue, Saturation, Color, Luminosity
- [ ] GPU acceleration via WebGL shaders

**Files to Add:**
- `web-frontend/src/webgl/shaders/blend-modes.ts`

### 4.3: Raster Brush (For Masks)
- [ ] Simple round brush
- [ ] Width control (px, with pressure sensitivity if available)
- [ ] Opacity control (0-100%)
- [ ] Hardness control (0-100%, feathered edges)
- [ ] Flow control (paint buildup)
- [ ] Brush spacing (distance between brush stamps)
- [ ] Brush smoothing (stabilize hand jitter)

**Files to Add:**
- `rust-core/src/brush.rs`
- `web-frontend/src/tools/brush.ts`

### 4.4: Document Setup
- [ ] **Units**
  - [ ] Pixels, points, inches, feet, yards
  - [ ] Millimeters, centimeters, meters
  - [ ] Unit conversion throughout app
  
- [ ] **Document Dimensions**
  - [ ] Width and height inputs
  - [ ] Lock aspect ratio toggle
  - [ ] Orientation (portrait/landscape)
  - [ ] DPI/PPI setting (72, 150, 300, custom)
  
- [ ] **Color Settings**
  - [ ] Color format: RGB/8, RGB/16, RGB/32 (HDR), Gray/8, Gray/16, CMYK/8, LAB/16
  - [ ] Color profile selector (sRGB, Adobe RGB, Display P3, ProPhoto, CMYK profiles)
  - [ ] Transparent background toggle
  
- [ ] **Margins & Bleed**
  - [ ] Include margins toggle
  - [ ] Left, right, top, bottom margin values
  - [ ] Margin color (guide visualization)
  - [ ] Bleed values (for print)

**Files to Add:**
- `rust-core/src/document/setup.rs`
- `rust-core/src/document/units.rs`
- `web-frontend/src/ui/document-setup.tsx`

### 4.5: Color Management System
- [ ] **Color Picker**
  - [ ] HSL mode (hue wheel + SL square)
  - [ ] RGB mode (R, G, B sliders + hex input)
  - [ ] Swatches (recent colors, saved colors)
  - [ ] Alpha slider
  
- [ ] **Eyedropper Tool**
  - [ ] Click to sample single pixel
  - [ ] Click-drag with magnifier (shows enlarged area)
  - [ ] Sample from current layer vs. all layers
  - [ ] Color value display (RGB, HSL, Hex)
  
- [ ] **Color Palettes**
  - [ ] Create/save/load palettes
  - [ ] Import palettes (.ase, .gpl, .aco formats)
  - [ ] Drag colors to/from palette

**Files to Add:**
- `rust-core/src/color/picker.rs`
- `rust-core/src/color/palette.rs`
- `web-frontend/src/ui/color-picker.tsx`
- `web-frontend/src/tools/eyedropper.ts`

### 4.6: Pixel Alignment & Precision
- [ ] **Force Pixel Alignment**
  - [ ] Snap all coordinates to integer pixels
  - [ ] Prevents blurry rendering on pixel grid
  
- [ ] **Subpixel Positioning**
  - [ ] Toggle to allow fractional pixel coordinates
  - [ ] Useful for smooth animations and scaling
  
- [ ] **Move Settings**
  - [ ] Move by whole pixels (arrow keys)
  - [ ] Move by subpixels (Shift + arrow keys, 0.1px increments)

**Files to Add:**
- `rust-core/src/pixel_alignment.rs`

---

## Deferred Complexity (Post-Phase 4)

### Plugin System Architecture
**Why Deferred:** Requires massive security and architectural work.

**Requirements when implemented:**
- Dual-thread architecture (UI thread + sandbox thread)
- WebAssembly Component Model (WIT interfaces)
- Message-passing protocol (postMessage or SharedArrayBuffer)
- Plugin API versioning and deprecation strategy
- Plugin marketplace with mandatory code review
- Sandboxed file system access (OPFS per plugin)
- Memory limits and CPU quotas per plugin
- Plugin permissions system (user approval required)

**Major subsystem. Build when core is solid.**

### Advanced Text Features
**Deferred to avoid scope creep in Phase 3:**

- Complex script support (Arabic, Thai, Devanagari, Hebrew)
- Advanced typography (drop caps, stylistic sets, contextual alternates)
- Text on path (curve text along bezier path)
- Variable font support (weight/width axes)
- Advanced justification (kashida, CJK spacing)
- Vertical text layout (top-to-bottom, right-to-left)

**Add iteratively based on user demand.**

### Collaboration (Multiplayer Editing)
**Why Deferred:** Requires full operational transform or CRDT implementation.

**Requirements:**
- Conflict-free replicated data types (CRDTs) or OT algorithm
- WebSocket server for real-time sync
- Per-user cursor and selection indicators
- Presence system (who's viewing/editing)
- Conflict resolution UI
- Version history and branching

**Complex distributed systems work. Evaluate after Phase 4.**

### Animation Timeline
**Why Deferred:** Entire new subsystem.

**Requirements:**
- Keyframe system
- Easing curves
- Property animation (position, rotation, opacity, etc.)
- Timeline UI with scrubbing
- Export to video (requires FFmpeg WASM or similar)

**Evaluate based on user requests after Phase 4.**

---

## Success Metrics

### Performance Targets
- 60 FPS with 10,000 objects visible on screen
- <100ms to open documents with 1,000 layers
- <16ms per frame (viewport culling + dirty rectangles working)
- <2 second PWA load time (installed app)
- <5ms rendering time for 10k instanced rectangles

### Quality Targets
- Zero warnings in production build (Rust + TypeScript)
- 100% CODE_WITH_INTENT mandate compliance
- All features have unit tests (Rust) + integration tests (browser)
- Cross-browser compatibility matrix documented

### Browser Compatibility Targets
- **Chrome/Edge:** 100% feature parity (all APIs supported)
- **Firefox:** 95% (no File System Access API, clipboard fallbacks working)
- **Safari:** 90% (no File System Access API, limited clipboard, PNG-only)
- **Mobile browsers:** 70% (touch input, limited features, smaller screens)

### User Experience Targets
- <2 second load time (PWA installed, cached assets)
- Works offline after first load (service worker caching)
- Responsive UI (no janky interactions, <100ms input latency)
- File exports match user expectations (correct dimensions, colors, format)
- Keyboard-first workflow for power users (all actions have shortcuts)

---

## File Format Strategy

### Phase 1-2: Simple JSON
- Human-readable JSON for easy debugging
- Embedded base64 images (small files only)
- Version field for migration path

### Phase 3-4: Hybrid Format
- JSON for structure (layers, properties, metadata)
- Binary blobs for performance-critical data (images, vertex buffers)
- FlatBuffers or MessagePack for compact serialization
- Compatible with SVG standards where possible

### Post-Phase 4: Advanced Format
- Compression (gzip or Brotli)
- Incremental save (only save changed data)
- Backwards compatibility via version migrations
- Export to industry standards (AI, PSD, Sketch, Figma)

---

## Development Principles

**Mandate Compliance:**
- Functions ≤60 SLOC, names ≤3 words, single responsibility
- No recursion, bounded loops, static dispatch
- ≥2 assertions per function (average)
- Zero warnings, all Results checked, no `unwrap()` outside tests
- Deterministic behavior, structured logging

**Build in Phases:**
- Each phase delivers working, usable features
- Test extensively before moving to next phase
- Refactor aggressively after each phase (reduce files, reduce LOC)
- Maintain comprehensive documentation

**Research-Driven:**
- When stuck, create research questions
- Use AI researchers (5x parallel) to gather information
- Synthesize findings, update plan, implement

**User-Focused:**
- Dogfood the tool (use it to design its own marketing)
- Gather feedback early and often
- Prioritize features based on user needs
- Performance over features (fast > full-featured)