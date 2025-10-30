// MANDATE: Viewport controls, bounded operations, <60 SLOC per function

/**
 * Viewport state for pan/zoom.
 */
export interface ViewportState {
  offsetX: number;
  offsetY: number;
  zoom: number;
  isDragging: boolean;
  lastMouseX: number;
  lastMouseY: number;
}

/**
 * Zoom limits (mandate: bounded).
 */
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10.0;

/**
 * Create initial viewport.
 */
export function createViewport(): ViewportState {
  return {
    offsetX: 0,
    offsetY: 0,
    zoom: 1.0,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
  };
}

/**
 * Handle mouse down (start pan).
 */
export function handleMouseDown(
  viewport: ViewportState,
  clientX: number,
  clientY: number
): ViewportState {
  return {
    ...viewport,
    isDragging: true,
    lastMouseX: clientX,
    lastMouseY: clientY,
  };
}

/**
 * Handle mouse move (pan if dragging).
 */
export function handleMouseMove(
  viewport: ViewportState,
  clientX: number,
  clientY: number
): ViewportState {
  if (!viewport.isDragging) {
    return viewport;
  }

  // Calculate screen delta
  const dx = clientX - viewport.lastMouseX;
  const dy = clientY - viewport.lastMouseY;

  // Convert screen delta to world delta
  // FIXED: Removed the 0.01 multiplier that made it too slow
  const worldDx = dx / (viewport.zoom * 400); // 400 = half canvas width
  const worldDy = -dy / (viewport.zoom * 300); // 300 = half canvas height, negated for Y-up

  return {
    ...viewport,
    offsetX: viewport.offsetX + worldDx,
    offsetY: viewport.offsetY + worldDy,
    lastMouseX: clientX,
    lastMouseY: clientY,
  };
}

/**
 * Handle mouse up (stop pan).
 */
export function handleMouseUp(viewport: ViewportState): ViewportState {
  return {
    ...viewport,
    isDragging: false,
  };
}

/**
 * Handle wheel (zoom).
 * MANDATE: Bounded zoom, clamped to limits.
 */
export function handleWheel(
  viewport: ViewportState,
  deltaY: number,
  canvasWidth: number,
  canvasHeight: number,
  mouseX: number,
  mouseY: number
): ViewportState {
  // Calculate zoom factor
  const zoomSpeed = 0.001;
  const factor = 1.0 - deltaY * zoomSpeed;

  // Get world point before zoom
  const normX = (mouseX / canvasWidth) * 2 - 1;
  const normY = -((mouseY / canvasHeight) * 2 - 1);
  const worldBeforeX = normX / viewport.zoom + viewport.offsetX;
  const worldBeforeY = normY / viewport.zoom + viewport.offsetY;

  // Apply zoom with bounds
  const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, viewport.zoom * factor));

  // Get world point after zoom
  const worldAfterX = normX / newZoom + viewport.offsetX;
  const worldAfterY = normY / newZoom + viewport.offsetY;

  // Adjust offset to keep point stable
  const offsetX = viewport.offsetX + (worldBeforeX - worldAfterX);
  const offsetY = viewport.offsetY + (worldBeforeY - worldAfterY);

  return {
    ...viewport,
    zoom: newZoom,
    offsetX,
    offsetY,
  };
}

/**
 * Get view matrix for rendering.
 * Returns 3x3 matrix as Float32Array (column-major).
 */
export function getViewMatrix(viewport: ViewportState): Float32Array {
  const { offsetX, offsetY, zoom } = viewport;

  // 3x3 matrix: scale, then translate
  // Column-major order for WebGL
  return new Float32Array([
    zoom, 0, 0,           // Column 0
    0, zoom, 0,           // Column 1
    -offsetX * zoom, -offsetY * zoom, 1,  // Column 2
  ]);
}