// MANDATE: Quad geometry for instanced rendering
#![deny(warnings)]

use wgpu::util::DeviceExt;

/// Vertex data for quad corner.
#[repr(C)]
#[derive(Copy, Clone, Debug, bytemuck::Pod, bytemuck::Zeroable)]
pub struct Vertex {
    pub position: [f32; 2],
}

impl Vertex {
    /// Vertex buffer layout descriptor.
    pub fn desc() -> wgpu::VertexBufferLayout<'static> {
        wgpu::VertexBufferLayout {
            array_stride: std::mem::size_of::<Vertex>() as wgpu::BufferAddress,
            step_mode: wgpu::VertexStepMode::Vertex,
            attributes: &[wgpu::VertexAttribute {
                offset: 0,
                shader_location: 0,
                format: wgpu::VertexFormat::Float32x2,
            }],
        }
    }
}

/// Unit quad vertices (0,0 to 1,1).
/// MANDATE: Bounded allocation, static data.
pub const QUAD_VERTICES: &[Vertex] = &[
    Vertex {
        position: [0.0, 0.0],
    },
    Vertex {
        position: [1.0, 0.0],
    },
    Vertex {
        position: [1.0, 1.0],
    },
    Vertex {
        position: [0.0, 1.0],
    },
];

/// Quad indices (two triangles).
/// MANDATE: Bounded allocation, static data.
pub const QUAD_INDICES: &[u16] = &[0, 1, 2, 0, 2, 3];

/// Create vertex buffer.
/// MANDATE: ≤60 SLOC, named create_vertex_buffer.
pub fn create_vertex_buffer(device: &wgpu::Device) -> wgpu::Buffer {
    // MANDATE: Assertion - vertices exist
    assert!(!QUAD_VERTICES.is_empty());
    assert_eq!(QUAD_VERTICES.len(), 4);

    device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
        label: Some("Quad Vertex Buffer"),
        contents: bytemuck::cast_slice(QUAD_VERTICES),
        usage: wgpu::BufferUsages::VERTEX,
    })
}

/// Create index buffer.
/// MANDATE: ≤60 SLOC, named create_index_buffer.
pub fn create_index_buffer(device: &wgpu::Device) -> wgpu::Buffer {
    // MANDATE: Assertion - indices exist
    assert!(!QUAD_INDICES.is_empty());
    assert_eq!(QUAD_INDICES.len(), 6);

    device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
        label: Some("Quad Index Buffer"),
        contents: bytemuck::cast_slice(QUAD_INDICES),
        usage: wgpu::BufferUsages::INDEX,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_quad_vertices() {
        assert_eq!(QUAD_VERTICES.len(), 4);
        assert_eq!(QUAD_VERTICES[0].position, [0.0, 0.0]);
        assert_eq!(QUAD_VERTICES[3].position, [0.0, 1.0]);
    }

    #[test]
    fn test_quad_indices() {
        assert_eq!(QUAD_INDICES.len(), 6);
        assert_eq!(QUAD_INDICES[0], 0);
        assert_eq!(QUAD_INDICES[5], 3);
    }
}
