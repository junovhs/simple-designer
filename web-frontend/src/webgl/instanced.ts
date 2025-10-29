// MANDATE: Instanced rendering, bounded operations, performance tracking
import type { ShaderProgram } from './shaders';
import type { QuadGeometry } from './geometry';

/**
 * Maximum instances per batch.
 * MANDATE: Bounded allocation, visible at callsite.
 */
export const MAX_INSTANCES = 10000;

/**
 * Instance data (3x3 matrix per instance).
 */
export interface InstanceData {
  buffer: WebGLBuffer;
  count: number;
  capacity: number;
}

/**
 * Create instance buffer.
 * MANDATE: Pre-allocated, bounded size.
 */
export function createInstanceBuffer(gl: WebGLRenderingContext): InstanceData | null {
  // MANDATE: Input validation
  if (!gl || gl.isContextLost()) {
    console.error('Invalid GL context');
    return null;
  }

  const buffer = gl.createBuffer();
  if (!buffer) {
    console.error('Instance buffer creation failed');
    return null;
  }

  // Pre-allocate for MAX_INSTANCES
  // Each instance: 9 floats (3x3 matrix)
  const FLOATS_PER_MATRIX = 9;
  const capacity = MAX_INSTANCES * FLOATS_PER_MATRIX;
  const byteSize = capacity * Float32Array.BYTES_PER_ELEMENT;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, byteSize, gl.DYNAMIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  console.log('Instance buffer created', {
    maxInstances: MAX_INSTANCES,
    bytes: byteSize,
  });

  return {
    buffer,
    count: 0,
    capacity: MAX_INSTANCES,
  };
}

/**
 * Update instance transforms.
 * MANDATE: Bounded by MAX_INSTANCES.
 */
export function updateInstances(
  gl: WebGLRenderingContext,
  instanceData: InstanceData,
  matrices: Float32Array
): boolean {
  // MANDATE: Input validation
  if (!gl || !instanceData || !matrices) {
    console.error('Invalid parameters');
    return false;
  }

  const FLOATS_PER_MATRIX = 9;
  const instanceCount = matrices.length / FLOATS_PER_MATRIX;

  // MANDATE: Bounds check
  if (instanceCount > MAX_INSTANCES) {
    console.error('Too many instances', {
      requested: instanceCount,
      max: MAX_INSTANCES,
    });
    return false;
  }

  if (matrices.length % FLOATS_PER_MATRIX !== 0) {
    console.error('Invalid matrix data length', {
      length: matrices.length,
      expected: instanceCount * FLOATS_PER_MATRIX,
    });
    return false;
  }

  // Upload data
  gl.bindBuffer(gl.ARRAY_BUFFER, instanceData.buffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, matrices);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  instanceData.count = instanceCount;

  return true;
}

/**
 * Draw instanced rectangles.
 * MANDATE: Performance tracking, bounded operations.
 */
export function drawInstanced(
  gl: WebGLRenderingContext,
  shader: ShaderProgram,
  quad: QuadGeometry,
  instanceData: InstanceData,
  color: [number, number, number, number]
): void {
  // MANDATE: Input validation
  if (!gl || gl.isContextLost()) {
    console.error('Invalid GL context');
    return;
  }
  if (!shader || !quad || !instanceData) {
    console.error('Invalid draw parameters');
    return;
  }
  if (instanceData.count === 0) {
    return; // Nothing to draw
  }

  // MANDATE: Performance tracking
  const startTime = performance.now();

  // Use shader program
  gl.useProgram(shader.program);

  // Set color uniform
  if (shader.uniforms.color) {
    gl.uniform4f(shader.uniforms.color, color[0], color[1], color[2], color[3]);
  }

  // Bind quad geometry
  gl.bindBuffer(gl.ARRAY_BUFFER, quad.buffer);
  gl.enableVertexAttribArray(shader.attribs.position);
  gl.vertexAttribPointer(
    shader.attribs.position,
    2,                // 2 components per vertex
    gl.FLOAT,
    false,
    0,
    0
  );

  // Bind instance data
  gl.bindBuffer(gl.ARRAY_BUFFER, instanceData.buffer);
  
  // Matrix is 3x3, but WebGL attributes are vec4 max
  // So we use 3 vec3 attributes (row0, row1, row2)
  const FLOATS_PER_ROW = 3;
  const bytesPerMatrix = 9 * Float32Array.BYTES_PER_ELEMENT;
  
  for (let i = 0; i < 3; i++) {
    const loc = shader.attribs.matrix + i;
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(
      loc,
      FLOATS_PER_ROW,
      gl.FLOAT,
      false,
      bytesPerMatrix,
      i * FLOATS_PER_ROW * Float32Array.BYTES_PER_ELEMENT
    );
    // CRITICAL: Set divisor for instancing
    const ext = gl.getExtension('ANGLE_instanced_arrays');
    if (ext) {
      ext.vertexAttribDivisorANGLE(loc, 1);
    }
  }

  // Draw instanced
  const ext = gl.getExtension('ANGLE_instanced_arrays');
  if (!ext) {
    console.error('Instanced arrays not supported');
    return;
  }

  ext.drawArraysInstancedANGLE(
    gl.TRIANGLES,
    0,
    quad.vertexCount,
    instanceData.count
  );

  // MANDATE: Performance logging
  const elapsed = performance.now() - startTime;
  if (elapsed > 5.0) {
    console.warn('Draw call slow', {
      instances: instanceData.count,
      ms: elapsed.toFixed(2),
    });
  }

  // Cleanup
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

/**
 * Delete instance buffer.
 */
export function deleteInstanceBuffer(
  gl: WebGLRenderingContext,
  instanceData: InstanceData
): void {
  if (!gl || !instanceData || !instanceData.buffer) {
    return;
  }
  
  gl.deleteBuffer(instanceData.buffer);
  console.log('Instance buffer deleted');
}