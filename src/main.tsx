
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create a container for the React app
const container = document.getElementById("root");

// Make sure we have a container
if (!container) {
  throw new Error("Could not find root element");
}

// Create a root
const root = createRoot(container);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
