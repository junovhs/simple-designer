// MANDATE: Canvas with viewport controls - DEBUG VERSION
import { useEffect, useRef, useState } from 'react';
import { initWebGL, clearCanvas } from './webgl';
import { createInstancedShader, type ShaderProgram } from './webgl/shaders';
import { createQuadGeometry, type QuadGeometry } from './webgl/geometry';
import {
  createInstanceBuffer,
  updateInstances,
  drawInstanced,
  MAX_INSTANCES,
  type InstanceData,
} from './webgl/instanced';
import {
  createViewport,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleWheel,
  type ViewportState,
} from './canvas/viewport';

/**
 * Canvas with viewport pan/zoom.
 */
export default function Canvas(): JSX.Element {
  const contentRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const shaderRef = useRef<ShaderProgram | null>(null);
  const quadRef = useRef<QuadGeometry | null>(null);
  const instanceRef = useRef<InstanceData | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [instanceCount, setInstanceCount] = useState(1000);
  const [viewport, setViewport] = useState<ViewportState>(createViewport());

  // Initialize WebGL ONCE
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

    const shader = createInstancedShader(gl);
    if (!shader) {
      setError('Shader creation failed');
      return;
    }

    const quad = createQuadGeometry(gl);
    if (!quad) {
      setError('Quad creation failed');
      return;
    }

    const instanceData = createInstanceBuffer(gl);
    if (!instanceData) {
      setError('Instance buffer creation failed');
      return;
    }

    // Store in refs
    glRef.current = gl;
    shaderRef.current = shader;
    quadRef.current = quad;
    instanceRef.current = instanceData;

    console.log('WebGL initialized once');

    return () => {
      gl.deleteProgram(shader.program);
      glRef.current = null;
      shaderRef.current = null;
      quadRef.current = null;
      instanceRef.current = null;
    };
  }, []); // ONLY RUN ONCE

  // Render when viewport or instanceCount changes
  useEffect(() => {
    const gl = glRef.current;
    const shader = shaderRef.current;
    const quad = quadRef.current;
    const instanceData = instanceRef.current;

    if (!gl || !shader || !quad || !instanceData) {
      return;
    }

    const count = Math.min(instanceCount, MAX_INSTANCES);
    const matrices = generateTestMatrices(count, viewport);
    
    console.log('RENDER', {
      offsetX: viewport.offsetX.toFixed(3),
      offsetY: viewport.offsetY.toFixed(3),
      zoom: viewport.zoom.toFixed(3),
      firstRect: {
        scaleX: matrices[0].toFixed(3),
        scaleY: matrices[4].toFixed(3),
        posX: matrices[2].toFixed(3),
        posY: matrices[5].toFixed(3),
      },
      lastRect: {
        scaleX: matrices[(count-1)*9 + 0].toFixed(3),
        scaleY: matrices[(count-1)*9 + 4].toFixed(3),
        posX: matrices[(count-1)*9 + 2].toFixed(3),
        posY: matrices[(count-1)*9 + 5].toFixed(3),
      },
    });
    
    const uploadSuccess = updateInstances(gl, instanceData, matrices);
    console.log('GPU upload:', uploadSuccess);
    
    if (!uploadSuccess) {
      return;
    }

    clearCanvas(gl, 0.95, 0.95, 0.95);
    drawInstanced(gl, shader, quad, instanceData, [0.2, 0.4, 0.8, 1.0]);
  }, [instanceCount, viewport]);

  // Native wheel event (not React's - passive issue)
  useEffect(() => {
    const canvas = contentRef.current;
    if (!canvas) return;

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      setViewport((vp) =>
        handleWheel(vp, e.deltaY, canvas.width, canvas.height, mouseX, mouseY)
      );
    };

    canvas.addEventListener('wheel', handleWheelNative, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', handleWheelNative);
    };
  }, []);

  // Mouse event handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setViewport((vp) => handleMouseDown(vp, e.clientX, e.clientY));
  };

  const onMouseMove = (e: React.MouseEvent) => {
    setViewport((vp) => handleMouseMove(vp, e.clientX, e.clientY));
  };

  const onMouseUp = () => {
    setViewport((vp) => handleMouseUp(vp));
  };

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
      <canvas
        ref={contentRef}
        width={800}
        height={600}
        style={styles.canvas}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
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
        <div style={styles.info}>
          Zoom: {viewport.zoom.toFixed(2)}x
          <br />
          Pan: ({viewport.offsetX.toFixed(2)}, {viewport.offsetY.toFixed(2)})
        </div>
      </div>
      
      <div style={styles.status}>
        WebGL Ready | {instanceCount} rectangles
        <br />
        <small>Drag to pan | Scroll to zoom</small>
      </div>
    </div>
  );
}

/**
 * Generate test matrices with viewport transform.
 * MANDATE: Bounded loop, deterministic output.
 */
function generateTestMatrices(
  count: number,
  viewport: ViewportState
): Float32Array {
  const safeCount = Math.max(1, Math.min(count, MAX_INSTANCES));
  
  const FLOATS_PER_MATRIX = 9;
  const matrices = new Float32Array(safeCount * FLOATS_PER_MATRIX);

  const gridSize = Math.ceil(Math.sqrt(safeCount));
  const worldSize = 10.0;
  const spacing = worldSize / gridSize;
  const rectSize = spacing * 0.7;
  
  const worldToNDC = 2.0 / worldSize;

  for (let i = 0; i < safeCount; i++) {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    
    const worldX = (col - gridSize / 2) * spacing + spacing / 2;
    const worldY = (row - gridSize / 2) * spacing + spacing / 2;
    
    const offset = i * FLOATS_PER_MATRIX;
    
    // Apply viewport transform
    const viewX = (worldX - viewport.offsetX) * viewport.zoom;
    const viewY = (worldY - viewport.offsetY) * viewport.zoom;
    
    const ndcX = viewX * worldToNDC;
    const ndcY = viewY * worldToNDC;
    
    const ndcSize = rectSize * viewport.zoom * worldToNDC;
    
    matrices[offset + 0] = ndcSize;
    matrices[offset + 1] = 0;
    matrices[offset + 2] = ndcX;
    matrices[offset + 3] = 0;
    matrices[offset + 4] = ndcSize;
    matrices[offset + 5] = ndcY;
    matrices[offset + 6] = 0;
    matrices[offset + 7] = 0;
    matrices[offset + 8] = 1;
  }

  return matrices;
}

const styles = {
  container: {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    cursor: 'grab',
  },
  canvas: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    cursor: 'inherit',
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
  info: {
    marginTop: '10px',
    fontSize: '12px',
    color: '#666',
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
    textAlign: 'right' as const,
  },
};