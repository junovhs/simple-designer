## File Format Strategy

### Phase 1-2: Simple JSON
- [ ] **Goal:** Simplicity and debuggability.
- [ ] Human-readable JSON structure for the entire document graph.
- [ ] Embed small images as base64 strings directly in the JSON.
- [ ] A top-level `version` field (e.g., `"version": "1.0.0"`) is mandatory for future migration.

### Phase 3-4: Hybrid Format
- [ ] **Goal:** Performance and scalability.
- [ ] **Structure:** A master JSON file for document structure, layers, properties, and metadata.
- [ ] **Data:** Performance-critical data (image pixel data, vertex buffers, complex text layouts) stored as separate binary files within a compressed archive (e.g., a `.zip` file with a custom `.simple` extension).
- [ ] **Serialization:** Explore FlatBuffers or MessagePack for the binary data blobs for fast, zero-copy reading.

### Post-Phase 4: Advanced Format
- [ ] **Goal:** Efficiency and interoperability.
- [ ] **Compression:** The entire project archive is compressed using a modern algorithm like Brotli or Zstandard.
- [ ] **Incremental Save:** Implement a system to only write changed data to disk, significantly speeding up saves for large documents (similar to Git's object model).
- [ ] **Interoperability:** Develop robust importers and exporters for industry-standard formats (AI, PSD, Sketch, Figma) to allow for seamless workflow integration.
- [ ] **Backwards Compatibility:** Build a migration system that can read older file format versions and transparently upgrade them to the current version upon opening.

