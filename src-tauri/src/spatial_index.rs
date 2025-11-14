// MANDATE: R-tree spatial indexing
#![deny(warnings)]

use glam::Vec2;
use rstar::{RTree, RTreeObject, AABB};

/// Shape ID type.
/// MANDATE: Type alias for clarity.
pub type ShapeId = u64;

/// Spatial entry for R-tree.
/// MANDATE: Bounded data structure.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct SpatialEntry {
    pub id: ShapeId,
    pub min: Vec2,
    pub max: Vec2,
}

impl SpatialEntry {
    /// Create new spatial entry.
    /// MANDATE: ≤60 SLOC, validated bounds.
    pub fn new(id: ShapeId, min: Vec2, max: Vec2) -> Self {
        // MANDATE: Assertions
        assert!(min.x <= max.x);
        assert!(min.y <= max.y);

        Self { id, min, max }
    }

    /// Area of bounding box.
    /// MANDATE: ≤60 SLOC, deterministic math.
    pub fn area(&self) -> f32 {
        let width = self.max.x - self.min.x;
        let height = self.max.y - self.min.y;

        // MANDATE: Assertions
        assert!(width >= 0.0);
        assert!(height >= 0.0);

        width * height
    }
}

impl RTreeObject for SpatialEntry {
    type Envelope = AABB<[f32; 2]>;

    fn envelope(&self) -> Self::Envelope {
        AABB::from_corners([self.min.x, self.min.y], [self.max.x, self.max.y])
    }
}

/// Spatial index for shapes.
/// MANDATE: O(log n) queries.
pub struct SpatialIndex {
    tree: RTree<SpatialEntry>,
}

impl SpatialIndex {
    /// Create empty index.
    /// MANDATE: ≤60 SLOC.
    pub fn new() -> Self {
        Self {
            tree: RTree::new(),
        }
    }

    /// Build index from entries.
    /// MANDATE: ≤60 SLOC, bulk loading.
    pub fn build(entries: Vec<SpatialEntry>) -> Self {
        // MANDATE: Assertions
        assert!(entries.len() <= 100_000);

        Self {
            tree: RTree::bulk_load(entries),
        }
    }

    /// Query shapes in rectangle.
    /// MANDATE: ≤60 SLOC, bounded output.
    pub fn query_rect(&self, min: Vec2, max: Vec2) -> Vec<ShapeId> {
        // MANDATE: Input validation
        assert!(min.x <= max.x);
        assert!(min.y <= max.y);

        let envelope = AABB::from_corners([min.x, min.y], [max.x, max.y]);

        self.tree
            .locate_in_envelope(&envelope)
            .map(|entry| entry.id)
            .collect()
    }

    /// Query shapes at point.
    /// MANDATE: ≤60 SLOC, bounded output.
    pub fn query_point(&self, point: Vec2) -> Vec<ShapeId> {
        let envelope = AABB::from_point([point.x, point.y]);

        self.tree
            .locate_in_envelope(&envelope)
            .map(|entry| entry.id)
            .collect()
    }

    /// Insert entry.
    /// MANDATE: ≤60 SLOC.
    pub fn insert(&mut self, entry: SpatialEntry) {
        self.tree.insert(entry);
    }

    /// Remove entry by ID.
    /// MANDATE: ≤60 SLOC, bounded operation.
    pub fn remove(&mut self, id: ShapeId) -> bool {
        let to_remove: Vec<_> = self
            .tree
            .iter()
            .filter(|e| e.id == id)
            .copied()
            .collect();

        // MANDATE: Assertions
        assert!(to_remove.len() <= 1);

        for entry in to_remove {
            self.tree.remove(&entry);
            return true;
        }

        false
    }

    /// Count entries.
    /// MANDATE: ≤60 SLOC.
    pub fn len(&self) -> usize {
        self.tree.size()
    }

    /// Check if empty.
    /// MANDATE: ≤60 SLOC.
    pub fn is_empty(&self) -> bool {
        self.tree.size() == 0
    }
}

impl Default for SpatialIndex {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_spatial_entry_new() {
        let entry = SpatialEntry::new(1, Vec2::new(0.0, 0.0), Vec2::new(1.0, 1.0));
        assert_eq!(entry.id, 1);
        assert_eq!(entry.area(), 1.0);
    }

    #[test]
    fn test_spatial_index_query() {
        let mut index = SpatialIndex::new();
        index.insert(SpatialEntry::new(1, Vec2::new(0.0, 0.0), Vec2::new(1.0, 1.0)));
        index.insert(SpatialEntry::new(2, Vec2::new(2.0, 2.0), Vec2::new(3.0, 3.0)));

        let results = index.query_rect(Vec2::new(0.0, 0.0), Vec2::new(1.5, 1.5));
        assert_eq!(results.len(), 1);
        assert_eq!(results[0], 1);
    }

    #[test]
    fn test_spatial_index_remove() {
        let mut index = SpatialIndex::new();
        index.insert(SpatialEntry::new(1, Vec2::new(0.0, 0.0), Vec2::new(1.0, 1.0)));
        assert_eq!(index.len(), 1);

        let removed = index.remove(1);
        assert!(removed);
        assert_eq!(index.len(), 0);
    }

    #[test]
    fn test_spatial_index_build() {
        let entries = vec![
            SpatialEntry::new(1, Vec2::new(0.0, 0.0), Vec2::new(1.0, 1.0)),
            SpatialEntry::new(2, Vec2::new(2.0, 2.0), Vec2::new(3.0, 3.0)),
            SpatialEntry::new(3, Vec2::new(4.0, 4.0), Vec2::new(5.0, 5.0)),
        ];

        let index = SpatialIndex::build(entries);
        assert_eq!(index.len(), 3);

        let results = index.query_rect(Vec2::new(0.0, 0.0), Vec2::new(2.5, 2.5));
        assert_eq!(results.len(), 2);
    }

    #[test]
    fn test_spatial_index_query_point() {
        let mut index = SpatialIndex::new();
        index.insert(SpatialEntry::new(1, Vec2::new(0.0, 0.0), Vec2::new(2.0, 2.0)));
        index.insert(SpatialEntry::new(2, Vec2::new(5.0, 5.0), Vec2::new(7.0, 7.0)));

        let results = index.query_point(Vec2::new(1.0, 1.0));
        assert_eq!(results.len(), 1);
        assert_eq!(results[0], 1);

        let results = index.query_point(Vec2::new(10.0, 10.0));
        assert_eq!(results.len(), 0);
    }

    #[test]
    fn test_spatial_index_is_empty() {
        let index = SpatialIndex::new();
        assert!(index.is_empty());

        let mut index = SpatialIndex::new();
        index.insert(SpatialEntry::new(1, Vec2::new(0.0, 0.0), Vec2::new(1.0, 1.0)));
        assert!(!index.is_empty());
    }
}
