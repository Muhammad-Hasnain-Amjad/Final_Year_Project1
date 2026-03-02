import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { ToastContainer } from 'react-toastify';
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import './index.css'
import App from './App.jsx'
const queryClient = new QueryClient();



const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ToastContainer autoClose={1000} />
    </QueryClientProvider>
  </StrictMode>
);

