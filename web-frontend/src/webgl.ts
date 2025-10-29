// MANDATE: WebGL initialization, all failures explicit
// All functions <60 SLOC, ≤3 words

/**
 * WebGL context options.
 */
interface ContextOptions {
  alpha: boolean;
  antialias: boolean;
  preserveDrawingBuffer: boolean;
}

/**
 * Initialize WebGL context. Returns null on failure.
 * MANDATE: Validate all inputs and outputs.
 */
export function initWebGL(canvas: HTMLCanvasElement): WebGLRenderingContext | null {
  // MANDATE: ≥2 checks
  if (!canvas) {
    console.error('Canvas null');
    return null;
  }
  if (!(canvas instanceof HTMLCanvasElement)) {
    console.error('Not canvas element');
    return null;
  }

  const options: ContextOptions = {
    alpha: false,
    antialias: true,
    preserveDrawingBuffer: false,
  };

  // Try WebGL context
  const gl = canvas.getContext('webgl', options);
  if (!gl) {
    console.error('WebGL not supported');
    return null;
  }

  // Validate context ready
  if (gl.isContextLost()) {
    console.error('WebGL context lost');
    return null;
  }

  console.log('WebGL initialized', {
    version: gl.getParameter(gl.VERSION),
    vendor: gl.getParameter(gl.VENDOR),
  });

  return gl;
}

/**
 * Compile shader source. Returns null on failure.
 * MANDATE: All GL operations checked.
 */
export function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  // MANDATE: Input validation
  if (!gl) {
    console.error('GL context null');
    return null;
  }
  if (!source || source.length === 0) {
    console.error('Shader source empty');
    return null;
  }

  const shader = gl.createShader(type);
  if (!shader) {
    console.error('Shader creation failed');
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // MANDATE: Check result
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    const log = gl.getShaderInfoLog(shader);
    console.error('Shader compile failed', { log });
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/**
 * Create shader program. Returns null on failure.
 */
export function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | null {
  // MANDATE: Validate inputs
  if (!gl || !vertexShader || !fragmentShader) {
    console.error('Invalid program inputs');
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    console.error('Program creation failed');
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  // MANDATE: Check result
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    const log = gl.getProgramInfoLog(program);
    console.error('Program link failed', { log });
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

/**
 * Clear canvas to color.
 */
export function clearCanvas(gl: WebGLRenderingContext, r: number, g: number, b: number): void {
  // MANDATE: Validate context
  if (!gl || gl.isContextLost()) {
    console.error('Invalid GL context');
    return;
  }

  // Clamp color values
  const cr = Math.max(0, Math.min(1, r));
  const cg = Math.max(0, Math.min(1, g));
  const cb = Math.max(0, Math.min(1, b));

  gl.clearColor(cr, cg, cb, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}