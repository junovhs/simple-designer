# Simple Designer

Open-source, high-performance design tool running entirely in the browser.

## Architecture

**Hybrid WASM + WebGL Stack:**
- **Rust Core** → Compiled to WebAssembly for compute-intensive operations
- **WebGL Renderer** → GPU-accelerated rendering for 1000+ objects at 60fps
- **React Frontend** → UI layer and browser API orchestration
- **Progressive Web App** → Installable, works offline

## Current Status: Phase 1 - Foundation (In Progress)

✅ **Phase 1.1: WebGL Foundation** (COMPLETE)
- Three-layer canvas architecture (background/content/overlay)
- WebGL context initialization with validation
- Zero-copy data flow (Rust → WASM → WebGL)
- Error handling and graceful degradation

🚧 **Phase 1.2: Instanced Rendering Pipeline** (NEXT)
- Shader compilation (vertex + fragment)
- Instance buffer for 10k objects
- Render 100+ rectangles as proof-of-concept
- Performance validation (<5ms for 10k objects)

See [ROADMAP.md](./ROADMAP.md) for full feature plan.

## Tech Stack

**Rust Core:**
- `wasm-bindgen` - JS interop
- `glam` - Fast SIMD math
- `rstar` - Spatial indexing (R-tree)
- `serde` - Serialization
- `thiserror` - Error types

**Web Frontend:**
- React 18 + TypeScript (strict mode)
- Vite - Build tooling
- WebGL 1.0 (upgradable to WebGL2/WebGPU)

## Development

### Prerequisites
- Rust 1.70+ with `wasm32-unknown-unknown` target
- Node.js 18+
- wasm-pack

### Build & Run

```bash
# Install wasm-pack (once)
cargo install wasm-pack

# Build Rust → WASM
cd rust-core
wasm-pack build --target web

# Run dev server
cd ../web-frontend
npm install
npm run dev
```

Open `http://localhost:3000`

### Testing

```bash
# Rust tests
cd rust-core
cargo test
cargo clippy

# TypeScript linting
cd web-frontend
npm run lint
```

## Code Mandate

This project follows strict development principles (see `docs/MANDATE.md`):

- ✅ Functions ≤60 SLOC, names ≤3 words
- ✅ No recursion, bounded loops only
- ✅ ≥2 assertions per function (average)
- ✅ Zero warnings (`#![deny(warnings)]`)
- ✅ All Results checked, no `unwrap()` outside tests
- ✅ Static dispatch, deterministic behavior

## Project Structure

```
simple-designer/
├── rust-core/          # WASM core logic
│   ├── src/
│   │   ├── lib.rs      # WASM exports
│   │   └── types.rs    # Geometric primitives
│   └── tests/
├── web-frontend/       # React + WebGL
│   ├── src/
│   │   ├── main.tsx    # Entry point
│   │   ├── App.tsx     # Root component
│   │   ├── Canvas.tsx  # Three-layer canvas
│   │   ├── wasm.ts     # WASM loader
│   │   └── webgl.ts    # WebGL utilities
│   └── public/
└── docs/               # Documentation
```

## License

MIT License - See LICENSE file

## Contributing

This is an early-stage project. Contributions welcome once Phase 1 is complete.

## Research

This architecture is informed by 25 comprehensive research reports analyzing:
- Figma's rendering pipeline
- WebGL performance patterns
- WASM boundary optimization
- PWA capabilities and constraints