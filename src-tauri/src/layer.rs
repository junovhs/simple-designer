// MANDATE: Layer metadata and properties
#![deny(warnings)]

use glam::Mat3;
use serde::{Deserialize, Serialize};

/// Layer ID type.
/// MANDATE: Type alias for clarity.
pub type LayerId = u64;

/// Layer metadata.
/// MANDATE: Bounded data structure.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Layer {
    pub id: LayerId,
    pub name: String,
    pub visible: bool,
    pub opacity: f32,
    pub z_order: i32,
    pub transform: Mat3,
}

impl Layer {
    /// Create new layer.
    /// MANDATE: ≤60 SLOC, validated inputs.
    pub fn new(id: LayerId, name: String) -> Self {
        // MANDATE: Input validation
        assert!(!name.is_empty());
        assert!(name.len() <= 256);

        Self {
            id,
            name,
            visible: true,
            opacity: 1.0,
            z_order: 0,
            transform: Mat3::IDENTITY,
        }
    }

    /// Set visibility.
    /// MANDATE: ≤60 SLOC.
    pub fn set_visible(&mut self, visible: bool) {
        self.visible = visible;
    }

    /// Set opacity.
    /// MANDATE: ≤60 SLOC, clamped value.
    pub fn set_opacity(&mut self, opacity: f32) {
        // MANDATE: Input validation
        assert!(opacity >= 0.0);
        assert!(opacity <= 1.0);

        self.opacity = opacity.clamp(0.0, 1.0);
    }

    /// Set z-order.
    /// MANDATE: ≤60 SLOC, bounded value.
    pub fn set_z_order(&mut self, z_order: i32) {
        // MANDATE: Input validation
        assert!(z_order >= -10000);
        assert!(z_order <= 10000);

        self.z_order = z_order;
    }

    /// Set transform.
    /// MANDATE: ≤60 SLOC.
    pub fn set_transform(&mut self, transform: Mat3) {
        self.transform = transform;
    }

    /// Check if layer is renderable.
    /// MANDATE: ≤60 SLOC, simple logic.
    pub fn is_renderable(&self) -> bool {
        self.visible && self.opacity > 0.0
    }
}

impl Default for Layer {
    fn default() -> Self {
        Self::new(0, "Layer".to_string())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_layer_new() {
        let layer = Layer::new(1, "Test Layer".to_string());
        assert_eq!(layer.id, 1);
        assert_eq!(layer.name, "Test Layer");
        assert!(layer.visible);
        assert_eq!(layer.opacity, 1.0);
    }

    #[test]
    fn test_layer_visibility() {
        let mut layer = Layer::new(1, "Test".to_string());
        layer.set_visible(false);
        assert!(!layer.visible);
        assert!(!layer.is_renderable());
    }

    #[test]
    fn test_layer_opacity() {
        let mut layer = Layer::new(1, "Test".to_string());
        layer.set_opacity(0.5);
        assert_eq!(layer.opacity, 0.5);

        layer.set_opacity(0.0);
        assert!(!layer.is_renderable());
    }

    #[test]
    fn test_layer_z_order() {
        let mut layer = Layer::new(1, "Test".to_string());
        layer.set_z_order(10);
        assert_eq!(layer.z_order, 10);
    }

    #[test]
    fn test_layer_set_transform() {
        let mut layer = Layer::new(1, "Test".to_string());
        let transform = Mat3::from_scale_angle_translation(
            glam::Vec2::new(2.0, 2.0),
            0.0,
            glam::Vec2::new(10.0, 20.0),
        );
        layer.set_transform(transform);
        assert_eq!(layer.transform, transform);
    }
}
