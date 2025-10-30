//! R-tree spatial index for viewport culling. Functions <60 SLOC.

use crate::types::Rect;
use rstar::{RTree, AABB};
use serde::{Deserialize, Serialize};

/// Spatial object ID.
pub type ObjectId = u32;

/// Object with bounds for spatial indexing.
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct SpatialObject {
    pub id: ObjectId,
    pub bounds: Rect,
}

impl rstar::RTreeObject for SpatialObject {
    type Envelope = AABB<[f32; 2]>;

    fn envelope(&self) -> Self::Envelope {
        let min = [self.bounds.x, self.bounds.y];
        let max = [
            self.bounds.x + self.bounds.width,
            self.bounds.y + self.bounds.height,
        ];
        AABB::from_corners(min, max)
    }
}

/// Spatial index wrapper.
pub struct SpatialIndex {
    tree: RTree<SpatialObject>,
}

impl SpatialIndex {
    /// Create empty index.
    pub fn new() -> Self {
        Self {
            tree: RTree::new(),
        }
    }

    /// Build index from objects.
    /// MANDATE: Bounded operation, no post-init allocs in hot path.
    pub fn build(objects: Vec<SpatialObject>) -> Result<Self, IndexError> {
        // MANDATE: Bounds check
        const MAX_OBJECTS: usize = 100_000;
        if objects.len() > MAX_OBJECTS {
            return Err(IndexError::TooManyObjects {
                count: objects.len(),
                max: MAX_OBJECTS,
            });
        }

        Ok(Self {
            tree: RTree::bulk_load(objects),
        })
    }

    /// Query objects in rect.
    /// MANDATE: O(log n) performance via spatial index.
    pub fn query(&self, viewport: &Rect) -> Vec<ObjectId> {
        let min = [viewport.x, viewport.y];
        let max = [
            viewport.x + viewport.width,
            viewport.y + viewport.height,
        ];
        let aabb = AABB::from_corners(min, max);

        // MANDATE: Bounded result allocation
        let mut results = Vec::with_capacity(1024);
        
        for obj in self.tree.locate_in_envelope(&aabb) {
            results.push(obj.id);
            
            // MANDATE: Safety limit
            if results.len() >= 10_000 {
                break;
            }
        }

        results
    }

    /// Get object count.
    pub fn len(&self) -> usize {
        self.tree.size()
    }

    /// Check if empty.
    pub fn is_empty(&self) -> bool {
        self.tree.size() == 0
    }
}

/// Index errors.
#[derive(Debug, thiserror::Error)]
pub enum IndexError {
    #[error("Too many objects: {count} (max: {max})")]
    TooManyObjects { count: usize, max: usize },
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn index_creates() {
        let idx = SpatialIndex::new();
        assert!(idx.is_empty());
    }

    #[test]
    fn index_builds() {
        let obj = SpatialObject {
            id: 1,
            bounds: Rect::new(0.0, 0.0, 10.0, 10.0).unwrap(),
        };
        let idx = SpatialIndex::build(vec![obj]).unwrap();
        assert_eq!(idx.len(), 1);
    }

    #[test]
    fn query_finds() {
        let obj = SpatialObject {
            id: 1,
            bounds: Rect::new(5.0, 5.0, 10.0, 10.0).unwrap(),
        };
        let idx = SpatialIndex::build(vec![obj]).unwrap();
        
        let viewport = Rect::new(0.0, 0.0, 20.0, 20.0).unwrap();
        let results = idx.query(&viewport);
        
        assert_eq!(results.len(), 1);
        assert_eq!(results[0], 1);
    }

    #[test]
    fn query_filters() {
        let obj = SpatialObject {
            id: 1,
            bounds: Rect::new(100.0, 100.0, 10.0, 10.0).unwrap(),
        };
        let idx = SpatialIndex::build(vec![obj]).unwrap();
        
        let viewport = Rect::new(0.0, 0.0, 20.0, 20.0).unwrap();
        let results = idx.query(&viewport);
        
        assert_eq!(results.len(), 0);
    }
}