// MANDATE: Shader sources and compilation, functions <60 SLOC
import { compileShader, createProgram } from "../webgl";

/**
 * Vertex shader for instanced rectangles.
 * Takes per-vertex position and per-instance matrix.
 */
const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute mat3 a_matrix;
  
  void main() {
    vec3 pos = a_matrix * vec3(a_position, 1.0);
    gl_Position = vec4(pos.xy, 0.0, 1.0);
  }
`;

/**
 * Fragment shader for solid color rectangles.
 */
const FRAGMENT_SHADER = `
  precision mediump float;
  uniform vec4 u_color;
  
  void main() {
    gl_FragColor = u_color;
  }
`;

/**
 * Compiled shader program with attribute/uniform locations.
 */
export interface ShaderProgram {
  program: WebGLProgram;
  attribs: {
    position: number;
    matrix: number;
  };
  uniforms: {
    color: WebGLUniformLocation | null;
  };
}

/**
 * Create instanced shader program.
 * MANDATE: All GL operations checked, errors explicit.
 */
export function createInstancedShader(gl: WebGLRenderingContext): ShaderProgram | null {
  // MANDATE: Input validation
  if (!gl || gl.isContextLost()) {
    console.error('Invalid GL context');
    return null;
  }

  // Compile shaders
  const vertShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

  // MANDATE: Check compilation
  if (!vertShader || !fragShader) {
    console.error('Shader compilation failed');
    return null;
  }

  // Link program
  const program = createProgram(gl, vertShader, fragShader);
  if (!program) {
    console.error('Program linking failed');
    gl.deleteShader(vertShader);
    gl.deleteShader(fragShader);
    return null;
  }

  // Get attribute locations
  const positionLoc = gl.getAttribLocation(program, 'a_position');
  const matrixLoc = gl.getAttribLocation(program, 'a_matrix');

  // MANDATE: Validate locations
  if (positionLoc < 0 || matrixLoc < 0) {
    console.error('Attribute locations invalid', { positionLoc, matrixLoc });
    gl.deleteProgram(program);
    return null;
  }

  // Get uniform locations
  const colorLoc = gl.getUniformLocation(program, 'u_color');

  // Cleanup shaders (no longer needed after linking)
  gl.deleteShader(vertShader);
  gl.deleteShader(fragShader);

  console.log('Instanced shader created', {
    positionLoc,
    matrixLoc,
    hasColorUniform: colorLoc !== null,
  });

  return {
    program,
    attribs: {
      position: positionLoc,
      matrix: matrixLoc,
    },
    uniforms: {
      color: colorLoc,
    },
  };
}