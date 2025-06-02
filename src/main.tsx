import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react'; // <-- Add this import

createRoot(document.getElementById("root")!).render(<App />);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Analytics /> {/* <-- Add this line */}
  </React.StrictMode>
);
