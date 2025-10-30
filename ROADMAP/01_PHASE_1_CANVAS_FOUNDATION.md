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

