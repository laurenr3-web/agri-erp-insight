
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RealtimeCacheProvider } from '@/providers/RealtimeCacheProvider';
import { OfflineProvider } from '@/providers/OfflineProvider';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RealtimeCacheProvider>
        <OfflineProvider>
          <App />
        </OfflineProvider>
      </RealtimeCacheProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
