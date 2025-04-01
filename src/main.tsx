
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import * as React from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
);
