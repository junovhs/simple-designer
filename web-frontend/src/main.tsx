// MANDATE: Entry point, <60 SLOC, simple initialization
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// MANDATE: Input validation - root element must exist
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// MANDATE: All operations checked
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Log initialization
console.log('Simple Designer initialized', { timestamp: Date.now() });