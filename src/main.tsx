
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add safer root element access with fallback
const rootElement = document.getElementById("root");

if (!rootElement) {
  // Create a root element if it doesn't exist (useful for debugging or SSR scenarios)
  console.warn("Root element not found, creating one");
  const newRoot = document.createElement("div");
  newRoot.id = "root";
  document.body.appendChild(newRoot);
  
  createRoot(newRoot).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
