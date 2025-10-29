// MANDATE: Geometry creation, bounded operations, <60 SLOC per function

/**
 * Quad geometry buffer.
 */
export interface QuadGeometry {
  buffer: WebGLBuffer;
  vertexCount: number;
}

/**
 * Create unit quad geometry.
 * Quad is 1x1 centered at origin (-.5 to .5 in both axes).
 * MANDATE: Static size, no allocations in hot path.
 */
export function createQuadGeometry(gl: WebGLRenderingContext): QuadGeometry | null {
  // MANDATE: Input validation
  if (!gl || gl.isContextLost()) {
    console.error('Invalid GL context');
    return null;
  }

  // Unit quad vertices (2 triangles, 6 vertices)
  // Centered at origin, 1x1 size
  const vertices = new Float32Array([
    // Triangle 1
    -0.5, -0.5,  // Bottom-left
     0.5, -0.5,  // Bottom-right
     0.5,  0.5,  // Top-right
    
    // Triangle 2
    -0.5, -0.5,  // Bottom-left
     0.5,  0.5,  // Top-right
    -0.5,  0.5,  // Top-left
  ]);

  // MANDATE: Bounded size check
  const EXPECTED_VERTICES = 6;
  const COMPONENTS_PER_VERTEX = 2;
  const expectedLength = EXPECTED_VERTICES * COMPONENTS_PER_VERTEX;
  
  if (vertices.length !== expectedLength) {
    console.error('Vertex count mismatch', { 
      expected: expectedLength, 
      actual: vertices.length 
    });
    return null;
  }

  // Create buffer
  const buffer = gl.createBuffer();
  if (!buffer) {
    console.error('Buffer creation failed');
    return null;
  }

  // Upload data
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  console.log('Quad geometry created', { 
    vertices: EXPECTED_VERTICES,
    bytes: vertices.byteLength,
  });

  return {
    buffer,
    vertexCount: EXPECTED_VERTICES,
  };
}

/**
 * Delete quad geometry.
 */
export function deleteQuadGeometry(gl: WebGLRenderingContext, quad: QuadGeometry): void {
  if (!gl || !quad || !quad.buffer) {
    return;
  }
  
  gl.deleteBuffer(quad.buffer);
  console.log('Quad geometry deleted');
}