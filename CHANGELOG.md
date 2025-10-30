# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Instanced rendering pipeline using wgpu for GPU acceleration.

---

## [0.1.0] - 2024-10-30

### Added
- Native desktop application window using Tauri.
- Infinite canvas with pan (drag) and zoom (scroll) controls.
- High-DPI display support.
- Bridge for communication between Rust backend and JavaScript frontend.

### Changed
- **Major Architecture Pivot:** Migrated the entire application from a WebGL/PWA to a native Tauri application with a direct Rust backend.

### Removed
- All previous WebGL, WASM, and React-based frontend code.

---