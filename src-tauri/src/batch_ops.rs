// MANDATE: Batch operations for transforms
#![deny(warnings)]

use crate::layer::LayerId;
use glam::Mat3;
use serde::{Deserialize, Serialize};

/// Maximum batch size.
/// MANDATE: Bounded allocation.
const MAX_BATCH_SIZE: usize = 10_000;

/// Transform update operation.
/// MANDATE: Bounded data structure.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TransformUpdate {
    pub id: LayerId,
    pub transform: Mat3,
}

impl TransformUpdate {
    /// Create new transform update.
    /// MANDATE: ≤60 SLOC.
    pub fn new(id: LayerId, transform: Mat3) -> Self {
        Self { id, transform }
    }
}

/// Batch of transform updates.
/// MANDATE: Bounded collection.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TransformBatch {
    updates: Vec<TransformUpdate>,
}

impl TransformBatch {
    /// Create new batch.
    /// MANDATE: ≤60 SLOC.
    pub fn new() -> Self {
        Self {
            updates: Vec::new(),
        }
    }

    /// Add update to batch.
    /// MANDATE: ≤60 SLOC, bounded capacity.
    pub fn add(&mut self, update: TransformUpdate) -> Result<(), String> {
        // MANDATE: Bounded allocation check
        if self.updates.len() >= MAX_BATCH_SIZE {
            return Err("Batch size exceeded".to_string());
        }

        self.updates.push(update);
        Ok(())
    }

    /// Get all updates.
    /// MANDATE: ≤60 SLOC.
    pub fn updates(&self) -> &[TransformUpdate] {
        &self.updates
    }

    /// Clear batch.
    /// MANDATE: ≤60 SLOC.
    pub fn clear(&mut self) {
        self.updates.clear();
    }

    /// Count updates.
    /// MANDATE: ≤60 SLOC.
    pub fn len(&self) -> usize {
        self.updates.len()
    }

    /// Check if empty.
    /// MANDATE: ≤60 SLOC.
    pub fn is_empty(&self) -> bool {
        self.updates.is_empty()
    }
}

impl Default for TransformBatch {
    fn default() -> Self {
        Self::new()
    }
}

/// Opacity update operation.
/// MANDATE: Bounded data structure.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OpacityUpdate {
    pub id: LayerId,
    pub opacity: f32,
}

impl OpacityUpdate {
    /// Create new opacity update.
    /// MANDATE: ≤60 SLOC, validated opacity.
    pub fn new(id: LayerId, opacity: f32) -> Result<Self, String> {
        // MANDATE: Input validation
        if !(0.0..=1.0).contains(&opacity) {
            return Err("Opacity out of range".to_string());
        }

        Ok(Self { id, opacity })
    }
}

/// Batch of opacity updates.
/// MANDATE: Bounded collection.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OpacityBatch {
    updates: Vec<OpacityUpdate>,
}

impl OpacityBatch {
    /// Create new batch.
    /// MANDATE: ≤60 SLOC.
    pub fn new() -> Self {
        Self {
            updates: Vec::new(),
        }
    }

    /// Add update to batch.
    /// MANDATE: ≤60 SLOC, bounded capacity.
    pub fn add(&mut self, update: OpacityUpdate) -> Result<(), String> {
        // MANDATE: Bounded allocation check
        if self.updates.len() >= MAX_BATCH_SIZE {
            return Err("Batch size exceeded".to_string());
        }

        self.updates.push(update);
        Ok(())
    }

    /// Get all updates.
    /// MANDATE: ≤60 SLOC.
    pub fn updates(&self) -> &[OpacityUpdate] {
        &self.updates
    }

    /// Clear batch.
    /// MANDATE: ≤60 SLOC.
    pub fn clear(&mut self) {
        self.updates.clear();
    }

    /// Count updates.
    /// MANDATE: ≤60 SLOC.
    pub fn len(&self) -> usize {
        self.updates.len()
    }

    /// Check if empty.
    /// MANDATE: ≤60 SLOC.
    pub fn is_empty(&self) -> bool {
        self.updates.is_empty()
    }
}

impl Default for OpacityBatch {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_transform_batch() {
        let mut batch = TransformBatch::new();
        assert_eq!(batch.len(), 0);

        let update = TransformUpdate::new(1, Mat3::IDENTITY);
        batch.add(update).unwrap();
        assert_eq!(batch.len(), 1);
    }

    #[test]
    fn test_opacity_batch() {
        let mut batch = OpacityBatch::new();
        let update = OpacityUpdate::new(1, 0.5).unwrap();
        batch.add(update).unwrap();
        assert_eq!(batch.len(), 1);
    }

    #[test]
    fn test_opacity_validation() {
        let result = OpacityUpdate::new(1, 1.5);
        assert!(result.is_err());

        let result = OpacityUpdate::new(1, -0.1);
        assert!(result.is_err());
    }

    #[test]
    fn test_batch_clear() {
        let mut batch = TransformBatch::new();
        batch.add(TransformUpdate::new(1, Mat3::IDENTITY)).unwrap();
        assert_eq!(batch.len(), 1);

        batch.clear();
        assert_eq!(batch.len(), 0);
    }

    #[test]
    fn test_transform_batch_updates() {
        let mut batch = TransformBatch::new();
        batch.add(TransformUpdate::new(1, Mat3::IDENTITY)).unwrap();
        batch.add(TransformUpdate::new(2, Mat3::IDENTITY)).unwrap();

        let updates = batch.updates();
        assert_eq!(updates.len(), 2);
        assert_eq!(updates[0].id, 1);
        assert_eq!(updates[1].id, 2);
    }

    #[test]
    fn test_transform_batch_is_empty() {
        let batch = TransformBatch::new();
        assert!(batch.is_empty());

        let mut batch = TransformBatch::new();
        batch.add(TransformUpdate::new(1, Mat3::IDENTITY)).unwrap();
        assert!(!batch.is_empty());
    }

    #[test]
    fn test_opacity_batch_updates() {
        let mut batch = OpacityBatch::new();
        batch.add(OpacityUpdate::new(1, 0.5).unwrap()).unwrap();
        batch.add(OpacityUpdate::new(2, 0.8).unwrap()).unwrap();

        let updates = batch.updates();
        assert_eq!(updates.len(), 2);
        assert_eq!(updates[0].id, 1);
    }

    #[test]
    fn test_opacity_batch_clear() {
        let mut batch = OpacityBatch::new();
        batch.add(OpacityUpdate::new(1, 0.5).unwrap()).unwrap();
        assert_eq!(batch.len(), 1);

        batch.clear();
        assert_eq!(batch.len(), 0);
        assert!(batch.is_empty());
    }

    #[test]
    fn test_opacity_batch_is_empty() {
        let batch = OpacityBatch::new();
        assert!(batch.is_empty());

        let mut batch = OpacityBatch::new();
        batch.add(OpacityUpdate::new(1, 0.5).unwrap()).unwrap();
        assert!(!batch.is_empty());
    }
}
