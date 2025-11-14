// MANDATE: Shape definitions and material batching
#![deny(warnings)]

use crate::layer::LayerId;
use crate::render::pipeline::InstanceData;
use glam::{Mat3, Vec2, Vec4};
use serde::{Deserialize, Serialize};

/// Shape ID type.
/// MANDATE: Type alias for clarity.
pub type ShapeId = u64;

/// Material type for batching.
/// MANDATE: Deterministic ordering.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum MaterialType {
    SolidColor,
    Textured,
}

/// Shape definition.
/// MANDATE: Bounded data structure.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Shape {
    pub id: ShapeId,
    pub layer_id: LayerId,
    pub position: Vec2,
    pub size: Vec2,
    pub color: Vec4,
    pub z_order: i32,
    pub material: MaterialType,
}

impl Shape {
    /// Create new shape.
    /// MANDATE: ≤60 SLOC, validated inputs.
    pub fn new(id: ShapeId, layer_id: LayerId, position: Vec2, size: Vec2) -> Self {
        // MANDATE: Input validation
        assert!(size.x > 0.0);
        assert!(size.y > 0.0);

        Self {
            id,
            layer_id,
            position,
            size,
            color: Vec4::new(1.0, 1.0, 1.0, 1.0),
            z_order: 0,
            material: MaterialType::SolidColor,
        }
    }

    /// Set color.
    /// MANDATE: ≤60 SLOC.
    pub fn set_color(&mut self, color: Vec4) {
        // MANDATE: Input validation
        assert!(color.x >= 0.0 && color.x <= 1.0);
        assert!(color.y >= 0.0 && color.y <= 1.0);
        assert!(color.z >= 0.0 && color.z <= 1.0);
        assert!(color.w >= 0.0 && color.w <= 1.0);

        self.color = color;
    }

    /// Convert to instance data.
    /// MANDATE: ≤60 SLOC, deterministic conversion.
    pub fn to_instance_data(&self, layer_transform: Mat3) -> InstanceData {
        // Build transform matrix: translate -> scale
        let transform = Mat3::from_scale_angle_translation(self.size, 0.0, self.position)
            * layer_transform;

        InstanceData {
            transform_0: [
                transform.x_axis.x,
                transform.x_axis.y,
                transform.x_axis.z,
                0.0,
            ],
            transform_1: [
                transform.y_axis.x,
                transform.y_axis.y,
                transform.y_axis.z,
                0.0,
            ],
            transform_2: [
                transform.z_axis.x,
                transform.z_axis.y,
                transform.z_axis.z,
                0.0,
            ],
            color: self.color.to_array(),
        }
    }

    /// Get bounding box.
    /// MANDATE: ≤60 SLOC, deterministic bounds.
    pub fn bounding_box(&self) -> (Vec2, Vec2) {
        let min = self.position;
        let max = self.position + self.size;
        (min, max)
    }
}

/// Sort shapes by z-order.
/// MANDATE: ≤60 SLOC, deterministic sorting.
pub fn sort_by_z_order(shapes: &mut [Shape]) {
    // MANDATE: Deterministic sort by z_order then ID
    shapes.sort_by(|a, b| a.z_order.cmp(&b.z_order).then_with(|| a.id.cmp(&b.id)));
}

/// Group shapes by material.
/// MANDATE: ≤60 SLOC, deterministic grouping.
pub fn group_by_material(shapes: &[Shape]) -> Vec<Vec<&Shape>> {
    let mut solid_color = Vec::new();
    let mut textured = Vec::new();

    for shape in shapes {
        match shape.material {
            MaterialType::SolidColor => solid_color.push(shape),
            MaterialType::Textured => textured.push(shape),
        }
    }

    vec![solid_color, textured]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_shape_new() {
        let shape = Shape::new(1, 10, Vec2::new(0.0, 0.0), Vec2::new(10.0, 10.0));
        assert_eq!(shape.id, 1);
        assert_eq!(shape.layer_id, 10);
    }

    #[test]
    fn test_shape_bounding_box() {
        let shape = Shape::new(1, 10, Vec2::new(5.0, 5.0), Vec2::new(10.0, 10.0));
        let (min, max) = shape.bounding_box();
        assert_eq!(min, Vec2::new(5.0, 5.0));
        assert_eq!(max, Vec2::new(15.0, 15.0));
    }

    #[test]
    fn test_sort_by_z_order() {
        let mut shapes = vec![
            Shape::new(1, 1, Vec2::ZERO, Vec2::ONE),
            Shape::new(2, 1, Vec2::ZERO, Vec2::ONE),
        ];
        shapes[0].z_order = 10;
        shapes[1].z_order = 5;

        sort_by_z_order(&mut shapes);
        assert_eq!(shapes[0].id, 2);
        assert_eq!(shapes[1].id, 1);
    }

    #[test]
    fn test_group_by_material() {
        let mut shapes = vec![
            Shape::new(1, 1, Vec2::ZERO, Vec2::ONE),
            Shape::new(2, 1, Vec2::ZERO, Vec2::ONE),
        ];
        shapes[0].material = MaterialType::SolidColor;
        shapes[1].material = MaterialType::Textured;

        let groups = group_by_material(&shapes);
        assert_eq!(groups[0].len(), 1);
        assert_eq!(groups[1].len(), 1);
    }
}
