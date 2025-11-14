// WGSL Shaders for instanced quad rendering
// MANDATE: Simple, deterministic GPU pipeline

struct VertexInput {
    @location(0) position: vec2<f32>,
}

struct InstanceInput {
    @location(1) transform_0: vec4<f32>,
    @location(2) transform_1: vec4<f32>,
    @location(3) transform_2: vec4<f32>,
    @location(4) color: vec4<f32>,
}

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) color: vec4<f32>,
}

@vertex
fn vs_main(
    vertex: VertexInput,
    instance: InstanceInput,
) -> VertexOutput {
    var out: VertexOutput;

    // Reconstruct 3x3 transform matrix from instance data
    let transform = mat3x3<f32>(
        instance.transform_0.xyz,
        instance.transform_1.xyz,
        instance.transform_2.xyz,
    );

    // Apply transform to vertex position
    let transformed = transform * vec3<f32>(vertex.position, 1.0);

    // Convert to clip space [-1, 1]
    out.clip_position = vec4<f32>(transformed.xy, 0.0, 1.0);
    out.color = instance.color;

    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    return in.color;
}
