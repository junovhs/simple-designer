// MANDATE: Tauri bridge, deterministic initialization
const { invoke } = window.__TAURI__.core;

// State
let canvas;
let ctx;
let dpr = 1; // Device pixel ratio
let viewport = {
  offsetX: 0,
  offsetY: 0,
  zoom: 1.0,
  isDragging: false,
  lastX: 0,
  lastY: 0,
};

// Initialize
window.addEventListener("DOMContentLoaded", async () => {
  console.log("Simple Designer starting...");

  // Get canvas
  canvas = document.getElementById("main-canvas");
  if (!canvas) {
    console.error("Canvas not found");
    return;
  }

  // Get container
  const container = document.getElementById("canvas-container");
  
  // FIXED: Account for high-DPI displays
  dpr = window.devicePixelRatio || 1;
  
  canvas.width = container.clientWidth * dpr;
  canvas.height = container.clientHeight * dpr;
  canvas.style.width = container.clientWidth + "px";
  canvas.style.height = container.clientHeight + "px";

  // Get context
  ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("2D context not available");
    return;
  }

  // FIXED: Disable antialiasing for crisp rendering
  ctx.imageSmoothingEnabled = false;

  // Scale context for high-DPI
  ctx.scale(dpr, dpr);

  // Initialize backend
  try {
    const version = await invoke("get_version");
    console.log("Backend version:", version);

    const canvasInfo = await invoke("init_canvas", {
      width: Math.floor(container.clientWidth),
      height: Math.floor(container.clientHeight),
    });
    console.log("Canvas initialized:", canvasInfo);

    updateStatus("Ready");
  } catch (error) {
    console.error("Initialization failed:", error);
    updateStatus("Error: " + error);
  }

  // Setup event listeners
  setupEventListeners();

  // Initial render
  render();
});

// Event listeners
function setupEventListeners() {
  // Mouse events
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mouseleave", onMouseUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });

  // Toolbar buttons
  document.getElementById("btn-select").addEventListener("click", () => {
    updateStatus("Select tool active");
  });

  document.getElementById("btn-rect").addEventListener("click", () => {
    updateStatus("Rectangle tool active");
  });

  document.getElementById("btn-zoom-in").addEventListener("click", () => {
    viewport.zoom = Math.min(10.0, viewport.zoom * 1.2);
    updateZoomDisplay();
    render();
  });

  document.getElementById("btn-zoom-out").addEventListener("click", () => {
    viewport.zoom = Math.max(0.1, viewport.zoom / 1.2);
    updateZoomDisplay();
    render();
  });

  // Window resize
  window.addEventListener("resize", () => {
    const container = document.getElementById("canvas-container");
    dpr = window.devicePixelRatio || 1;
    
    canvas.width = container.clientWidth * dpr;
    canvas.height = container.clientHeight * dpr;
    canvas.style.width = container.clientWidth + "px";
    canvas.style.height = container.clientHeight + "px";
    
    ctx.imageSmoothingEnabled = false;
    ctx.scale(dpr, dpr);
    render();
  });
}

// Mouse handlers
function onMouseDown(e) {
  viewport.isDragging = true;
  viewport.lastX = e.clientX;
  viewport.lastY = e.clientY;
  canvas.style.cursor = "grabbing";
}

function onMouseMove(e) {
  if (!viewport.isDragging) return;

  const dx = e.clientX - viewport.lastX;
  const dy = e.clientY - viewport.lastY;

  // Subtract to make drag direction natural
  viewport.offsetX -= dx / (viewport.zoom * 100);
  viewport.offsetY -= dy / (viewport.zoom * 100);

  viewport.lastX = e.clientX;
  viewport.lastY = e.clientY;

  render();
}

function onMouseUp() {
  viewport.isDragging = false;
  canvas.style.cursor = "grab";
}

function onWheel(e) {
  e.preventDefault();

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Calculate world point at mouse BEFORE zoom
  const worldBeforeX = (mouseX - rect.width / 2) / (viewport.zoom * 100) + viewport.offsetX;
  const worldBeforeY = (mouseY - rect.height / 2) / (viewport.zoom * 100) + viewport.offsetY;

  // Apply zoom
  const zoomFactor = 1.0 - e.deltaY * 0.001;
  viewport.zoom = Math.max(0.1, Math.min(10.0, viewport.zoom * zoomFactor));

  // Calculate world point at mouse AFTER zoom
  const worldAfterX = (mouseX - rect.width / 2) / (viewport.zoom * 100) + viewport.offsetX;
  const worldAfterY = (mouseY - rect.height / 2) / (viewport.zoom * 100) + viewport.offsetY;

  // Adjust offset to keep world point stable
  viewport.offsetX += worldBeforeX - worldAfterX;
  viewport.offsetY += worldBeforeY - worldAfterY;

  updateZoomDisplay();
  render();
}

// Render
function render() {
  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();
  const logicalWidth = rect.width;
  const logicalHeight = rect.height;

  // Clear
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, logicalWidth, logicalHeight);

  // Save state
  ctx.save();

  // Apply viewport transform
  ctx.translate(logicalWidth / 2, logicalHeight / 2);
  ctx.scale(viewport.zoom, viewport.zoom);
  ctx.translate(-viewport.offsetX * 100, -viewport.offsetY * 100);

  // Draw test grid
  drawGrid();

  // Draw test rectangle
  ctx.fillStyle = "#3b82f6";
  ctx.fillRect(Math.round(-50), Math.round(-50), 100, 100);

  // Restore state
  ctx.restore();
}

// Draw grid
function drawGrid() {
  const gridSize = 50;
  const gridCount = 40;

  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 1 / viewport.zoom;

  // Vertical lines
  for (let i = -gridCount; i <= gridCount; i++) {
    const x = Math.round(i * gridSize);
    ctx.beginPath();
    ctx.moveTo(x, -gridCount * gridSize);
    ctx.lineTo(x, gridCount * gridSize);
    ctx.stroke();
  }

  // Horizontal lines
  for (let i = -gridCount; i <= gridCount; i++) {
    const y = Math.round(i * gridSize);
    ctx.beginPath();
    ctx.moveTo(-gridCount * gridSize, y);
    ctx.lineTo(gridCount * gridSize, y);
    ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = "#999";
  ctx.lineWidth = 2 / viewport.zoom;

  // X axis
  ctx.beginPath();
  ctx.moveTo(-gridCount * gridSize, 0);
  ctx.lineTo(gridCount * gridSize, 0);
  ctx.stroke();

  // Y axis
  ctx.beginPath();
  ctx.moveTo(0, -gridCount * gridSize);
  ctx.lineTo(0, gridCount * gridSize);
  ctx.stroke();
}

// UI helpers
function updateStatus(text) {
  const el = document.getElementById("status-text");
  if (el) el.textContent = text;
}

function updateZoomDisplay() {
  const el = document.getElementById("zoom-level");
  if (el) el.textContent = Math.round(viewport.zoom * 100) + "%";
}