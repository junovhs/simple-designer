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

