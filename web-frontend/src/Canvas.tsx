// MANDATE: Canvas component with instanced rendering test
import { useEffect, useRef, useState } from 'react';
import { initWebGL, clearCanvas } from './webgl';
import { createInstancedShader } from './webgl/shaders';
import { createQuadGeometry } from './webgl/geometry';
import {
  createInstanceBuffer,
  updateInstances,
  drawInstanced,
  MAX_INSTANCES,
} from './webgl/instanced';

/**
 * Three-layer canvas with instanced rendering test.
 */
export default function Canvas(): JSX.Element {
  const contentRef = useRef<HTMLCanvasElement>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [instanceCount, setInstanceCount] = useState(100);

  // Initialize WebGL and render test rectangles
  useEffect(() => {
    const canvas = contentRef.current;
    if (!canvas) {
      setError('Canvas ref null');
      return;
    }

    const gl = initWebGL(canvas);
    if (!gl) {
      setError('WebGL init failed');
      return;
    }

    // Create shader
    const shader = createInstancedShader(gl);
    if (!shader) {
      setError('Shader creation failed');
      return;
    }

    // Create geometry
    const quad = createQuadGeometry(gl);
    if (!quad) {
      setError('Quad creation failed');
      return;
    }

    // Create instance buffer
    const instanceData = createInstanceBuffer(gl);
    if (!instanceData) {
      setError('Instance buffer creation failed');
      return;
    }

    // Generate test rectangles
    // MANDATE: Bounded count
    const count = Math.min(instanceCount, MAX_INSTANCES);
    const matrices = generateTestMatrices(count, canvas.width, canvas.height);
    
    if (!updateInstances(gl, instanceData, matrices)) {
      setError('Failed to update instances');
      return;
    }

    // Clear and draw
    clearCanvas(gl, 0.95, 0.95, 0.95);
    drawInstanced(gl, shader, quad, instanceData, [0.2, 0.4, 0.8, 1.0]);

    console.log('Rendered instances', { count });

    // Cleanup on unmount
    return () => {
      gl.deleteProgram(shader.program);
      // Note: quad and instance buffers deleted automatically
    };
  }, [instanceCount]);

  // MANDATE: Error handling visible
  if (error) {
    return (
      <div style={styles.error}>
        <h2>Canvas Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Content layer (WebGL) */}
      <canvas
        ref={contentRef}
        width={800}
        height={600}
        style={styles.canvas}
      />
      
      <div style={styles.controls}>
        <label>
          Instances: {instanceCount}
          <input
            type="range"
            min="10"
            max="10000"
            step="10"
            value={instanceCount}
            onChange={(e) => setInstanceCount(parseInt(e.target.value, 10))}
            style={styles.slider}
          />
        </label>
      </div>
      
      <div style={styles.status}>
        WebGL Ready | {instanceCount} rectangles
      </div>
    </div>
  );
}

/**
 * Generate test transformation matrices.
 * MANDATE: Bounded loop, deterministic output.
 */
function generateTestMatrices(
  count: number,
  canvasWidth: number,
  canvasHeight: number
): Float32Array {
  // MANDATE: Bounds check
  const safeCount = Math.max(1, Math.min(count, MAX_INSTANCES));
  
  const FLOATS_PER_MATRIX = 9;
  const matrices = new Float32Array(safeCount * FLOATS_PER_MATRIX);

  // Generate grid of rectangles
  const gridSize = Math.ceil(Math.sqrt(safeCount));
  const cellWidth = canvasWidth / gridSize;
  const cellHeight = canvasHeight / gridSize;
  const rectSize = Math.min(cellWidth, cellHeight) * 0.8;

  // MANDATE: Bounded loop with static limit
  for (let i = 0; i < safeCount; i++) {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    
    // Position in canvas space (-1 to 1)
    const x = (col / gridSize) * 2 - 1 + (1 / gridSize);
    const y = (row / gridSize) * 2 - 1 + (1 / gridSize);
    
    // Scale to rect size
    const scale = (rectSize / canvasWidth) * 2;
    
    // 3x3 transform matrix (scale + translate)
    const offset = i * FLOATS_PER_MATRIX;
    matrices[offset + 0] = scale;  // m00
    matrices[offset + 1] = 0;      // m01
    matrices[offset + 2] = x;      // m02 (translate x)
    matrices[offset + 3] = 0;      // m10
    matrices[offset + 4] = scale;  // m11
    matrices[offset + 5] = y;      // m12 (translate y)
    matrices[offset + 6] = 0;      // m20
    matrices[offset + 7] = 0;      // m21
    matrices[offset + 8] = 1;      // m22
  }

  return matrices;
}

// MANDATE: Deterministic styles
const styles = {
  container: {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  canvas: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
  },
  error: {
    padding: '20px',
    color: '#c00',
    fontFamily: 'monospace',
  },
  controls: {
    position: 'absolute' as const,
    top: '10px',
    left: '10px',
    padding: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '4px',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '14px',
  },
  slider: {
    display: 'block',
    width: '200px',
    marginTop: '5px',
  },
  status: {
    position: 'absolute' as const,
    bottom: '10px',
    right: '10px',
    padding: '8px 12px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#0f0',
    fontFamily: 'monospace',
    fontSize: '12px',
    borderRadius: '4px',
  },
};