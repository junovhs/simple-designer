# Pass Conditions for Phases 1.2, 1.3, and 1.4

## Phase 1.2: Instanced Rendering Pipeline

### Functional Requirements
- [ ] **Shader Compilation**
  - WGSL shaders compile without errors
  - Vertex shader accepts position and instance data
  - Fragment shader outputs solid colors
  - Test: Load shaders and verify no compilation errors

- [ ] **Quad Geometry**
  - Unit quad vertices created (4 vertices: [0,0], [1,0], [1,1], [0,1])
  - Quad indices created (6 indices forming 2 triangles)
  - Vertex buffer created successfully
  - Index buffer created successfully
  - Test: Verify QUAD_VERTICES has exactly 4 vertices
  - Test: Verify QUAD_INDICES has exactly 6 indices

- [ ] **Pipeline Setup**
  - Render pipeline created with correct vertex/fragment stages
  - Instance buffer layout matches shader expectations
  - Blend mode set to alpha blending
  - Test: Create pipeline and verify no errors

- [ ] **Instanced Rendering**
  - Renderer initializes with wgpu device, queue, and surface
  - Can render empty instance list without crash
  - Can render 100 rectangles in a single frame
  - Can render 10,000 rectangles in <5ms per frame
  - Rejects instance batches exceeding MAX_INSTANCES (10,000)
  - Test: Create renderer and render varying instance counts
  - Test: Measure frame time for 10k instances

### Code Quality Requirements
- [ ] All functions ≤60 SLOC
- [ ] Function names ≤3 words (e.g., `create_shader`, `render`)
- [ ] ≥2 assertions per function (average)
- [ ] Zero compiler warnings with `#![deny(warnings)]`
- [ ] No `unwrap()` calls outside tests
- [ ] All Results properly checked with `?` or `map_err`

### Performance Requirements
- [ ] 10,000 rectangles render in <5ms (200+ FPS)
- [ ] No allocations in hot render loop
- [ ] Instance buffer reused across frames
- [ ] GPU draw call uses instancing (single `draw_indexed`)

---

## Phase 1.3: Viewport + Spatial Index

### Functional Requirements
- [ ] **Viewport Transforms**
  - Viewport initializes with screen dimensions
  - Pan operation updates offset correctly
  - Zoom operation respects bounds (0.1x to 10x)
  - Zoom-at-point keeps point stable under cursor
  - Screen-to-world coordinate conversion is correct
  - World-to-screen coordinate conversion is correct
  - Visible bounds calculation returns min/max world coords
  - Test: Create viewport, pan by (100, 50), verify offset
  - Test: Zoom in/out and verify bounds are enforced
  - Test: Convert screen point (400, 300) to world and back

- [ ] **Spatial Index (R-tree)**
  - Empty index created successfully
  - Insert single entry and verify count = 1
  - Query rectangle returns shapes within bounds
  - Query point returns shapes at that location
  - Remove entry by ID works correctly
  - Bulk load 1,000 entries efficiently
  - Query on 10,000 entries completes in <1ms (O(log n))
  - Test: Insert 3 shapes, query rect, verify correct IDs returned
  - Test: Remove shape by ID, verify len decreases

- [ ] **Viewport Culling**
  - Visible bounds method returns correct world rectangle
  - Only shapes within viewport are queried from R-tree
  - Shapes outside viewport are not sent to GPU
  - Test: Create viewport, get visible bounds, query R-tree
  - Test: Verify culling reduces instance count correctly

### Code Quality Requirements
- [ ] All functions ≤60 SLOC
- [ ] Function names ≤3 words
- [ ] ≥2 assertions per function (average)
- [ ] Viewport pan/zoom inputs validated
- [ ] R-tree bounds validated (min ≤ max)
- [ ] Deterministic coordinate transforms (no floating-point drift)

### Performance Requirements
- [ ] R-tree query on 10,000 shapes: <1ms
- [ ] Viewport transform calculations: constant time O(1)
- [ ] Culling reduces render time proportionally to visible shapes

---

## Phase 1.4: Layer System + Batching

### Functional Requirements
- [ ] **Layer Metadata**
  - Create layer with ID and name
  - Set visibility (true/false)
  - Set opacity (0.0 to 1.0, clamped)
  - Set z-order (-10,000 to 10,000)
  - Set transform (Mat3)
  - Layer marked non-renderable if invisible or opacity = 0
  - Test: Create layer, set opacity to 0, verify is_renderable() = false
  - Test: Set opacity to 1.5, verify it's clamped to 1.0

- [ ] **Layer Tree**
  - Add layer returns unique LayerId
  - Get layer by ID returns correct layer or None
  - Remove layer by ID works correctly
  - Sorted layers returns layers by z-order (ascending)
  - Ties in z-order broken by ID (deterministic)
  - Renderable layers excludes invisible/transparent layers
  - Rejects adding more than MAX_LAYERS (1,000)
  - Clear removes all layers and resets ID counter
  - Test: Add 3 layers with z-orders [10, 5, 8], verify sorted order
  - Test: Add 1,000 layers, next add should fail

- [ ] **Batch Operations**
  - Transform batch can add updates
  - Transform batch rejects >MAX_BATCH_SIZE (10,000)
  - Opacity batch validates opacity range [0, 1]
  - Opacity batch rejects invalid values (<0 or >1)
  - Batches can be cleared
  - Test: Add 100 transform updates to batch, verify len = 100
  - Test: Add opacity update with value 1.5, verify error

- [ ] **Z-order Sorting**
  - Shapes sorted by z-order (ascending)
  - Ties broken by shape ID (deterministic)
  - Test: Create 5 shapes with random z-orders, sort, verify order

- [ ] **Material Batching**
  - Shapes grouped by material type (SolidColor, Textured)
  - Groups maintain original order within material
  - Test: Create mix of solid/textured shapes, group, verify counts

### Code Quality Requirements
- [ ] All functions ≤60 SLOC
- [ ] Function names ≤3 words
- [ ] ≥2 assertions per function (average)
- [ ] Layer name length ≤256 characters
- [ ] Layer counts bounded (≤1,000)
- [ ] Batch sizes bounded (≤10,000)

### Performance Requirements
- [ ] Sorting 1,000 shapes: <1ms
- [ ] Batch updates applied in O(n) time
- [ ] Material grouping: single pass O(n)

---

## Integration Tests

### End-to-End Scenarios
- [ ] **Scene Setup**
  1. Create layer tree
  2. Add 3 layers
  3. Add 100 shapes to spatial index
  4. Set viewport to show 50% of canvas
  5. Query visible shapes
  6. Render visible shapes
  7. Verify: ~50 shapes rendered, <5ms frame time

- [ ] **Transform Batch**
  1. Create 1,000 shapes
  2. Create transform batch with 1,000 updates
  3. Apply batch to layer tree
  4. Verify: All transforms updated correctly

- [ ] **Material Batching**
  1. Create 500 solid shapes, 500 textured shapes
  2. Sort by z-order
  3. Group by material
  4. Verify: 2 groups, correct counts

- [ ] **Viewport Culling**
  1. Create 10,000 shapes across large canvas
  2. Set viewport to show small region
  3. Query spatial index
  4. Verify: Only ~100 shapes returned (10x speedup)

---

## Non-Functional Requirements

### Code Mandate Compliance
- [ ] Zero warnings with `cargo clippy -- -D warnings`
- [ ] No recursion (acyclic call graph)
- [ ] All loops bounded with static or runtime limits
- [ ] No post-init allocations in hot paths
- [ ] Functions averaged ≥2 assertions each
- [ ] No global mutable state
- [ ] Every function return checked
- [ ] Every parameter validated at boundaries
- [ ] Static dispatch only (no dynamic dispatch)

### Documentation
- [ ] Every public function has doc comment
- [ ] Module-level documentation explains purpose
- [ ] MANDATE comments explain design constraints
- [ ] Examples provided for complex APIs

### Testing
- [ ] Unit tests for each module
- [ ] Integration tests for cross-module features
- [ ] Performance benchmarks for critical paths
- [ ] All tests pass with `cargo test`

---

## How to Test

### Manual Testing
1. **Build the project:**
   ```bash
   cd src-tauri
   cargo build
   ```

2. **Run unit tests:**
   ```bash
   cargo test
   ```

3. **Run clippy:**
   ```bash
   cargo clippy -- -D warnings
   ```

### Performance Testing
1. **Render 10k rectangles:**
   - Create 10,000 InstanceData entries
   - Call `renderer.render(&instances)`
   - Measure frame time with `std::time::Instant`
   - Verify: <5ms per frame

2. **Spatial query on 10k shapes:**
   - Build R-tree with 10,000 entries
   - Query rectangle containing ~100 shapes
   - Measure query time
   - Verify: <1ms

3. **Viewport culling:**
   - Create 10,000 shapes
   - Set viewport to show 10% of canvas
   - Query visible shapes
   - Verify: ~1,000 shapes returned

### Integration Testing
1. **Full pipeline test:**
   ```rust
   // Create components
   let mut layer_tree = LayerTree::new();
   let layer_id = layer_tree.add_layer("Test".to_string()).unwrap();
   let mut spatial_index = SpatialIndex::new();
   let viewport = Viewport::new(1200.0, 800.0);

   // Add shapes
   for i in 0..1000 {
       let shape = Shape::new(i, layer_id, ...);
       spatial_index.insert(SpatialEntry::new(...));
   }

   // Query visible
   let (min, max) = viewport.visible_bounds();
   let visible_ids = spatial_index.query_rect(min, max);

   // Verify results
   assert!(visible_ids.len() < 1000);
   ```

---

## Success Criteria Summary

All phases (1.2, 1.3, 1.4) pass when:
- ✅ All functional requirements met
- ✅ All performance targets achieved
- ✅ Zero compiler/clippy warnings
- ✅ All unit tests pass
- ✅ Code mandate fully complied with
- ✅ Integration tests validate cross-module behavior
- ✅ Documentation complete and accurate
