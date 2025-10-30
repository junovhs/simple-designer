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

