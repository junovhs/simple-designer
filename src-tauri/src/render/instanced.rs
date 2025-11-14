// MANDATE: Instanced rendering logic
#![deny(warnings)]

use super::geometry::{create_index_buffer, create_vertex_buffer, QUAD_INDICES};
use super::pipeline::{create_pipeline, create_shader, InstanceData};
use wgpu::util::DeviceExt;

/// Maximum instances per batch.
/// MANDATE: Bounded allocation.
const MAX_INSTANCES: usize = 10_000;

/// GPU renderer state.
/// MANDATE: All fields initialized at setup.
pub struct Renderer {
    device: wgpu::Device,
    queue: wgpu::Queue,
    surface: wgpu::Surface<'static>,
    config: wgpu::SurfaceConfiguration,
    pipeline: wgpu::RenderPipeline,
    vertex_buffer: wgpu::Buffer,
    index_buffer: wgpu::Buffer,
}

impl Renderer {
    /// Initialize renderer.
    /// MANDATE: ≤60 SLOC, all resources created.
    pub async fn new<W>(window: W) -> Result<Self, String>
    where
        W: raw_window_handle::HasWindowHandle + raw_window_handle::HasDisplayHandle + Send + Sync,
    {
        let instance = wgpu::Instance::new(wgpu::InstanceDescriptor {
            backends: wgpu::Backends::PRIMARY,
            ..Default::default()
        });

        let surface = instance
            .create_surface(window)
            .map_err(|e| e.to_string())?;

        let adapter = instance
            .request_adapter(&wgpu::RequestAdapterOptions {
                power_preference: wgpu::PowerPreference::HighPerformance,
                compatible_surface: Some(&surface),
                force_fallback_adapter: false,
            })
            .await
            .ok_or("Failed to find adapter")?;

        let (device, queue) = adapter
            .request_device(
                &wgpu::DeviceDescriptor {
                    label: Some("Main Device"),
                    required_features: wgpu::Features::empty(),
                    required_limits: wgpu::Limits::default(),
                    memory_hints: Default::default(),
                },
                None,
            )
            .await
            .map_err(|e| e.to_string())?;

        // MANDATE: Default window dimensions
        let width = 1200;
        let height = 800;

        let config = surface
            .get_default_config(&adapter, width, height)
            .ok_or("Surface incompatible")?;

        surface.configure(&device, &config);

        let shader = create_shader(&device);
        let pipeline = create_pipeline(&device, &shader, config.format);
        let vertex_buffer = create_vertex_buffer(&device);
        let index_buffer = create_index_buffer(&device);

        Ok(Self {
            device,
            queue,
            surface,
            config,
            pipeline,
            vertex_buffer,
            index_buffer,
        })
    }

    /// Render instances.
    /// MANDATE: ≤60 SLOC, bounded loop.
    pub fn render(&self, instances: &[InstanceData]) -> Result<(), String> {
        // MANDATE: Bounded input validation
        assert!(instances.len() <= MAX_INSTANCES);

        if instances.is_empty() {
            return Ok(());
        }

        let instance_buffer = self
            .device
            .create_buffer_init(&wgpu::util::BufferInitDescriptor {
                label: Some("Instance Buffer"),
                contents: bytemuck::cast_slice(instances),
                usage: wgpu::BufferUsages::VERTEX,
            });

        let output = self
            .surface
            .get_current_texture()
            .map_err(|e| e.to_string())?;

        let view = output
            .texture
            .create_view(&wgpu::TextureViewDescriptor::default());

        let mut encoder = self
            .device
            .create_command_encoder(&wgpu::CommandEncoderDescriptor {
                label: Some("Render Encoder"),
            });

        {
            let mut render_pass = encoder.begin_render_pass(&wgpu::RenderPassDescriptor {
                label: Some("Render Pass"),
                color_attachments: &[Some(wgpu::RenderPassColorAttachment {
                    view: &view,
                    resolve_target: None,
                    ops: wgpu::Operations {
                        load: wgpu::LoadOp::Clear(wgpu::Color {
                            r: 0.1,
                            g: 0.1,
                            b: 0.1,
                            a: 1.0,
                        }),
                        store: wgpu::StoreOp::Store,
                    },
                })],
                depth_stencil_attachment: None,
                timestamp_writes: None,
                occlusion_query_set: None,
            });

            render_pass.set_pipeline(&self.pipeline);
            render_pass.set_vertex_buffer(0, self.vertex_buffer.slice(..));
            render_pass.set_vertex_buffer(1, instance_buffer.slice(..));
            render_pass.set_index_buffer(self.index_buffer.slice(..), wgpu::IndexFormat::Uint16);
            render_pass.draw_indexed(0..QUAD_INDICES.len() as u32, 0, 0..instances.len() as u32);
        }

        self.queue.submit(std::iter::once(encoder.finish()));
        output.present();

        Ok(())
    }
}
