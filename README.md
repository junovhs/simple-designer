
# Simple Designer

Open-source, high-performance design tool as a native desktop application.

## Architecture

**Native Desktop App (Tauri + Rust + wgpu):**
- **Rust Backend** → Core logic, viewport math, spatial indexing
- **wgpu Renderer** → GPU-accelerated rendering (Phase 1.2+)
- **HTML/JS Frontend** → Minimal UI layer
- **Tauri Framework** → Native window, file system, clipboard access

## Current Status: Phase 1.1 Complete ✅

**Phase 1.1: Tauri Native App with Working Viewport** (COMPLETE)
- ✅ Native desktop window (1200x800, resizable)
- ✅ Smooth pan/zoom viewport (drag to pan, scroll to zoom)
- ✅ Canvas 2D rendering (grid + test rectangle)
- ✅ High-DPI display support
- ✅ Tauri commands bridge (Rust ↔ JavaScript)
- ✅ Zero compiler warnings (mandate compliant)

**Phase 1.2: wgpu GPU Rendering** (NEXT)
- GPU-accelerated instanced rendering
- 10,000+ shapes at 60fps
- Pixel-perfect output (no antialiasing blur)
- Hardware shader pipeline

See [ROADMAP.md](./ROADMAP.md) for full feature plan.

## Tech Stack

**Rust Backend:**
- `tauri` - Native desktop framework
- `wgpu` - GPU rendering (Phase 1.2+)
- `glam` - SIMD math
- `rstar` - Spatial indexing (R-tree)
- `serde` - Serialization
- `thiserror` - Error types

**Frontend:**
- Vanilla HTML/CSS/JavaScript
- Canvas 2D (Phase 1.1) → wgpu (Phase 1.2+)
- Minimal framework overhead

## Development

### Prerequisites
- Rust 1.70+
- Tauri CLI

### Build & Run

```bash
# Install Tauri CLI (once)
cargo install tauri-cli

# Run dev mode
cd src-tauri
cargo tauri dev

# Build release
cargo tauri build
```

### Testing

```bash
# Rust tests
cd src-tauri
cargo test
cargo clippy -- -D warnings
```

## Code Mandate

This project follows strict development principles:
- ✅ Functions ≤60 SLOC, names ≤3 words
- ✅ No recursion, bounded loops only
- ✅ ≥2 assertions per function (average)
- ✅ Zero warnings (`#![deny(warnings)]`)
- ✅ All Results checked, no `unwrap()` outside tests
- ✅ Static dispatch, deterministic behavior

## Project Structure

```
simple-designer/
├── src-tauri/          # Rust backend
│   ├── src/
│   │   ├── main.rs     # Tauri entry point
│   │   └── commands.rs # Tauri commands
│   ├── Cargo.toml
│   └── tauri.conf.json
├── src/                # HTML/JS frontend
│   ├── index.html
│   ├── main.js
│   └── styles.css
└── icons/              # App icons
```

## Milestones

- **v0.1.0-phase1.1** (2024-10-30) - Tauri app with working viewport

## License

MIT License - See LICENSE file

## Contributing

Early-stage project. Contributions welcome once Phase 1.2 is complete.