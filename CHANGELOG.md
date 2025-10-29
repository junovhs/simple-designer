# Changelog

All notable changes to Simple Designer will be documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/).

---

## [Unreleased]

### In Progress
- Phase 1.2: Instanced rendering pipeline

---

## [0.1.0] - 2024-10-29

### Added - Phase 1.1: WebGL Foundation
- **Rust Core** (WASM)
  - Core geometric types: Point, Rect, Color
  - Input validation with Result types
  - Zero warnings build (`#![deny(warnings)]`)
  - Full test coverage (7/7 tests passing)
  
- **Web Frontend** (React + TypeScript)
  - Three-layer canvas architecture (background/content/overlay)
  - WebGL context initialization with validation
  - WASM module loader with error handling
  - Zero-copy data flow between WASM and WebGL
  
- **Build System**
  - wasm-pack integration for Rust → WASM
  - Vite dev server with hot reload
  - TypeScript strict mode enabled
  - ESLint with zero-warnings policy

- **Documentation**
  - Project mandate (CODE_WITH_INTENT)
  - Git configuration (.gitignore, .gitattributes)
  - README with architecture overview
  - ROADMAP with phase breakdown

### Development Setup
- Cargo workspace for Rust
- npm workspace for frontend
- Automated build scripts
- Local dev server on port 3000

### Research Foundation
- 25 comprehensive research reports analyzed
- Architecture validated against Figma, Excalidraw, tldraw patterns
- WebGL performance benchmarks confirmed
- PWA capabilities mapped

---

## Project Start - 2024-10-29

- Initial architecture design
- Technology stack selection
- Mandate definition
- Research phase completed
