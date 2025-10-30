# Simple Designer - Development Roadmap

## Vision

A professional-grade design tool as a native desktop application, rivaling commercial software in performance and features while remaining open-source.

---

## Phase 1: Canvas Foundation

**Goal:** Working infinite canvas with shapes, transforms, and export.

### ✅ 1.1: Tauri Native App (COMPLETE)

**Completion Date:** 2024-10-30

- [x] Tauri desktop window (1200x800, resizable)
- [x] Pan/zoom viewport (smooth, responsive)
- [x] Canvas 2D rendering with grid
- [x] High-DPI display support
- [x] Mouse interactions (drag to pan, scroll to zoom)
- [x] Tauri commands bridge (Rust ↔ JS)
- [x] Zero compiler warnings

**Files Created:**
- `src-tauri/src/main.rs` - Tauri entry point
- `src-tauri/src/commands.rs` - Backend commands
- `src/index.html` - UI structure
- `src/main.js` - Viewport logic
- `src/styles.css` - UI styling

---

### 🚧 1.2: wgpu GPU Rendering (IN PROGRESS)

**Goal:** Replace Canvas 2D with GPU-accelerated wgpu rendering.

- [ ] wgpu initialization and surface creation
- [ ] Vertex + fragment shader compilation (WGSL)
- [ ] Instanced rendering pipeline
- [ ] Instance buffer (10k transform matrices)
- [ ] Render 10,000 rectangles proof-of-concept
- [ ] Performance test: 10k rects in <5ms
- [ ] Pixel-perfect rendering (no antialiasing blur)

**Files to Add:**
- `src-tauri/src/render/mod.rs` - Rendering module
- `src-tauri/src/render/pipeline.rs` - wgpu pipeline
- `src-tauri/src/render/shaders.wgsl` - GPU shaders
- `src-tauri/src/render/instanced.rs` - Instanced rendering
- `src-tauri/src/types.rs` - Geometric types
- `src-tauri/src/viewport.rs` - Viewport transforms

---

### 1.3: Spatial Culling + Layer System

- [ ] R-tree spatial index in Rust
- [ ] Viewport culling query (O(log n))
- [ ] Only render visible objects
- [ ] Layer system (visibility, opacity, z-order)
- [ ] Bounded pan/zoom (min: 0.1x, max: 10x)

**Files to Add:**
- `src-tauri/src/spatial.rs`
- `src-tauri/src/layer.rs`

---

### 1.4: Shape Creation Tools

- [ ] Rectangle tool (click-drag to create)
- [ ] Circle/ellipse tool
- [ ] Line tool
- [ ] Shape storage in Rust
- [ ] Add/remove shapes via Tauri commands

**Files to Add:**
- `src-tauri/src/shape.rs`
- `src-tauri/src/document.rs`
- `src/tools.js`

---

### 1.5: Transform Tools

- [ ] Click selection via R-tree query
- [ ] Drag to move shapes
- [ ] 8-node resize handles
- [ ] Rotation handle
- [ ] Modifier keys (Shift: constrain, Ctrl: center)

**Files to Add:**
- `src-tauri/src/selection.rs`
- `src-tauri/src/transform.rs`
- `src/tools/select.js`

---

### 1.6: File Operations

- [ ] Save project to disk (JSON format)
- [ ] Open existing project
- [ ] Export PNG
- [ ] Native file dialogs (Tauri APIs)

**Files to Add:**
- `src-tauri/src/file.rs`
- `src-tauri/src/export.rs`

---

## Phase 2: Professional Tools

**Goal:** Feature parity with basic design tools.

### 2.1: Layer System

- [ ] Layer panel UI
- [ ] Show/hide layers
- [ ] Rename layers
- [ ] Reorder layers (z-index)
- [ ] Layer opacity

### 2.2: Color System

- [ ] Color picker UI
- [ ] Fill color per shape
- [ ] Stroke color per shape
- [ ] Eyedropper tool

### 2.3: History (Undo/Redo)

- [ ] Command pattern in Rust
- [ ] Undo stack (100+ steps)
- [ ] Redo stack
- [ ] Keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)

### 2.4: Image Support

- [ ] Drag/drop image files
- [ ] Upload to GPU texture
- [ ] Render as textured quads
- [ ] Image transform tools

---

## Phase 3: Vector & Text

**Goal:** Professional vector editing and typography.

### 3.1: Pen Tool (Bezier Curves)

- [ ] Click to add anchor points
- [ ] Click-drag for curved handles
- [ ] Path closing
- [ ] Node editing mode

### 3.2: Text Tool

- [ ] Text rendering (font loading)
- [ ] Typography controls (size, weight, spacing)
- [ ] Text frames with word wrapping

---

## Phase 4: Advanced Features

**Goal:** Professional-grade capabilities.

### 4.1: Effects

- [ ] Drop shadow
- [ ] Blur
- [ ] Gradient fills

### 4.2: Export

- [ ] PNG export (multiple resolutions)
- [ ] JPG export
- [ ] SVG export
- [ ] PDF export

---

## Success Metrics

### Performance Targets
- 60 FPS with 10,000 objects visible
- <100ms to open documents with 1,000 layers
- <16ms per frame (with culling)
- <5ms rendering time for 10k instanced shapes

### Quality Targets
- Zero warnings in production build
- 100% CODE_WITH_INTENT mandate compliance
- All features have unit tests
- Cross-platform support (Windows, macOS, Linux)

---

## Development Principles

**Mandate Compliance:**
- Functions ≤60 SLOC, names ≤3 words
- No recursion, bounded loops, static dispatch
- ≥2 assertions per function (average)
- Zero warnings, all Results checked
- Deterministic behavior

**Build in Phases:**
- Each phase delivers working, usable features
- Test extensively before moving forward
- Refactor aggressively after each phase

**Native-First:**
- Full OS integration (file system, clipboard, menus)
- Direct GPU access (wgpu)
- No browser limitations