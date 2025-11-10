import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// index.js (top of file)
const resizeObserverErrSilencer = () => {
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0]?.toString().includes('ResizeObserver loop completed')) return;
    if (args[0]?.toString().includes('ResizeObserver loop limit exceeded')) return;
    originalError(...args);
  };
};
resizeObserverErrSilencer();


const root = createRoot(document.getElementById('root'));
root.render(<App />);
