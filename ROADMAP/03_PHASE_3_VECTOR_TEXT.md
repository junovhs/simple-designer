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

