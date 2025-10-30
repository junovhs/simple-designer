# Changelog

All notable changes to Simple Designer will be documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/).

---

## [Unreleased]

### In Progress
- Phase 1.2: wgpu GPU rendering pipeline

---

## [0.1.0-phase1.1] - 2024-10-30

### Phase 1.1: Tauri Native App with Working Viewport

**Architecture Migration:**
- Migrated from PWA/WebGL to Tauri native desktop app
- Replaced React/TypeScript with vanilla HTML/JS
- Removed WASM compilation (direct Rust backend)

**Core Features:**
- Native desktop window (1200x800, resizable)
- Smooth pan/zoom viewport
  - Drag to pan (natural direction)
  - Scroll to zoom (zoom toward mouse position)
- Canvas 2D rendering
  - Grid visualization
  - Test rectangle
- High-DPI display support (devicePixelRatio handling)
- Mouse interaction handling
- Tauri commands bridge (Rust ↔ JavaScript)

**Rust Backend:**
- `src-tauri/src/main.rs` - Tauri entry point
- `src-tauri/src/commands.rs` - Backend commands
  - `get_version()` - Get app version
  - `init_canvas(width, height)` - Initialize canvas dimensions

**Frontend:**
- `src/index.html` - UI structure
- `src/main.js` - Viewport logic and rendering
- `src/styles.css` - Dark theme UI

**Build System:**
- Tauri 2.0 framework
- Cargo workspace
- Zero warnings build (`#![deny(warnings)]`)

**Known Limitations:**
- Canvas 2D has antialiasing blur at high zoom
- No GPU acceleration yet
- Single static shape only (no shape creation)

**Next:** Phase 1.2 - wgpu GPU rendering for pixel-perfect output

---

## [0.1.0] - 2024-10-29

### Phase 1.1: WebGL Foundation (DEPRECATED)

**Note:** This phase was completed but architecture was replaced with Tauri.

- Three-layer canvas (background/content/overlay)
- WebGL context initialization
- WASM integration
- React + TypeScript frontend

**Deprecated Files:**
- `web-frontend/` - Replaced with `src/`
- `rust-core/` - Integrated into `src-tauri/`

---

## Project Start - 2024-10-29

- Initial architecture design (PWA/WebGL/WASM)
- Technology stack selection
- Mandate definition
- Research phase completed
- **2024-10-30:** Architecture pivot to Tauri