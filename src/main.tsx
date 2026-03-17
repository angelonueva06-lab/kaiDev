import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SupabaseProvider } from './SupabaseProvider';
import { ErrorBoundary } from './ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <SupabaseProvider>
        <App />
      </SupabaseProvider>
    </ErrorBoundary>
  </StrictMode>,
);
