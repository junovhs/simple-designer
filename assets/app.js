// Simple Designer Shell: Event Bus, Store, Module Loader
class EventBus {
    constructor() {
        this.events = {};
    }
    on(event, fn) {
        this.events[event] = this.events[event] || [];
        this.events[event].push(fn);
    }
    emit(event, detail = {}) {
        if (this.events[event]) {
            this.events[event].forEach(fn => fn(detail));
        }
    }
    off(event, fn) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(f => f !== fn);
        }
    }
}

class Store {
    constructor() {
        this.state = {
            selected: [],
            artboards: [],
            layers: [],
            viewBox: { x: 0, y: 0, width: 100, height: 100 }
        };
        this.listeners = [];
        this.undoStack = [];
        this.redoStack = [];
    }
    set(key, value) {
        // Push to undo
        this.undoStack.push(JSON.stringify(this.state));
        if (this.undoStack.length > 50) this.undoStack.shift();
        this.redoStack = []; // Clear redo on change
        
        this.state[key] = value;
        this.listeners.forEach(l => l(this.state));
        localStorage.setItem('simple-designer-state', JSON.stringify(this.state));
    }
    get(key) {
        return this.state[key];
    }
    onChange(fn) {
        this.listeners.push(fn);
    }
    undo() {
        if (this.undoStack.length) {
            this.redoStack.push(JSON.stringify(this.state));
            const prev = JSON.parse(this.undoStack.pop());
            Object.assign(this.state, prev);
            this.listeners.forEach(l => l(this.state));
            localStorage.setItem('simple-designer-state', JSON.stringify(this.state));
        }
    }
    redo() {
        if (this.redoStack.length) {
            this.undoStack.push(JSON.stringify(this.state));
            const next = JSON.parse(this.redoStack.pop());
            Object.assign(this.state, next);
            this.listeners.forEach(l => l(this.state));
            localStorage.setItem('simple-designer-state', JSON.stringify(this.state));
        }
    }
}

// Init globals
window.bus = new EventBus();
window.store = new Store();

// Load state from localStorage
const saved = localStorage.getItem('simple-designer-state');
if (saved) {
    try {
        Object.assign(window.store.state, JSON.parse(saved));
    } catch (err) {
        console.warn('Invalid saved state:', err);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; // Skip inputs
    if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
            e.preventDefault();
            window.store.undo();
            return;
        }
        if (e.key === 'y' || (e.shiftKey && e.key === 'z')) {
            e.preventDefault();
            window.store.redo();
            return;
        }
    }
    switch (e.key.toLowerCase()) {
        case 'v': bus.emit('toolSelect', { tool: 'select' }); break;
        case 'p': bus.emit('toolSelect', { tool: 'pen' }); break;
        case 't': bus.emit('toolSelect', { tool: 'text' }); break;
        case 'a': bus.emit('toolSelect', { tool: 'align' }); break;
    }
});

// Module Loader: Fetch manifest, load/parse/append modules
async function loadModules() {
    try {
        const res = await fetch('/api/nav');
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        const manifest = await res.json();
        console.log('Manifest loaded:', manifest); // Debug log
        
        for (const cat of manifest.cats || []) {
            for (const mod of cat.modules || []) {
                try {
                    const modRes = await fetch(mod.path);
                    if (!modRes.ok) throw new Error(`HTTP ${modRes.status} for ${mod.path}`);
                    const htmlText = await modRes.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(htmlText, 'text/html');
                    
                    // Grab root fragment (first child of body)
                    const fragment = doc.body.firstElementChild;
                    if (!fragment) throw new Error('No root element in module');
                    
                    // Append to slots
                    (mod.slots || []).forEach(slot => {
                        const el = document.querySelector(slot);
                        if (el) {
                            el.appendChild(fragment.cloneNode(true));
                        }
                    });
                    
                    // Inject scripts (eval text, but safe for modules)
                    const scripts = [...doc.querySelectorAll('script')].filter(s => !s.src);
                    scripts.forEach(script => {
                        const newScript = document.createElement('script');
                        newScript.textContent = script.textContent;
                        document.head.appendChild(newScript);
                        document.head.removeChild(newScript); // Clean up
                    });
                    
                    // Wire hooks if defined in global (set by module script)
                    if (window[mod.id] && typeof window[mod.id].init === 'function') {
                        window[mod.id].init({ bus: window.bus, store: window.store });
                    }
                    
                    console.log(`Loaded module: ${mod.id}`);
                } catch (err) {
                    console.warn(`Failed to load ${mod.id}:`, err);
                }
            }
        }
        
        // Hide loading placeholders
        document.querySelectorAll('.loading').forEach(el => {
            el.textContent = el.classList.contains('loading') ? 'Ready' : '';
        });
        
        // Emit ready
        bus.emit('appReady', { manifest });
    } catch (err) {
        console.error('Manifest load failed:', err);
        document.querySelector('#app').innerHTML = `
            <div style="padding:2rem;text-align:center;">
                <h1>Simple Designer</h1>
                <p>Loading failed: ${err.message}</p>
                <p>Check console for details. Ensure /api/nav works.</p>
            </div>
        `;
    }
}

// Basic pan/zoom on canvas (pre-module placeholder)
const canvas = document.getElementById('svg-canvas');
let isPanning = false, lastX, lastY;
canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const vb = window.store.get('viewBox');
    const scale = e.deltaY < 0 ? 1.1 : 0.9;
    const mouseX = (e.clientX - rect.left) / rect.width * vb.width + vb.x;
    const mouseY = (e.clientY - rect.top) / rect.height * vb.height + vb.y;
    vb.width *= scale;
    vb.height *= scale;
    vb.x = mouseX - (mouseX - vb.x) * scale;
    vb.y = mouseY - (mouseY - vb.y) * scale;
    canvas.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.width} ${vb.height}`);
    window.store.set('viewBox', { ...vb });
}, { passive: false });
canvas.addEventListener('mousedown', e => {
    if (e.button === 2 || (e.button === 0 && e.ctrlKey)) { // Middle or Ctrl+left
        isPanning = true;
        lastX = e.clientX;
        lastY = e.clientY;
        canvas.style.cursor = 'grabbing';
        e.preventDefault();
    }
});
document.addEventListener('mousemove', e => {
    if (isPanning) {
        const vb = window.store.get('viewBox');
        const deltaX = (e.clientX - lastX) * (vb.width / canvas.clientWidth);
        const deltaY = (e.clientY - lastY) * (vb.height / canvas.clientHeight);
        vb.x -= deltaX;
        vb.y -= deltaY;
        canvas.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.width} ${vb.height}`);
        lastX = e.clientX;
        lastY = e.clientY;
    }
});
document.addEventListener('mouseup', () => {
    isPanning = false;
    canvas.style.cursor = 'default';
});
canvas.addEventListener('contextmenu', e => e.preventDefault()); // Right-click pan

// Bootstrap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadModules);
} else {
    loadModules();
}