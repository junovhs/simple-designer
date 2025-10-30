## Deferred Complexity (Post-Phase 4)

### Plugin System Architecture
**Why Deferred:** Building a secure, stable, and performant plugin system is as complex as building the core application itself. It requires a robust security model to prevent malicious code from accessing the user's system and a stable API that can evolve without breaking existing plugins. This is a massive architectural undertaking best saved for when the core application is feature-complete and stable.

**Requirements When Implemented:**
- [ ] **Sandboxed Execution Environment**
  - [ ] Use a WebAssembly runtime like Wasmtime integrated into the Rust backend.
  - [ ] Enforce a strict sandboxing model using the WebAssembly System Interface (WASI) to deny file system, network, and process access by default.
  - [ ] Implement per-plugin memory and CPU execution time limits to prevent performance degradation.
- [ ] **Stable API via WebAssembly Component Model**
  - [ ] Define the plugin API using WIT (WebAssembly Interface Type) definitions.
  - [ ] Expose core functionalities: document manipulation, UI creation, command registration, etc.
  - [ ] Version the API strictly (e.g., `v1.0`, `v1.1`) with a clear deprecation policy.
  - [ ] Auto-generate language-specific bindings (e.g., for TypeScript, Python) so developers can write plugins in multiple languages.
- [ ] **Secure Communication Protocol**
  - [ ] Implement a message-passing bridge between the main Rust application and the Wasm plugin sandbox.
  - [ ] All data exchange must be serialized and validated to prevent injection attacks.
  - [ ] Avoid shared memory unless absolutely necessary and protected by strict ownership rules.
- [ ] **Permissions System**
  - [ ] Implement a per-plugin permissions model (e.g., "requires file system access," "requires network access").
  - [ ] Prompt the user for approval during plugin installation, clearly stating what permissions the plugin is requesting.
  - [ ] Allow users to review and revoke permissions at any time.
- [ ] **Plugin Management & Distribution**
  - [ ] Build a UI for discovering, installing, updating, and uninstalling plugins.
  - [ ] Consider a dedicated plugin marketplace with a mandatory code review process for security and quality.
  - [ ] Implement a cryptographic signing system to verify plugin authenticity.

**Major subsystem. Build when the core application is solid and proven.**

### Advanced Text Features
**Why Deferred:** Professional typography is a deeply complex domain. Each of the features below introduces significant algorithmic and rendering challenges. Attempting them during Phase 3 would critically endanger the timeline and stability of core text functionality.

**Add iteratively based on user demand and specialized research:**
- [ ] **Complex Script & Bi-Directional Support**
  - [ ] Integrate a full-featured text shaping library like HarfBuzz, not just a subset.
  - [ ] Correctly handle right-to-left (RTL) scripts like Arabic and Hebrew, including mixed LTR/RTL content.
  - [ ] Support complex grapheme clustering and ligatures for scripts like Devanagari or Thai.
- [ ] **Text on a Path**
  - [ ] Implement algorithms to calculate glyph positions and rotations along a Bezier curve.
  - [ ] Handle text overflow and character spacing on curved paths.
  - [ ] Provide UI controls for path alignment (baseline, center) and orientation.
- [ ] **Variable Font Support**
  - [ ] Extend the font loader to parse and interpret variable font axes (e.g., weight, width, slant).
  - [ ] Create UI sliders and inputs for users to control these axes dynamically.
  - [ ] Ensure the GPU rendering pipeline can efficiently handle dynamically generated glyph shapes.
- [ ] **Advanced Paragraph Justification**
  - [ ] Implement the Knuth-Plass line-breaking algorithm for optimal typographic "color".
  - [ ] Add support for kashida justification in Arabic scripts.
  - [ ] Handle complex CJK punctuation and spacing rules.
- [ ] **Vertical Text Layout**
  - [ ] Implement top-to-bottom, right-to-left text flow.
  - [ ] Correctly rotate and position glyphs for vertical orientation based on font data.

### Collaboration (Multiplayer Editing)
**Why Deferred:** Real-time collaboration transforms a local application into a complex distributed system. It requires a complete re-architecture of the document's data model and the introduction of a robust, scalable backend server infrastructure. This is a product in itself.

**Requirements when implemented:**
- [ ] **Conflict-Free Data Model**
  - [ ] Re-implement the entire document state using Conflict-free Replicated Data Types (CRDTs), likely using a Rust crate like `automerge` or `y-crdt`.
  - [ ] Ensure every user action (moving a shape, changing a color) is translated into a conflict-free operation.
- [ ] **Real-Time Synchronization Backend**
  - [ ] Develop a dedicated WebSocket server to broadcast operations to all connected clients.
  - [ ] Implement authentication, authorization, and document access control.
  - [ ] Design for scalability to handle many concurrent users and documents.
- [ ] **Presence and UI Indicators**
  - [ ] Display cursors and selection boxes for all active users in real-time.
  - [ ] Implement an "avatar stack" showing who is currently viewing the document.
  - [ ] Ensure UI updates from remote users feel instantaneous and non-disruptive.
- [ ] **Conflict Resolution & Document History**
  - [ ] Although CRDTs prevent data corruption, user-level conflicts can still occur (e.g., two users editing the same text). Design UI to handle this gracefully.
  - [ ] Implement a version history viewer that leverages the CRDT log to show document evolution and allow rollbacks.

### Animation Timeline
**Why Deferred:** Animation is an entirely new dimension of functionality, adding the complexity of time to the existing spatial design model. It requires a dedicated UI paradigm and a high-performance rendering loop capable of real-time playback.

**Requirements when implemented:**
- [ ] **Keyframe System**
  - [ ] Allow any property (position, rotation, opacity, color, etc.) to be keyframeable.
  - [ ] Store keyframes (value, time, easing) in the document model.
- [ ] **State Interpolation Engine**
  - [ ] Implement an engine to calculate the state of all properties at any given point in time (including between frames).
  - [ ] Provide a library of easing curves (Linear, Ease-In, Ease-Out, Bezier, etc.).
  - [ ] Implement a graphical curve editor for custom easing functions.
- [ ] **Timeline UI**
  - [ ] Create a timeline panel with a playhead, frame markers, and layer tracks.
  - [ ] Allow users to scrub the timeline, set keyframes, and adjust timing directly.
  - [ ] Potentially add a "dopesheet" or "graph editor" view for advanced animation control.
- [ ] **Video/GIF Export Pipeline**
  - [ ] Integrate a library like `ffmpeg` (compiled to WASM or as a native dependency) for rendering frames into a video file.
  - [ ] Provide export options for format (MP4, WebM, GIF), resolution, frame rate, and quality.

