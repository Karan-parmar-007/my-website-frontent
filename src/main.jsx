import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from '@/contexts/AuthContext'

// React Query client with production-ready defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes before data is considered stale
      gcTime: 10 * 60 * 1000,   // 10 minutes cache retention
      retry: 1,                  // Single retry on failure
      refetchOnWindowFocus: false, // Don't refetch on tab focus
    },
  },
})

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>,
  {/* </StrictMode>, */}
)
