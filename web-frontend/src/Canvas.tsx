// MANDATE: Canvas component, functions <60 SLOC
import { useEffect, useRef, useState } from 'react';
import { initWebGL, clearCanvas } from './webgl';

/**
 * Three-layer canvas component.
 * MANDATE: Simple approach, layered for performance.
 */
export default function Canvas(): JSX.Element {
  const backgroundRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  
  const [glContext, setGlContext] = useState<WebGLRenderingContext | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize WebGL on mount
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

    setGlContext(gl);
    
    // Initial clear
    clearCanvas(gl, 0.95, 0.95, 0.95);
    
    console.log('Canvas mounted', { 
      width: canvas.width, 
      height: canvas.height 
    });
  }, []);

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
      {/* Static background layer */}
      <canvas
        ref={backgroundRef}
        width={800}
        height={600}
        style={styles.canvas}
      />
      
      {/* Dynamic content layer (WebGL) */}
      <canvas
        ref={contentRef}
        width={800}
        height={600}
        style={styles.canvas}
      />
      
      {/* UI overlay layer */}
      <canvas
        ref={overlayRef}
        width={800}
        height={600}
        style={styles.canvas}
      />
      
      {glContext && (
        <div style={styles.status}>
          WebGL Ready
        </div>
      )}
    </div>
  );
}

// MANDATE: No magic values, deterministic styles
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