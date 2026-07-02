import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safely swallow third-party cross-origin script/ad network errors
if (typeof window !== 'undefined') {
  const originalOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    const msg = String(message || '').toLowerCase();
    const src = String(source || '').toLowerCase();
    
    if (
      msg.includes('script error') || 
      src.includes('undergocutlery.com') || 
      src.includes('highperformanceformat.com') ||
      src.includes('invoke.js')
    ) {
      console.warn('Swallowed unhandled third-party script error safely:', message, 'Source:', source);
      return true; // Stop event propagation
    }
    
    if (originalOnError) {
      return originalOnError.apply(this, [message, source, lineno, colno, error]);
    }
    return false;
  };

  window.addEventListener('unhandledrejection', (event) => {
    try {
      const reason = event.reason;
      if (reason) {
        const reasonStr = String(reason.message || reason).toLowerCase();
        const reasonStack = String(reason.stack || '').toLowerCase();
        if (
          reasonStr.includes('script error') || 
          reasonStr.includes('undergocutlery.com') || 
          reasonStr.includes('highperformanceformat.com') ||
          reasonStack.includes('undergocutlery.com') ||
          reasonStack.includes('highperformanceformat.com')
        ) {
          console.warn('Swallowed unhandled third-party rejection safely:', reason);
          event.preventDefault();
          event.stopPropagation();
        }
      }
    } catch (_) {
      // Avoid throwing inside the listener
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

