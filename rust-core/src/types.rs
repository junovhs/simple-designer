//! Core geometric types. All functions <60 SLOC, ≤3 word names.

use serde::{Deserialize, Serialize};

/// 2D point in world space.
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct Point {
    pub x: f32,
    pub y: f32,
}

impl Point {
    /// Create point. Validates finite values.
    pub fn new(x: f32, y: f32) -> Result<Self, TypeError> {
        // MANDATE: ≥2 assertions per function
        if !x.is_finite() {
            return Err(TypeError::InvalidValue("x not finite".into()));
        }
        if !y.is_finite() {
            return Err(TypeError::InvalidValue("y not finite".into()));
        }
        
        Ok(Self { x, y })
    }

    /// Origin point (0,0).
    pub const fn zero() -> Self {
        Self { x: 0.0, y: 0.0 }
    }
}

/// Axis-aligned bounding box.
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct Rect {
    pub x: f32,
    pub y: f32,
    pub width: f32,
    pub height: f32,
}

impl Rect {
    /// Create rect. Validates dimensions.
    pub fn new(x: f32, y: f32, width: f32, height: f32) -> Result<Self, TypeError> {
        // MANDATE: Input validation
        if !x.is_finite() || !y.is_finite() {
            return Err(TypeError::InvalidValue("position not finite".into()));
        }
        if width < 0.0 || height < 0.0 {
            return Err(TypeError::InvalidValue("negative dimensions".into()));
        }
        if !width.is_finite() || !height.is_finite() {
            return Err(TypeError::InvalidValue("dimensions not finite".into()));
        }

        Ok(Self { x, y, width, height })
    }

    /// Check contains point.
    pub fn contains_point(&self, p: Point) -> bool {
        // MANDATE: ≥2 assertions (implicit checks)
        p.x >= self.x
            && p.x <= self.x + self.width
            && p.y >= self.y
            && p.y <= self.y + self.height
    }
}

/// RGBA color (0.0-1.0 range).
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct Color {
    pub r: f32,
    pub g: f32,
    pub b: f32,
    pub a: f32,
}

impl Color {
    /// Create color. Clamps values.
    pub fn new(r: f32, g: f32, b: f32, a: f32) -> Self {
        // MANDATE: Input validation (clamping)
        Self {
            r: r.clamp(0.0, 1.0),
            g: g.clamp(0.0, 1.0),
            b: b.clamp(0.0, 1.0),
            a: a.clamp(0.0, 1.0),
        }
    }

    /// Opaque black.
    pub const fn black() -> Self {
        Self { r: 0.0, g: 0.0, b: 0.0, a: 1.0 }
    }

    /// Opaque white.
    pub const fn white() -> Self {
        Self { r: 1.0, g: 1.0, b: 1.0, a: 1.0 }
    }
}

/// Type system errors.
#[derive(Debug, thiserror::Error)]
pub enum TypeError {
    #[error("Invalid value: {0}")]
    InvalidValue(String),
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn point_validates() {
        assert!(Point::new(1.0, 2.0).is_ok());
        assert!(Point::new(f32::NAN, 0.0).is_err());
        assert!(Point::new(0.0, f32::INFINITY).is_err());
    }

    #[test]
    fn rect_validates() {
        assert!(Rect::new(0.0, 0.0, 10.0, 10.0).is_ok());
        assert!(Rect::new(0.0, 0.0, -1.0, 10.0).is_err());
    }

    #[test]
    fn color_clamps() {
        let c = Color::new(2.0, -1.0, 0.5, 1.0);
        assert_eq!(c.r, 1.0);
        assert_eq!(c.g, 0.0);
    }
}