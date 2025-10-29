// MANDATE: WASM loader, direct import approach
export type WasmModule = typeof import('../../rust-core/pkg/simple_designer_core');

let wasmInstance: WasmModule | null = null;

/**
 * Initialize WASM module.
 */
export async function initWasm(): Promise<WasmModule> {
  if (wasmInstance) {
    return wasmInstance;
  }

  try {
    // Direct import of the generated module
    const wasm = await import('../../rust-core/pkg/simple_designer_core.js');
    
    // MANDATE: Validate module structure
    if (!wasm) {
      throw new Error('WASM module is null');
    }
    
    // Check if init exists
    if (typeof wasm.default !== 'undefined') {
      // Module uses default export
      await wasm.default();
      wasmInstance = wasm as WasmModule;
    } else if (typeof wasm.init === 'function') {
      // Module has init function
      await wasm.init();
      wasmInstance = wasm as WasmModule;
    } else {
      throw new Error('WASM module missing init - check build');
    }
    
    console.log('WASM loaded', { 
      version: typeof wasm.version === 'function' ? wasm.version() : 'unknown',
      hasInit: typeof wasm.init === 'function',
      hasDefault: typeof wasm.default === 'function',
    });
    
    return wasmInstance;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('WASM init failed', { error: message, stack: err instanceof Error ? err.stack : undefined });
    throw new Error(`WASM initialization failed: ${message}`);
  }
}

/**
 * Get WASM instance.
 */
export function getWasm(): WasmModule {
  if (!wasmInstance) {
    throw new Error('WASM not initialized - call initWasm() first');
  }
  return wasmInstance;
}