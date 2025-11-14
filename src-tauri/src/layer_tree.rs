// MANDATE: Layer hierarchy management
#![deny(warnings)]
#![allow(dead_code)]

use crate::layer::{Layer, LayerId};
use std::collections::HashMap;

/// Maximum layers limit.
/// MANDATE: Bounded allocation.
const MAX_LAYERS: usize = 1000;

/// Layer tree (flat for Phase 1).
/// MANDATE: Bounded data structure.
pub struct LayerTree {
    layers: HashMap<LayerId, Layer>,
    next_id: LayerId,
}

impl LayerTree {
    /// Create new layer tree.
    /// MANDATE: ≤60 SLOC.
    pub fn new() -> Self {
        Self {
            layers: HashMap::new(),
            next_id: 1,
        }
    }

    /// Add new layer.
    /// MANDATE: ≤60 SLOC, bounded capacity.
    pub fn add_layer(&mut self, name: String) -> Result<LayerId, String> {
        // MANDATE: Input validation
        assert!(!name.is_empty());

        if self.layers.len() >= MAX_LAYERS {
            return Err("Max layers reached".to_string());
        }

        let id = self.next_id;
        self.next_id += 1;

        let layer = Layer::new(id, name);
        self.layers.insert(id, layer);

        Ok(id)
    }

    /// Get layer by ID.
    /// MANDATE: ≤60 SLOC.
    pub fn get_layer(&self, id: LayerId) -> Option<&Layer> {
        self.layers.get(&id)
    }

    /// Get mutable layer.
    /// MANDATE: ≤60 SLOC.
    pub fn get_layer_mut(&mut self, id: LayerId) -> Option<&mut Layer> {
        self.layers.get_mut(&id)
    }

    /// Remove layer.
    /// MANDATE: ≤60 SLOC.
    pub fn remove_layer(&mut self, id: LayerId) -> bool {
        self.layers.remove(&id).is_some()
    }

    /// Get all layers sorted.
    /// MANDATE: ≤60 SLOC, deterministic order.
    pub fn get_sorted_layers(&self) -> Vec<&Layer> {
        let mut layers: Vec<&Layer> = self.layers.values().collect();

        // MANDATE: Deterministic sorting by z-order then ID
        layers.sort_by(|a, b| {
            a.z_order
                .cmp(&b.z_order)
                .then_with(|| a.id.cmp(&b.id))
        });

        layers
    }

    /// Get renderable layers.
    /// MANDATE: ≤60 SLOC, filtered output.
    pub fn get_renderable(&self) -> Vec<&Layer> {
        self.get_sorted_layers()
            .into_iter()
            .filter(|layer| layer.is_renderable())
            .collect()
    }

    /// Count layers.
    /// MANDATE: ≤60 SLOC.
    pub fn len(&self) -> usize {
        self.layers.len()
    }

    /// Check if empty.
    /// MANDATE: ≤60 SLOC.
    pub fn is_empty(&self) -> bool {
        self.layers.is_empty()
    }

    /// Clear all layers.
    /// MANDATE: ≤60 SLOC.
    pub fn clear(&mut self) {
        self.layers.clear();
        self.next_id = 1;
    }
}

impl Default for LayerTree {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_layer_tree_new() {
        let tree = LayerTree::new();
        assert_eq!(tree.len(), 0);
        assert!(tree.is_empty());
    }

    #[test]
    fn test_add_layer() {
        let mut tree = LayerTree::new();
        let id = tree.add_layer("Layer 1".to_string()).unwrap();
        assert_eq!(tree.len(), 1);

        let layer = tree.get_layer(id).unwrap();
        assert_eq!(layer.name, "Layer 1");
    }

    #[test]
    fn test_remove_layer() {
        let mut tree = LayerTree::new();
        let id = tree.add_layer("Layer 1".to_string()).unwrap();
        assert_eq!(tree.len(), 1);

        let removed = tree.remove_layer(id);
        assert!(removed);
        assert_eq!(tree.len(), 0);
    }

    #[test]
    fn test_sorted_layers() {
        let mut tree = LayerTree::new();
        let id1 = tree.add_layer("Layer 1".to_string()).unwrap();
        let id2 = tree.add_layer("Layer 2".to_string()).unwrap();

        tree.get_layer_mut(id1).unwrap().set_z_order(10);
        tree.get_layer_mut(id2).unwrap().set_z_order(5);

        let sorted = tree.get_sorted_layers();
        assert_eq!(sorted[0].id, id2);
        assert_eq!(sorted[1].id, id1);
    }

    #[test]
    fn test_max_layers() {
        let mut tree = LayerTree::new();
        for i in 0..MAX_LAYERS {
            tree.add_layer(format!("Layer {}", i)).unwrap();
        }

        let result = tree.add_layer("Overflow".to_string());
        assert!(result.is_err());
    }
}
