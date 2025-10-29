//! Simple Designer - WASM core.
//! MANDATE: All functions <60 SLOC, ≤3 words, ≥2 assertions.

#![deny(warnings)]
#![deny(clippy::all)]

mod types;

use wasm_bindgen::prelude::*;

pub use types::{Color, Point, Rect, TypeError};

/// Initialize WASM module.
#[wasm_bindgen(start)]
pub fn init() {
    // MANDATE: Simple approach - no panic hook dependency yet
    web_sys::console::log_1(&"WASM initialized".into());
}

/// Get version string.
#[wasm_bindgen]
pub fn version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn version_exists() {
        let v = version();
        assert!(!v.is_empty());
        assert!(v.contains('.'));
    }
}