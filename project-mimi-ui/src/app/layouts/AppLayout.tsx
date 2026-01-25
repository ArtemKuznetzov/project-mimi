import { Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout } from '@/features/auth/model/authSlice'
import { useLogoutMutation } from '@/features/auth/api/authApi'
import { useToast } from '@/app/providers/toast'
import { Button } from '@/shared/ui/Button/Button'
import { Navigation } from '@/widgets/Navigation/ui/Navigation'

export const AppLayout = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [logoutRequest] = useLogoutMutation()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const toast = useToast()

  const handleLogout = async () => {
    try {
      await logoutRequest().unwrap()
      dispatch(logout())
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)
      toast.error({
        title: 'Logout Error',
        description: 'Failed to logout. Please try again.',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            🐾 Mimi Social
          </h1>
          {isAuthenticated && (
            <Button onClick={handleLogout} variant="outline">
              Sign Out
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-6">
        <div className="flex items-start gap-6">
          <Navigation className="shrink-0" />
          <section className="min-w-0 flex-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900">
            <Outlet />
          </section>
        </div>
      </main>
    </div>
  )
}

