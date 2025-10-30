# Simple Designer - Development Roadmap

## Vision

A professional-grade design tool that runs as a native desktop application, rivaling commercial software in performance and features while remaining open-source and accessible.

## Development Principles

**Mandate Compliance:**
- [ ] **Functions:** Must be ≤60 SLOC, have names ≤3 words, and adhere to the single responsibility principle.
- [ ] **Control Flow:** No recursion. Loops must have statically provable bounds. Use static dispatch over dynamic dispatch wherever possible.
- [ ] **Safety:** Maintain an average of ≥2 assertions per function. All `Result` and `Option` types must be explicitly handled; no `.unwrap()` or `.expect()` outside of tests.
- [ ] **Determinism:** All outputs must be purely determined by their inputs. Avoid global state and hidden dependencies. Implement structured logging for transparent state tracking.

**Build in Phases:**
- [ ] **Deliverable Chunks:** Each phase, and ideally each sub-point, delivers a testable and usable piece of functionality.
- [ ] **Test-Driven:** Write tests before or alongside implementation. A feature is not "done" until it is tested.
- [ ] **Continuous Refactoring:** After each phase, dedicate time to reducing code complexity, improving clarity, and paying down technical debt.
- [ ] **Documentation:** Maintain comprehensive documentation for both the codebase and the end-user.

**Research-Driven:**
- [ ] **Identify Unknowns:** When a clear implementation path is not known, formally define it as a research question.
- [ ] **Parallel Investigation:** Use tools (AI assistants, documentation, articles) to gather diverse perspectives on the problem.
- [ ] **Synthesize & Decide:** Consolidate the research into a technical brief, make a clear decision, and update the roadmap before writing code.

**User-Focused:**
- [ ] **Dogfooding:** Use Simple Designer to create its own UI assets, marketing materials, and documentation graphics.
- [ ] **Feedback Loops:** Establish clear channels for user feedback (e.g., Discord, GitHub Issues) from the earliest possible stage.
- [ ] **Prioritization:** Prioritize features and bug fixes based on a balance of user impact and development effort.
- [ ] **Performance First:** When faced with a choice between a new feature and maintaining performance, prioritize performance. A fast tool is a usable tool.

**Native-First:**
- [ ] **Leverage the OS:** Fully integrate with native OS features: file system, clipboard, window management, notifications, and menus.
- [ ] **Direct GPU Access:** Maximize performance by using `wgpu` for direct, low-level control over the GPU. Avoid abstractions that add overhead.
