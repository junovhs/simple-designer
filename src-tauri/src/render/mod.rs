// MANDATE: Render module exports
#![deny(warnings)]

pub mod geometry;
pub mod instanced;
pub mod pipeline;

pub use geometry::{create_index_buffer, create_vertex_buffer, Vertex};
pub use instanced::Renderer;
pub use pipeline::{create_pipeline, create_shader, InstanceData};
