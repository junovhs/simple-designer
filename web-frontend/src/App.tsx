// MANDATE: Root component, async init with error handling
import { useEffect, useState } from 'react';
import Canvas from './Canvas';
import { initWasm } from './wasm';

export default function App(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize WASM on mount
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        await initWasm();
        
        // MANDATE: Check still mounted before state update
        if (mounted) {
          setLoading(false);
          console.log('App initialized');
        }
      } catch (err) {
        // MANDATE: Errors explicit with context
        const message = err instanceof Error ? err.message : 'Unknown error';
        if (mounted) {
          setError(message);
          setLoading(false);
        }
        console.error('App init failed', { error: message });
      }
    }

    init();

    // Cleanup
    return () => {
      mounted = false;
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div style={styles.center}>
        <h1>Loading Simple Designer...</h1>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={styles.center}>
        <h1>Error</h1>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  // Ready state
  return <Canvas />;
}

// MANDATE: Deterministic styles, no magic values
const styles = {
  center: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    fontFamily: 'system-ui, sans-serif',
  },
  error: {
    color: '#c00',
    fontFamily: 'monospace',
    marginTop: '10px',
  },
};