import { useAppSelector } from '@/app/hooks'
import { logout } from '@/features/auth/model/authSlice'
import { useAppDispatch } from '@/app/hooks'
import { Button } from '@/shared/ui/Button/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card/Card'
import { useToast } from '@/app/providers/toast'
import { useNavigate } from 'react-router-dom'
import {useLogoutMutation} from "@/features/auth/api/authApi.ts";

export const HomePage = () => {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Online Store
          </h1>
          {isAuthenticated && (
            <Button onClick={handleLogout} variant="outline">
              Sign Out
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome!</CardTitle>
              <CardDescription>
                This is your online store homepage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Here you can place store information, popular products
                and other important homepage elements.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Catalog</CardTitle>
              <CardDescription>Browse our assortment</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Coming soon: a product catalog with filtering
                and search capabilities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shopping Cart</CardTitle>
              <CardDescription>Your selected items</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Add items to your cart and place orders with just a few clicks.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

