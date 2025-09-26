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
    }
    set(key, value) {
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
}

// Init globals
window.bus = new EventBus();
window.store = new Store();

// Load state from localStorage
const saved = localStorage.getItem('simple-designer-state');
if (saved) {
    Object.assign(window.store.state, JSON.parse(saved));
}

// Keyboard shortcuts
document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey) return; // Skip globals for now
    switch (e.key.toLowerCase()) {
        case 'v': bus.emit('toolSelect', { tool: 'select' }); break;
        case 'p': bus.emit('toolSelect', { tool: 'pen' }); break;
        case 't': bus.emit('toolSelect', { tool: 'text' }); break;
        case 'z': if (e.shiftKey) window.store.set('undo', 'redo'); else window.store.set('undo', 'undo'); break;
    }
});

// Module Loader: Fetch manifest, load/parse/append modules
async function loadModules() {
    try {
        const res = await fetch('/api/nav');
        const manifest = await res.json(); // { cats: [{ name: 'Core', modules: [{ id: 'infinite-canvas', path: '/pages/cat.Canvas/infinite-canvas/index.html', slots: ['#canvas-center'], hooks: ['onLoad'] }] }] }
        
        for (const cat of manifest.cats) {
            for (const mod of cat.modules) {
                try {
                    const modRes = await fetch(mod.path);
                    const htmlText = await modRes.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(htmlText, 'text/html');
                    const fragment = doc.body.firstElementChild; // Assume module outputs single root element
                    
                    // Append to slots
                    mod.slots.forEach(slot => {
                        const el = document.querySelector(slot);
                        if (el) {
                            el.appendChild(fragment.cloneNode(true)); // Clone if multi-slot
                            // Extract/inject scripts
                            const scripts = doc.querySelectorAll('script');
                            scripts.forEach(script => {
                                const newScript = document.createElement('script');
                                newScript.text = script.textContent;
                                document.head.appendChild(newScript);
                            });
                        }
                    });
                    
                    // Wire hooks (e.g., mod.onLoad = () => bus.on('toolSelect', ...))
                    if (window[mod.id] && window[mod.id].onLoad) {
                        window[mod.id].onLoad({ bus, store });
                    }
                    
                    console.log(`Loaded module: ${mod.id}`);
                } catch (err) {
                    console.warn(`Failed to load ${mod.id}:`, err);
                }
            }
        }
        
        // Hide loading placeholders
        document.querySelectorAll('.loading').forEach(el => el.textContent = '');
        
        // Emit ready
        bus.emit('appReady');
    } catch (err) {
        console.error('Manifest load failed:', err);
        document.body.innerHTML = '<div style="padding:2rem;text-align:center;">Loading modules... (Check console)</div>';
    }
}

// Pan/zoom basics on canvas (pre-module)
const canvas = document.getElementById('svg-canvas');
let isPanning = false, startX, startY;
canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const vb = window.store.get('viewBox');
    const scale = e.deltaY < 0 ? 1.1 : 0.9;
    vb.width *= scale;
    vb.height *= scale;
    vb.x -= (e.offsetX - vb.x) * (1 - scale);
    vb.y -= (e.offsetY - vb.y) * (1 - scale);
    canvas.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.width} ${vb.height}`);
    window.store.set('viewBox', vb);
});
canvas.addEventListener('mousedown', e => { if (e.button === 0 && e.ctrlKey) { isPanning = true; startX = e.clientX; startY = e.clientY; } });
document.addEventListener('mousemove', e => {
    if (isPanning) {
        const vb = window.store.get('viewBox');
        vb.x -= (e.clientX - startX) * (vb.width / canvas.clientWidth);
        vb.y -= (e.clientY - startY) * (vb.height / canvas.clientHeight);
        canvas.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.width} ${vb.height}`);
        startX = e.clientX; startY = e.clientY;
    }
});
document.addEventListener('mouseup', () => isPanning = false);

// Bootstrap
document.addEventListener('DOMContentLoaded', loadModules);