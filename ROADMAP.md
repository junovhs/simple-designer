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

**Phase 1 Completion Target:** 6-8 weeks

---

## Phase 2: Professional Tools

**Goal:** Feature parity with basic design tools.

### 2.1: Artboard System
- Multiple artboards per document
- Artboard presets (iPhone, A4, etc.)
- Pan between artboards
- Export individual or all artboards

### 2.2: Layer Effects (Non-Destructive)
- Gaussian blur
- Drop shadow (outer/inner)
- Stroke/outline
- Opacity and blend modes

### 2.3: Gradient System
- Linear and radial gradients
- Multi-stop gradient editor
- Gradient transform (angle, scale, offset)
- Apply to fill or stroke

### 2.4: Transparency/Masking
- Alpha masks
- Layer clipping (nest layers)
- Gradient masks

### 2.5: Stroke System
- Width control
- Alignment (center/inside/outside)
- Dash patterns
- Scale with object toggle

### 2.6: History System
- Undo/redo (command pattern)
- Persistent data structures (structural sharing)
- 100+ undo steps without memory explosion

### 2.7: Multi-Format Export
- PNG, JPG, PDF, SVG
- Per-artboard format selection
- Batch export

**Phase 2 Completion Target:** 8-10 weeks

---

## Phase 3: Vector & Text

**Goal:** Full vector editing capabilities.

### 3.1: Pen Tool
- Bezier curve creation
- Node editing (add/delete/convert)
- Handle manipulation

### 3.2: Text (Artistic)
- Free-form text placement
- Font selection and loading
- Typography controls (size, weight, kerning, etc.)

### 3.3: Text (Frame)
- Auto-flow text in bounding box
- Justification (left/center/right/justify)
- Vertical alignment

### 3.4: Shape Conversion
- Convert primitives to curves
- Boolean operations (union, subtract, intersect)

### 3.5: Snapping System
- Snap to grid
- Snap to guides (draggable rulers)
- Smart guides (object edges, centers)
- Distance indicators

**Phase 3 Completion Target:** 10-12 weeks

---

## Phase 4: Advanced Features

**Goal:** Professional-grade capabilities.

### 4.1: Adjustment Layers
- Levels, Curves, HSL shifts
- Black & White, Vibrance
- Color Balance, Exposure
- Non-destructive, stackable

### 4.2: Blend Modes
- Full blend mode support
- GPU-accelerated via shaders

### 4.3: Raster Brush
- Simple round brush for masks
- Width, opacity, hardness controls

### 4.4: Document Setup
- Units (px, pt, in, cm, etc.)
- DPI settings
- Color profiles (RGB, CMYK, Grayscale)
- Margins and bleed

### 4.5: Color Management
- HSL/RGB/Hex color picker
- Eyedropper tool (pixel sampling)
- Color swatches and palettes

### 4.6: Pixel Alignment
- Force pixel snapping
- Subpixel positioning toggle

**Phase 4 Completion Target:** 12-16 weeks

---

## Future Considerations

- Collaboration (multiplayer editing)
- Plugin system
- Mobile/tablet support
- Accessibility (keyboard navigation, screen readers)
- Performance: WebGPU migration
- Advanced features: 3D transforms, animation timeline

---

## Success Metrics

### Performance Targets
- 60 FPS with 10,000 objects on screen
- <100ms to open documents with 1,000 layers
- <16ms per frame (viewport culling working)

### Quality Targets
- Zero warnings in production build
- 100% mandate compliance
- All features tested (unit + integration)

### User Experience Targets
- <2 second load time (PWA installed)
- Works offline after first load
- File size exports match expectations