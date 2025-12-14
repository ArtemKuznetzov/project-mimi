import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { AppRoutes } from './routes'
import { AuthInitializer } from '@/features/auth/ui/AuthInitializer'
import { ToastProvider } from './providers/toast'
import { Toaster } from '@/shared/ui/Toast'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastProvider>
          <AuthInitializer>
            <AppRoutes />
          </AuthInitializer>
          <Toaster />
        </ToastProvider>
      </BrowserRouter>
    </Provider>
  )
}

export default App

