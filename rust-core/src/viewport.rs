//! Viewport with pan/zoom transforms. Functions <60 SLOC, ≤3 words.

use crate::types::{Point, Rect};
use serde::{Deserialize, Serialize};

/// Zoom limits (mandate: bounded).
const MIN_ZOOM: f32 = 0.1;
const MAX_ZOOM: f32 = 10.0;

/// Viewport state for pan/zoom.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Viewport {
    /// Pan offset (world space).
    pub offset_x: f32,
    pub offset_y: f32,
    /// Zoom level (1.0 = 100%).
    pub zoom: f32,
    /// Canvas dimensions (screen space).
    pub width: f32,
    pub height: f32,
}

impl Viewport {
    /// Create viewport with validation.
    pub fn new(width: f32, height: f32) -> Result<Self, ViewportError> {
        // MANDATE: ≥2 checks
        if !width.is_finite() || width <= 0.0 {
            return Err(ViewportError::InvalidSize("width invalid".into()));
        }
        if !height.is_finite() || height <= 0.0 {
            return Err(ViewportError::InvalidSize("height invalid".into()));
        }

        Ok(Self {
            offset_x: 0.0,
            offset_y: 0.0,
            zoom: 1.0,
            width,
            height,
        })
    }

    /// Pan by delta (screen space).
    pub fn pan(&mut self, dx: f32, dy: f32) -> Result<(), ViewportError> {
        // MANDATE: Input validation
        if !dx.is_finite() || !dy.is_finite() {
            return Err(ViewportError::InvalidValue("delta not finite".into()));
        }

        // Convert screen delta to world delta
        let world_dx = dx / self.zoom;
        let world_dy = dy / self.zoom;

        self.offset_x += world_dx;
        self.offset_y += world_dy;

        Ok(())
    }

    /// Zoom around point (screen space).
    pub fn zoom_at(&mut self, screen_x: f32, screen_y: f32, factor: f32) -> Result<(), ViewportError> {
        // MANDATE: Input validation
        if !screen_x.is_finite() || !screen_y.is_finite() {
            return Err(ViewportError::InvalidValue("position not finite".into()));
        }
        if !factor.is_finite() || factor <= 0.0 {
            return Err(ViewportError::InvalidValue("zoom factor invalid".into()));
        }

        // Get world point before zoom
        let world_before = self.screen_to_world(screen_x, screen_y)?;

        // Apply zoom with bounds
        let new_zoom = (self.zoom * factor).clamp(MIN_ZOOM, MAX_ZOOM);
        self.zoom = new_zoom;

        // Get world point after zoom
        let world_after = self.screen_to_world(screen_x, screen_y)?;

        // Adjust offset to keep point stable
        self.offset_x += world_before.x - world_after.x;
        self.offset_y += world_before.y - world_after.y;

        Ok(())
    }

    /// Convert screen to world coordinates.
    pub fn screen_to_world(&self, screen_x: f32, screen_y: f32) -> Result<Point, ViewportError> {
        // MANDATE: Input validation
        if !screen_x.is_finite() || !screen_y.is_finite() {
            return Err(ViewportError::InvalidValue("position not finite".into()));
        }

        // Normalize to -1..1
        let norm_x = (screen_x / self.width) * 2.0 - 1.0;
        let norm_y = -((screen_y / self.height) * 2.0 - 1.0);

        // Apply zoom and offset
        let world_x = norm_x / self.zoom + self.offset_x;
        let world_y = norm_y / self.zoom + self.offset_y;

        Point::new(world_x, world_y)
            .map_err(|e| ViewportError::InvalidValue(format!("world point: {}", e)))
    }

    /// Get visible world rect.
    pub fn visible_rect(&self) -> Result<Rect, ViewportError> {
        // Calculate world-space dimensions
        let world_width = (self.width / self.zoom) * 2.0;
        let world_height = (self.height / self.zoom) * 2.0;

        let x = self.offset_x - world_width / 2.0;
        let y = self.offset_y - world_height / 2.0;

        Rect::new(x, y, world_width, world_height)
            .map_err(|e| ViewportError::InvalidValue(format!("visible rect: {}", e)))
    }
}

/// Viewport errors.
#[derive(Debug, thiserror::Error)]
pub enum ViewportError {
    #[error("Invalid size: {0}")]
    InvalidSize(String),
    #[error("Invalid value: {0}")]
    InvalidValue(String),
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn viewport_creates() {
        let vp = Viewport::new(800.0, 600.0);
        assert!(vp.is_ok());
        let vp = vp.unwrap();
        assert_eq!(vp.zoom, 1.0);
        assert_eq!(vp.offset_x, 0.0);
    }

    #[test]
    fn viewport_validates() {
        assert!(Viewport::new(0.0, 600.0).is_err());
        assert!(Viewport::new(800.0, -1.0).is_err());
        assert!(Viewport::new(f32::NAN, 600.0).is_err());
    }

    #[test]
    fn pan_updates() {
        let mut vp = Viewport::new(800.0, 600.0).unwrap();
        assert!(vp.pan(100.0, 50.0).is_ok());
        assert_ne!(vp.offset_x, 0.0);
    }

    #[test]
    fn zoom_bounded() {
        let mut vp = Viewport::new(800.0, 600.0).unwrap();
        assert!(vp.zoom_at(400.0, 300.0, 100.0).is_ok());
        assert_eq!(vp.zoom, MAX_ZOOM);
        assert!(vp.zoom_at(400.0, 300.0, 0.01).is_ok());
        assert_eq!(vp.zoom, MIN_ZOOM);
    }

    #[test]
    fn screen_to_world_works() {
        let vp = Viewport::new(800.0, 600.0).unwrap();
        let world = vp.screen_to_world(400.0, 300.0).unwrap();
        // Center of screen should map to offset
        assert!((world.x - vp.offset_x).abs() < 0.01);
        assert!((world.y - vp.offset_y).abs() < 0.01);
    }
}