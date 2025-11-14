// MANDATE: Shader compilation and pipeline setup
#![deny(warnings)]
#![allow(dead_code)]

use super::geometry::Vertex;

/// Instance data for transform and color.
#[repr(C)]
#[derive(Copy, Clone, Debug, bytemuck::Pod, bytemuck::Zeroable)]
pub struct InstanceData {
    pub transform_0: [f32; 4],
    pub transform_1: [f32; 4],
    pub transform_2: [f32; 4],
    pub color: [f32; 4],
}

impl InstanceData {
    /// Instance buffer layout descriptor.
    pub fn desc() -> wgpu::VertexBufferLayout<'static> {
        wgpu::VertexBufferLayout {
            array_stride: std::mem::size_of::<InstanceData>() as wgpu::BufferAddress,
            step_mode: wgpu::VertexStepMode::Instance,
            attributes: &[
                wgpu::VertexAttribute {
                    offset: 0,
                    shader_location: 1,
                    format: wgpu::VertexFormat::Float32x4,
                },
                wgpu::VertexAttribute {
                    offset: std::mem::size_of::<[f32; 4]>() as wgpu::BufferAddress,
                    shader_location: 2,
                    format: wgpu::VertexFormat::Float32x4,
                },
                wgpu::VertexAttribute {
                    offset: (std::mem::size_of::<[f32; 4]>() * 2) as wgpu::BufferAddress,
                    shader_location: 3,
                    format: wgpu::VertexFormat::Float32x4,
                },
                wgpu::VertexAttribute {
                    offset: (std::mem::size_of::<[f32; 4]>() * 3) as wgpu::BufferAddress,
                    shader_location: 4,
                    format: wgpu::VertexFormat::Float32x4,
                },
            ],
        }
    }
}

/// Compile shader module.
/// MANDATE: ≤60 SLOC, no dynamic codegen.
pub fn create_shader(device: &wgpu::Device) -> wgpu::ShaderModule {
    let shader_source = include_str!("shaders.wgsl");

    // MANDATE: Assertions on shader source
    assert!(!shader_source.is_empty());
    assert!(shader_source.contains("vs_main"));

    device.create_shader_module(wgpu::ShaderModuleDescriptor {
        label: Some("Quad Shader"),
        source: wgpu::ShaderSource::Wgsl(shader_source.into()),
    })
}

/// Create render pipeline.
/// MANDATE: ≤60 SLOC, static configuration.
pub fn create_pipeline(
    device: &wgpu::Device,
    shader: &wgpu::ShaderModule,
    format: wgpu::TextureFormat,
) -> wgpu::RenderPipeline {
    // MANDATE: Assertions on inputs
    assert_eq!(format, wgpu::TextureFormat::Bgra8UnormSrgb);

    let layout = device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
        label: Some("Render Pipeline Layout"),
        bind_group_layouts: &[],
        push_constant_ranges: &[],
    });

    device.create_render_pipeline(&wgpu::RenderPipelineDescriptor {
        label: Some("Render Pipeline"),
        layout: Some(&layout),
        vertex: wgpu::VertexState {
            module: shader,
            entry_point: Some("vs_main"),
            buffers: &[Vertex::desc(), InstanceData::desc()],
            compilation_options: Default::default(),
        },
        fragment: Some(wgpu::FragmentState {
            module: shader,
            entry_point: Some("fs_main"),
            targets: &[Some(wgpu::ColorTargetState {
                format,
                blend: Some(wgpu::BlendState::ALPHA_BLENDING),
                write_mask: wgpu::ColorWrites::ALL,
            })],
            compilation_options: Default::default(),
        }),
        primitive: wgpu::PrimitiveState {
            topology: wgpu::PrimitiveTopology::TriangleList,
            strip_index_format: None,
            front_face: wgpu::FrontFace::Ccw,
            cull_mode: None,
            polygon_mode: wgpu::PolygonMode::Fill,
            unclipped_depth: false,
            conservative: false,
        },
        depth_stencil: None,
        multisample: wgpu::MultisampleState {
            count: 1,
            mask: !0,
            alpha_to_coverage_enabled: false,
        },
        multiview: None,
        cache: None,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_instance_data_size() {
        assert_eq!(std::mem::size_of::<InstanceData>(), 64);
    }
}
