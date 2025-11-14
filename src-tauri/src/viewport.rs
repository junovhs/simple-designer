// MANDATE: Viewport pan/zoom transforms
#![deny(warnings)]
#![allow(dead_code)]

use glam::{Mat3, Vec2};

/// Zoom limits.
/// MANDATE: Bounded values.
const MIN_ZOOM: f32 = 0.1;
const MAX_ZOOM: f32 = 10.0;

/// Viewport state.
/// MANDATE: Deterministic transforms.
#[derive(Debug, Clone, Copy)]
pub struct Viewport {
    pub offset: Vec2,
    pub zoom: f32,
    pub screen_width: f32,
    pub screen_height: f32,
}

impl Viewport {
    /// Create new viewport.
    /// MANDATE: ≤60 SLOC, validated inputs.
    pub fn new(screen_width: f32, screen_height: f32) -> Self {
        // MANDATE: Input validation
        assert!(screen_width > 0.0);
        assert!(screen_height > 0.0);

        Self {
            offset: Vec2::ZERO,
            zoom: 1.0,
            screen_width,
            screen_height,
        }
    }

    /// Pan by screen delta.
    /// MANDATE: ≤60 SLOC, bounded operation.
    pub fn pan(&mut self, delta_x: f32, delta_y: f32) {
        // MANDATE: Assertions
        assert!(self.zoom > 0.0);

        self.offset.x += delta_x / self.zoom;
        self.offset.y += delta_y / self.zoom;
    }

    /// Zoom at screen point.
    /// MANDATE: ≤60 SLOC, bounded zoom.
    pub fn zoom_at(&mut self, factor: f32, screen_x: f32, screen_y: f32) {
        // MANDATE: Input validation
        assert!(factor > 0.0);
        assert!(screen_x >= 0.0 && screen_x <= self.screen_width);
        assert!(screen_y >= 0.0 && screen_y <= self.screen_height);

        let old_zoom = self.zoom;
        self.zoom = (self.zoom * factor).clamp(MIN_ZOOM, MAX_ZOOM);

        // Adjust offset to zoom toward mouse position
        let zoom_ratio = self.zoom / old_zoom;
        let world_point = self.screen_to_world(screen_x, screen_y);
        self.offset = world_point - (world_point - self.offset) * zoom_ratio;
    }

    /// Convert screen to world coordinates.
    /// MANDATE: ≤60 SLOC, deterministic math.
    pub fn screen_to_world(&self, screen_x: f32, screen_y: f32) -> Vec2 {
        // MANDATE: Assertions
        assert!(self.zoom > 0.0);

        let ndc_x = (screen_x / self.screen_width) * 2.0 - 1.0;
        let ndc_y = 1.0 - (screen_y / self.screen_height) * 2.0;

        Vec2::new(ndc_x / self.zoom, ndc_y / self.zoom) + self.offset
    }

    /// Convert world to screen coordinates.
    /// MANDATE: ≤60 SLOC, deterministic math.
    pub fn world_to_screen(&self, world_x: f32, world_y: f32) -> Vec2 {
        // MANDATE: Assertions
        assert!(self.zoom > 0.0);

        let world = Vec2::new(world_x, world_y);
        let view = (world - self.offset) * self.zoom;

        let screen_x = (view.x + 1.0) * self.screen_width * 0.5;
        let screen_y = (1.0 - view.y) * self.screen_height * 0.5;

        Vec2::new(screen_x, screen_y)
    }

    /// Get view matrix.
    /// MANDATE: ≤60 SLOC, static math.
    pub fn view_matrix(&self) -> Mat3 {
        // MANDATE: Assertions
        assert!(self.zoom > 0.0);

        Mat3::from_scale_angle_translation(
            Vec2::splat(self.zoom),
            0.0,
            -self.offset * self.zoom,
        )
    }

    /// Get visible world bounds.
    /// MANDATE: ≤60 SLOC, deterministic bounds.
    pub fn visible_bounds(&self) -> (Vec2, Vec2) {
        // MANDATE: Assertions
        assert!(self.zoom > 0.0);

        let top_left = self.screen_to_world(0.0, 0.0);
        let bottom_right = self.screen_to_world(self.screen_width, self.screen_height);

        let min = Vec2::new(top_left.x.min(bottom_right.x), top_left.y.min(bottom_right.y));
        let max = Vec2::new(top_left.x.max(bottom_right.x), top_left.y.max(bottom_right.y));

        (min, max)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_viewport_new() {
        let vp = Viewport::new(800.0, 600.0);
        assert_eq!(vp.zoom, 1.0);
        assert_eq!(vp.offset, Vec2::ZERO);
    }

    #[test]
    fn test_viewport_pan() {
        let mut vp = Viewport::new(800.0, 600.0);
        vp.pan(100.0, 50.0);
        assert_eq!(vp.offset.x, 100.0);
        assert_eq!(vp.offset.y, 50.0);
    }

    #[test]
    fn test_zoom_bounds() {
        let mut vp = Viewport::new(800.0, 600.0);
        vp.zoom_at(100.0, 400.0, 300.0);
        assert_eq!(vp.zoom, MAX_ZOOM);

        vp.zoom_at(0.001, 400.0, 300.0);
        assert_eq!(vp.zoom, MIN_ZOOM);
    }
}
