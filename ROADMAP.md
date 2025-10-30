# Simple Designer - Development Roadmap

## Vision

A professional-grade design tool that runs as a native desktop application, rivaling commercial software in performance and features while remaining open-source and accessible.

---

## Phase 1: Canvas Foundation (Current)

**Goal:** Working infinite canvas with shapes, transforms, and export.

### ✅ 1.1: Native Foundation (Tauri + wgpu) (COMPLETE)
- [x] Tauri desktop window setup (resizable, min/max size)
- [x] High-DPI display support handled by default
- [x] Tauri commands bridge established (Rust ↔ JS)
- [x] Project scaffold with mandate compliance
- [x] Zero-copy data flow between Rust and wgpu
- [x] Initial wgpu context initialization and surface creation

**Completion Date:** 2024-10-30

### 🚧 1.2: Instanced Rendering Pipeline (IN PROGRESS)
- [ ] Vertex + fragment shader compilation (WGSL)
- [ ] Quad geometry buffer (shared mesh)
- [ ] Instance buffer (10k transform matrices)
- [ ] `render_pass.draw_indexed()` with instancing implementation
- [ ] Render 100 rectangles proof-of-concept
- [ ] Performance test: 10k rects in <5ms

**Files to Add:**
- `src-tauri/src/render/shaders.wgsl` - Shader source strings
- `src-tauri/src/render/pipeline.rs` - Shader compilation & pipeline setup
- `src-tauri/src/render/geometry.rs` - Quad mesh
- `src-tauri/src/render/instanced.rs` - Instanced rendering logic

### 1.3: Viewport + Spatial Index
- [ ] Pan/zoom with mouse (world ↔ screen transforms in Rust)
- [ ] R-tree spatial index in Rust
- [ ] Viewport culling query (O(log n))
- [ ] Only send visible object instances to the GPU
- [ ] Bounded pan/zoom (min: 0.1x, max: 10x)

**Files to Add:**
- `src-tauri/src/viewport.rs`
- `src-tauri/src/spatial_index.rs`
- `src/canvas/viewport.ts` - Frontend logic for capturing input

### 1.4: Layer System + Batching
- [ ] Layer tree in Rust (flat for Phase 1)
- [ ] Layer metadata (visibility, opacity, z-order)
- [ ] Batch API: `update_transforms(Vec<(id, Matrix)>)` via Tauri command
- [ ] Group instances by material for rendering
- [ ] Z-order sorting (bottom-to-top)

**Files to Add:**
- `src-tauri/src/layer.rs`
- `src-tauri/src/layer_tree.rs`
- `src-tauri/src/batch_ops.rs`

### 1.5: Dirty Rectangle Tracking
- [ ] Track changed objects per frame
- [ ] Calculate dirty regions (union of bounding boxes)
- [ ] Use `wgpu::CommandEncoder` to redraw only dirty regions
- [ ] Test: move 1 object → redraw only that area

**Files to Add:**
- `src-tauri/src/dirty_tracker.rs`
- `src-tauri/src/render/dirty.rs`

### 1.6: Transform Tools
- [ ] Click selection via R-tree query (Rust backend)
- [ ] Implement Separating Axis Theorem (SAT) for robust rotated hit detection
- [ ] Drag to move (update transform matrix in Rust)
- [ ] 8-node resize handles on overlay canvas/div
- [ ] Rotation handle (top center)
- [ ] Modifier keys (Shift: constrain, Ctrl: center)
- [ ] Bulk transform updates (no per-object Tauri calls)

**Files to Add:**
- `src-tauri/src/selection.rs`
- `src-tauri/src/transform.rs`
- `src/tools/select.ts`
- `src/tools/transform.ts`

### 1.7: Image Support
- [ ] Drag/drop image files (handled by Tauri frontend)
- [ ] Offload image decoding to a dedicated Rust thread
- [ ] Prioritize native OS decoding for performance (via Tauri bridge)
- [ ] Create `wgpu::Texture` in RGBA format for 2x faster GPU upload
- [ ] Texture atlas (multiple images, one texture)
- [ ] Render as textured quads (instanced)

**Files to Add:**
- `src-tauri/src/shape.rs` (add Image variant)
- `src-tauri/src/image_loader.rs`
- `src-tauri/src/render/texture.rs`

### 1.8: Export
- [ ] Render all layers to offscreen `wgpu::Texture`
- [ ] Copy texture data to buffer
- [ ] PNG export via `image` crate in Rust
- [ ] Open native "Save File" dialog via Tauri API

**Files to Add:**
- `src-tauri/src/export/png.rs`

### 1.9: Native OS Integration
**Benefit:** No need for browser API fallbacks. We have direct OS access.

- [ ] **File Operations**
  - [ ] Use Tauri's `dialog` API for native open/save dialogs
  - [ ] Direct file system access in Rust for reading/writing project files
  - [ ] Set up custom file extension association (e.g., `.simple`)
  
- [ ] **Clipboard Operations**
  - [ ] Use a Rust clipboard crate (e.g., `arboard`) for robust copy/paste
  - [ ] Support copying images and vector data to the system clipboard
  
- [ ] **Window & Menu**
  - [ ] Create a native top menu bar (File, Edit, View, etc.)
  - [ ] Manage window state (size, position, fullscreen)
  - [ ] Use native notifications for alerts

**Files to Add:**
- `src-tauri/src/file_system.rs`
- `src-tauri/src/clipboard.rs`
- `src-tauri/src/menu.rs`

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
- `src-tauri/src/artboard.rs`
- `src/artboard/manager.ts`

### 2.2: Layer Effects (Non-Destructive)
- [ ] Gaussian blur (radius control)
- [ ] Drop shadow (outer/inner, offset, blur, color)
- [ ] Stroke/outline (width, color, alignment)
- [ ] Effect stacking (multiple effects per layer)
- [ ] Effect toggling (enable/disable)
- [ ] Implemented as multi-pass rendering with WGSL shaders

**Files to Add:**
- `src-tauri/src/effects/blur.rs`
- `src-tauri/src/effects/shadow.rs`
- `src-tauri/src/effects/stroke.rs`
- `src-tauri/src/render/effects_pass.rs`

### 2.3: Gradient System
- [ ] Linear and radial gradients
- [ ] Multi-stop gradient editor (add/remove/drag stops)
- [ ] Per-stop color and opacity
- [ ] Gradient transform (angle, scale, offset)
- [ ] Apply to fill or stroke
- [ ] Implemented as a WGSL shader

**Files to Add:**
- `src-tauri/src/gradient.rs`
- `src/ui/gradient-editor.tsx`
- `src-tauri/src/render/gradient_shader.rs`

### 2.4: Transparency/Masking
- [ ] Alpha masks (layer as mask)
- [ ] Layer clipping (nest layers, auto-clip to parent bounds)
- [ ] Gradient masks (transparency gradient)
- [ ] Mask editing mode
- [ ] Implemented via GPU blend states and stencil buffers

**Files to Add:**
- `src-tauri/src/mask.rs`
- `src-tauri/src/render/masking.rs`

### 2.5: Stroke System
- [ ] Width control (px or % of object size)
- [ ] Alignment (center/inside/outside)
- [ ] Dash patterns (solid, dashed, dotted, custom)
- [ ] Cap styles (butt, round, square)
- [ ] Join styles (miter, round, bevel)
- [ ] Scale with object toggle

**Files to Add:**
- `src-tauri/src/stroke.rs`

### 2.6: History System (Undo/Redo)
- [ ] Command pattern implementation in Rust
- [ ] Persistent data structures (structural sharing)
- [ ] Undo stack (100+ steps without memory explosion)
- [ ] Redo stack
- [ ] Keyboard shortcuts (Cmd/Ctrl+Z, Cmd/Ctrl+Shift+Z, Cmd/Ctrl+Y)
- [ ] History panel (optional, shows command list)

**Files to Add:**
- `src-tauri/src/command.rs`
- `src-tauri/src/history.rs`
- `src/history/manager.ts`

### 2.7: Multi-Format Export
- [ ] PNG export (8-bit, 24-bit, 32-bit)
- [ ] JPG export (quality slider)
- [ ] PDF export (vector + raster, using `genpdf` or `printpdf`)
  - [ ] Embed ICC profiles for color accuracy
- [ ] SVG export (vector only, using `usvg` or `resvg`)
  - [ ] Embed ICC profiles for color accuracy
- [ ] Per-artboard format selection
- [ ] Batch export all artboards
- [ ] Export presets (web, print, @2x retina)

**Files to Add:**
- `src-tauri/src/export/jpg.rs`
- `src-tauri/src/export/pdf.rs`
- `src-tauri/src/export/svg.rs`

### 2.8: Keyboard Input System
**Problem:** Context-aware shortcuts with OS conflict prevention.

- [ ] **Shortcut Registry**
  - [ ] Three-tier context system (Global/Modal/Component)
  - [ ] Conflict detection at registration
  - [ ] Modifier key combinations (Ctrl/Cmd/Shift/Alt)
  - [ ] Platform-specific mappings (Cmd on Mac, Ctrl on Windows)
  
- [ ] **Event Handling**
  - [ ] Capture events in the frontend, process in Rust backend
  - [ ] Disable most shortcuts when a text field is focused (except Undo/Redo)
  - [ ] Allow OS shortcuts (Ctrl+C, Ctrl+V, etc.) to be remapped
  - [ ] Focus state management (canvas vs. UI panel)
  
- [ ] **Customization**
  - [ ] User-defined keybindings
  - [ ] Import/export keybinding presets
  - [ ] Conflict resolution UI
  - [ ] Shortcut cheat sheet (Help menu)

**Files to Add:**
- `src/keyboard/registry.ts`
- `src-tauri/src/keyboard/context.rs`
- `src-tauri/src/keyboard/handler.rs`
- `src/ui/shortcuts-panel.tsx`

### 2.9: Command Palette
**Problem:** Power users need fuzzy search for actions.

- [ ] **Search Index**
  - [ ] Command metadata (name, category, synonyms, keywords) in Rust
  - [ ] Fuzzy matching algorithm (e.g., `fuzzy-matcher` crate)
  - [ ] Contextual ranking (current view relevance, frequency, recency)
  - [ ] Search history
  
- [ ] **Dual-Mode Design**
  - [ ] Action mode (execute commands)
  - [ ] Search mode (find layers/objects in document)
  - [ ] Mode switching (Tab key to toggle)
  - [ ] Visual indicators for current mode
  
- [ ] **UI Implementation**
  - [ ] Modal overlay with input field (React component)
  - [ ] Keyboard navigation (arrow keys, Enter, Esc)
  - [ ] Results list with icons and keyboard shortcuts
  - [ ] Highlighting of matched characters
  - [ ] Recent commands section

**Files to Add:**
- `src/command/palette.tsx`
- `src-tauri/src/command/search.rs`
- `src-tauri/src/command/registry.rs`

---

## Phase 3: Vector & Text

**Goal:** Full vector editing and professional typography.

### 3.0: Text Rendering Architecture (PREREQUISITE)
**Problem:** Simple text rendering is insufficient for professional typography.

**Solution:** Custom text rendering pipeline in Rust with GPU acceleration.

- [ ] **Research & Integration Decision**
  - [ ] Evaluate `rustybuzz` vs. `swash` for text shaping
  - [ ] Test `cosmic-text` for a higher-level solution
  - [ ] Benchmark text shaping performance (1000+ glyphs)
  - [ ] Choose between SDF (Signed Distance Field) vs. bitmap atlas for rendering
  
- [ ] **Text Shaping Engine**
  - [ ] Integrate a shaping library (e.g., `rustybuzz`) as a native crate
  - [ ] Font file parsing (TTF/OTF/WOFF2) with `ttf-parser`
  - [ ] Deepen `ttf-parser` integration for variable font support (Deferred Complexity)
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
  - [ ] Line breaking (Unicode UAX #14)
  - [ ] Word wrapping (greedy vs. optimal fit algorithms)
  - [ ] Bidi text support (Unicode UAX #9) using `unicode-bidi`
  - [ ] Vertical alignment in frames (top/center/bottom)
  - [ ] Text measurement (bounding box calculation)

**Files to Add:**
- `src-tauri/src/text/shaper.rs` - `rustybuzz` bindings
- `src-tauri/src/text/font.rs` - Font parsing and management
- `src-tauri/src/text/atlas.rs` - Glyph texture atlas
- `src-tauri/src/text/layout.rs` - Line breaking, wrapping, bidi
- `src-tauri/src/render/text_pass.rs` - Text quad rendering
- `src-tauri/src/text/metrics.rs` - Text measurement utilities

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
- `src-tauri/src/bezier.rs`
- `src-tauri/src/path.rs`
- `src/tools/pen.ts`

### 3.2: Text (Artistic)
- [ ] Free-form text placement (click to create)
- [ ] Font selection and loading (system fonts + user fonts)
- [ ] Typography controls:
  - [ ] Font size, weight (100-900), style (italic, oblique)
  - [ ] Letter spacing (tracking)
  - [ ] Line height (leading)
  - [ ] Baseline shift
  - [ ] Horizontal/vertical scale
- [ ] Text decoration (underline, strikethrough)
- [ ] Text case (uppercase, lowercase, capitalize)

**Files to Add:**
- `src-tauri/src/text/artistic.rs`
- `src/text/editor.tsx`
- `src/ui/typography-panel.tsx`

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
- `src-tauri/src/text/frame.rs`
- `src/text/frame-editor.tsx`

### 3.4: Shape Conversion & Boolean Operations
- [ ] Convert primitives (rect, circle) to bezier curves
- [ ] Outline stroke (convert stroke to filled path)
- [ ] Boolean operations (using a crate like `kurbo` or `lyon`):
  - [ ] Union (combine shapes)
  - [ ] Subtract (cut out shape)
  - [ ] Intersect (keep overlap only)
  - [ ] Exclude (remove overlap)
- [ ] Path operations:
  - [ ] Flatten (convert curves to line segments)
  - [ ] Simplify (reduce points)
  - [ ] Smooth (bezier smoothing)

**Files to Add:**
- `src-tauri/src/boolean.rs`
- `src-tauri/src/path_ops.rs`

### 3.5: Snapping System
**Problem:** Precise alignment requires smart guides and snap targets.

- [ ] **Core Architecture**
  - [ ] Extend R-tree for efficient nearest-neighbor snapping queries (O(log N))
  - [ ] Implement temporal noise reduction (e.g., Kalman filter) for smooth dragging
  
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
- `src-tauri/src/snap/grid.rs`
- `src-tauri/src/snap/guides.rs`
- `src-tauri/src/snap/smart.rs`
- `src/canvas/snap-overlay.ts`

---

*The remaining phases (Advanced Features, Deferred Complexity, Success Metrics, etc.) are largely architectural or feature-based and translate directly. They are included below with minor updates for the native context.*

---

## Phase 4: Advanced Features

**Goal:** Professional-grade capabilities for print and advanced compositing.

### 4.1: Adjustment Layers (Non-Destructive)
**All adjustment layers stackable and GPU-accelerated via WGSL shaders.**

- [ ] **Levels, Curves, HSL, Black & White, etc.** (All items from original roadmap)

**Files to Add:**
- `src-tauri/src/adjustment/levels.rs`
- `src-tauri/src/adjustment/curves.rs`
- `src-tauri/src/adjustment/hsl.rs`
- `src-tauri/src/render/shaders/adjustments.wgsl`
- `src/ui/adjustment-panels.tsx`

### 4.2: Blend Modes
- [ ] Normal, Multiply, Screen, Overlay, etc. (All items from original roadmap)
- [ ] GPU acceleration via wgpu blend states and custom WGSL shaders.

**Files to Add:**
- `src-tauri/src/render/shaders/blend_modes.wgsl`

### 4.3: Raster Brush (For Masks)
- [ ] Simple round brush
- [ ] Width, Opacity, Hardness, Flow, Spacing, Smoothing controls
- [ ] Support for pressure sensitivity from graphics tablets
- [ ] **Tech:** Offload brush engine to Rust threads; composite masks on GPU.

**Files to Add:**
- `src-tauri/src/brush.rs`
- `src/tools/brush.ts`

### 4.4: Document Setup
- [ ] Units (Pixels, points, inches, mm, cm, etc.)
- [ ] Dimensions, DPI/PPI
- [ ] Color format (RGB/8-32, Gray, CMYK, LAB) & Color profile
- [ ] Use `palette` crate for professional-grade color conversions (sRGB↔LAB/CMYK)
- [ ] Margins & Bleed

**Files to Add:**
- `src-tauri/src/document/setup.rs`
- `src-tauri/src/document/units.rs`
- `src/ui/document-setup.tsx`

### 4.5: Color Management System
- [ ] Color Picker (HSL, RGB, Swatches)
- [ ] Eyedropper Tool
  - [ ] Implement via OS sampling or 3x3 pixel averaging on canvas for accuracy
- [ ] Color Palettes (Create, save, load, import .ase/.gpl/.aco)

**Files to Add:**
- `src-tauri/src/color/picker.rs`
- `src-tauri/src/color/palette.rs`
- `src/ui/color-picker.tsx`
- `src/tools/eyedropper.ts`

### 4.6: Pixel Alignment & Precision
- [ ] Force Pixel Alignment toggle
- [ ] Subpixel Positioning toggle
- [ ] Move by whole pixels (arrow keys) vs. subpixels (Shift + arrow)

**Files to Add:**
- `src-tauri/src/pixel_alignment.rs`

---

## Deferred Complexity (Post-Phase 4)

### Plugin System Architecture
**Why Deferred:** Building a secure, stable, and performant plugin system is as complex as building the core application itself. It requires a robust security model to prevent malicious code from accessing the user's system and a stable API that can evolve without breaking existing plugins. This is a massive architectural undertaking best saved for when the core application is feature-complete and stable.

**Requirements When Implemented:**
- [ ] **Sandboxed Execution Environment**
  - [ ] Use a WebAssembly runtime like Wasmtime integrated into the Rust backend.
  - [ ] Enforce a strict sandboxing model using the WebAssembly System Interface (WASI) to deny file system, network, and process access by default.
  - [ ] Implement per-plugin memory and CPU execution time limits to prevent performance degradation.
- [ ] **Stable API via WebAssembly Component Model**
  - [ ] Define the plugin API using WIT (WebAssembly Interface Type) definitions.
  - [ ] Expose core functionalities: document manipulation, UI creation, command registration, etc.
  - [ ] Version the API strictly (e.g., `v1.0`, `v1.1`) with a clear deprecation policy.
  - [ ] Auto-generate language-specific bindings (e.g., for TypeScript, Python) so developers can write plugins in multiple languages.
- [ ] **Secure Communication Protocol**
  - [ ] Implement a message-passing bridge between the main Rust application and the Wasm plugin sandbox.
  - [ ] All data exchange must be serialized and validated to prevent injection attacks.
  - [ ] Avoid shared memory unless absolutely necessary and protected by strict ownership rules.
- [ ] **Permissions System**
  - [ ] Implement a per-plugin permissions model (e.g., "requires file system access," "requires network access").
  - [ ] Prompt the user for approval during plugin installation, clearly stating what permissions the plugin is requesting.
  - [ ] Allow users to review and revoke permissions at any time.
- [ ] **Plugin Management & Distribution**
  - [ ] Build a UI for discovering, installing, updating, and uninstalling plugins.
  - [ ] Consider a dedicated plugin marketplace with a mandatory code review process for security and quality.
  - [ ] Implement a cryptographic signing system to verify plugin authenticity.

**Major subsystem. Build when the core application is solid and proven.**

### Advanced Text Features
**Why Deferred:** Professional typography is a deeply complex domain. Each of the features below introduces significant algorithmic and rendering challenges. Attempting them during Phase 3 would critically endanger the timeline and stability of core text functionality.

**Add iteratively based on user demand and specialized research:**
- [ ] **Complex Script & Bi-Directional Support**
  - [ ] Integrate a full-featured text shaping library like HarfBuzz, not just a subset.
  - [ ] Correctly handle right-to-left (RTL) scripts like Arabic and Hebrew, including mixed LTR/RTL content.
  - [ ] Support complex grapheme clustering and ligatures for scripts like Devanagari or Thai.
- [ ] **Text on a Path**
  - [ ] Implement algorithms to calculate glyph positions and rotations along a Bezier curve.
  - [ ] Handle text overflow and character spacing on curved paths.
  - [ ] Provide UI controls for path alignment (baseline, center) and orientation.
- [ ] **Variable Font Support**
  - [ ] Extend the font loader to parse and interpret variable font axes (e.g., weight, width, slant).
  - [ ] Create UI sliders and inputs for users to control these axes dynamically.
  - [ ] Ensure the GPU rendering pipeline can efficiently handle dynamically generated glyph shapes.
- [ ] **Advanced Paragraph Justification**
  - [ ] Implement the Knuth-Plass line-breaking algorithm for optimal typographic "color".
  - [ ] Add support for kashida justification in Arabic scripts.
  - [ ] Handle complex CJK punctuation and spacing rules.
- [ ] **Vertical Text Layout**
  - [ ] Implement top-to-bottom, right-to-left text flow.
  - [ ] Correctly rotate and position glyphs for vertical orientation based on font data.

### Collaboration (Multiplayer Editing)
**Why Deferred:** Real-time collaboration transforms a local application into a complex distributed system. It requires a complete re-architecture of the document's data model and the introduction of a robust, scalable backend server infrastructure. This is a product in itself.

**Requirements when implemented:**
- [ ] **Conflict-Free Data Model**
  - [ ] Re-implement the entire document state using Conflict-free Replicated Data Types (CRDTs), likely using a Rust crate like `automerge` or `y-crdt`.
  - [ ] Ensure every user action (moving a shape, changing a color) is translated into a conflict-free operation.
- [ ] **Real-Time Synchronization Backend**
  - [ ] Develop a dedicated WebSocket server to broadcast operations to all connected clients.
  - [ ] Implement authentication, authorization, and document access control.
  - [ ] Design for scalability to handle many concurrent users and documents.
- [ ] **Presence and UI Indicators**
  - [ ] Display cursors and selection boxes for all active users in real-time.
  - [ ] Implement an "avatar stack" showing who is currently viewing the document.
  - [ ] Ensure UI updates from remote users feel instantaneous and non-disruptive.
- [ ] **Conflict Resolution & Document History**
  - [ ] Although CRDTs prevent data corruption, user-level conflicts can still occur (e.g., two users editing the same text). Design UI to handle this gracefully.
  - [ ] Implement a version history viewer that leverages the CRDT log to show document evolution and allow rollbacks.

### Animation Timeline
**Why Deferred:** Animation is an entirely new dimension of functionality, adding the complexity of time to the existing spatial design model. It requires a dedicated UI paradigm and a high-performance rendering loop capable of real-time playback.

**Requirements when implemented:**
- [ ] **Keyframe System**
  - [ ] Allow any property (position, rotation, opacity, color, etc.) to be keyframeable.
  - [ ] Store keyframes (value, time, easing) in the document model.
- [ ] **State Interpolation Engine**
  - [ ] Implement an engine to calculate the state of all properties at any given point in time (including between frames).
  - [ ] Provide a library of easing curves (Linear, Ease-In, Ease-Out, Bezier, etc.).
  - [ ] Implement a graphical curve editor for custom easing functions.
- [ ] **Timeline UI**
  - [ ] Create a timeline panel with a playhead, frame markers, and layer tracks.
  - [ ] Allow users to scrub the timeline, set keyframes, and adjust timing directly.
  - [ ] Potentially add a "dopesheet" or "graph editor" view for advanced animation control.
- [ ] **Video/GIF Export Pipeline**
  - [ ] Integrate a library like `ffmpeg` (compiled to WASM or as a native dependency) for rendering frames into a video file.
  - [ ] Provide export options for format (MP4, WebM, GIF), resolution, frame rate, and quality.

---

## Success Metrics

### Performance Targets
- [ ] **60 FPS Interaction:** All canvas operations (panning, zooming, transforming objects) must maintain 60 FPS with 10,000 objects visible on screen.
- [ ] **Fast Document Load:** Open documents with 1,000 layers and embedded images in <100ms.
- [ ] **Efficient Render Loop:** The time budget for a single frame (update, cull, render) must not exceed 16ms to guarantee 60 FPS.
- [ ] **Instant Startup:** The application's cold start time (from launch to interactive) must be <1 second on modern hardware.
- [ ] **GPU Throughput:** The core instanced rendering pipeline must be able to draw 10,000 unique rectangles in <5ms.

### Quality Targets
- [ ] **Zero Warnings:** The entire Rust and TypeScript codebase must compile with zero warnings under the strictest linter settings.
- [ ] **100% Mandate Compliance:** All code must adhere to the `CODE_WITH_INTENT` principles without exception.
- [ ] **Test Coverage:** All core Rust logic (data structures, commands, transformations) must have comprehensive unit tests. All major user workflows must be covered by Tauri integration tests.
- [ ] **Cross-Platform Parity:** All features must work identically and reliably across all Tier 1 platforms. Any platform-specific bugs must be documented and triaged.

### Platform Compatibility Targets
- [ ] **Tier 1 (Full Support & Testing):** Windows 10/11 (x64), macOS 11+ (Apple Silicon & Intel), Ubuntu 22.04 LTS. Builds are automatically tested and released for these platforms.
- [ ] **Tier 2 (Best Effort):** Other major Linux distributions (e.g., Fedora, Arch). The application is expected to build and run, but issues are lower priority.

### User Experience Targets
- [ ] **Sub-Second Load Time:** Application startup should feel instantaneous.
- [ ] **Offline First:** The application must be 100% functional without an internet connection.
- [ ] **Responsive UI:** All UI interactions (clicking buttons, dragging sliders, opening panels) must have <100ms latency to feel immediate. No jank.
- [ ] **Export Fidelity:** Exported files (PNG, JPG, SVG, PDF) must be pixel-perfect representations of the canvas, with correct dimensions, colors, and metadata.
- [ ] **Keyboard-First Workflow:** Every single action available in the UI must be triggerable via a keyboard shortcut or the command palette, enabling power users to work without touching the mouse.

---

## File Format Strategy

### Phase 1-2: Simple JSON
- [ ] **Goal:** Simplicity and debuggability.
- [ ] Human-readable JSON structure for the entire document graph.
- [ ] Embed small images as base64 strings directly in the JSON.
- [ ] A top-level `version` field (e.g., `"version": "1.0.0"`) is mandatory for future migration.

### Phase 3-4: Hybrid Format
- [ ] **Goal:** Performance and scalability.
- [ ] **Structure:** A master JSON file for document structure, layers, properties, and metadata.
- [ ] **Data:** Performance-critical data (image pixel data, vertex buffers, complex text layouts) stored as separate binary files within a compressed archive (e.g., a `.zip` file with a custom `.simple` extension).
- [ ] **Serialization:** Explore FlatBuffers or MessagePack for the binary data blobs for fast, zero-copy reading.

### Post-Phase 4: Advanced Format
- [ ] **Goal:** Efficiency and interoperability.
- [ ] **Compression:** The entire project archive is compressed using a modern algorithm like Brotli or Zstandard.
- [ ] **Incremental Save:** Implement a system to only write changed data to disk, significantly speeding up saves for large documents (similar to Git's object model).
- [ ] **Interoperability:** Develop robust importers and exporters for industry-standard formats (AI, PSD, Sketch, Figma) to allow for seamless workflow integration.
- [ ] **Backwards Compatibility:** Build a migration system that can read older file format versions and transparently upgrade them to the current version upon opening.

---

## Development Principles

**Mandate Compliance:**
- [ ] **Functions:** Must be ≤60 SLOC, have names ≤3 words, and adhere to the single responsibility principle.
- [ ] **Control Flow:** No recursion. Loops must have statically provable bounds. Use static dispatch over dynamic dispatch wherever possible.
- [ ] **Safety:** Maintain an average of ≥2 assertions per function. All `Result` and `Option` types must be explicitly handled; no `.unwrap()` or `.expect()` outside of tests.
- [ ] **Determinism:** All outputs must be purely determined by their inputs. Avoid global state and hidden dependencies. Implement structured logging for transparent state tracking.

**Build in Phases:**
- [ ] **Deliverable Chunks:** Each phase, and ideally each sub-point, delivers a testable and usable piece of functionality.
- [ ] **Test-Driven:** Write tests before or alongside implementation. A feature is not "done" until it is tested.
- [ ] **Continuous Refactoring:** After each phase, dedicate time to reducing code complexity, improving clarity, and paying down technical debt.
- [ ] **Documentation:** Maintain comprehensive documentation for both the codebase and the end-user.

**Research-Driven:**
- [ ] **Identify Unknowns:** When a clear implementation path is not known, formally define it as a research question.
- [ ] **Parallel Investigation:** Use tools (AI assistants, documentation, articles) to gather diverse perspectives on the problem.
- [ ] **Synthesize & Decide:** Consolidate the research into a technical brief, make a clear decision, and update the roadmap before writing code.

**User-Focused:**
- [ ] **Dogfooding:** Use Simple Designer to create its own UI assets, marketing materials, and documentation graphics.
- [ ] **Feedback Loops:** Establish clear channels for user feedback (e.g., Discord, GitHub Issues) from the earliest possible stage.
- [ ] **Prioritization:** Prioritize features and bug fixes based on a balance of user impact and development effort.
- [ ] **Performance First:** When faced with a choice between a new feature and maintaining performance, prioritize performance. A fast tool is a usable tool.

**Native-First:**
- [ ] **Leverage the OS:** Fully integrate with native OS features: file system, clipboard, window management, notifications, and menus.
- [ ] **Direct GPU Access:** Maximize performance by using `wgpu` for direct, low-level control over the GPU. Avoid abstractions that add overhead.
- [ ] **No Browser Constraints:** Design without the limitations of browser APIs, sandboxing, or performance quirks. The desktop is the target platform.