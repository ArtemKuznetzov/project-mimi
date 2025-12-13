import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLoginMutation } from '../api/authApi'
import { setAccessToken } from '@/features/auth'
import { useAppDispatch } from '@/app/hooks'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/Button/Button'
import { Input } from '@/shared/ui/Input/Input'
import { Label } from '@/shared/ui/Label/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card/Card'
import { useState, useRef } from 'react'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .pipe(z.email()),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [login, { isLoading, error }] = useLoginMutation()
  const lastSubmitTime = useRef<number>(0)
  const [submitDisabled, setSubmitDisabled] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    const now = Date.now() // Spam protection
    const timeSinceLastSubmit = now - lastSubmitTime.current
    
    if (timeSinceLastSubmit < 1000) {
      return
    }
    
    lastSubmitTime.current = now
    setSubmitDisabled(true)
    
    try {
      const result = await login(data).unwrap()
      
      if (result.accessToken && typeof result.accessToken === 'string' && result.accessToken.trim() !== '') {
        dispatch(setAccessToken(result.accessToken))
        navigate('/')
      } else {
        if (import.meta.env.DEV) {
          console.error('Invalid token response from server')
        }
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Login error:', err)
      }
    } finally {
      setTimeout(() => setSubmitDisabled(false), 1000) // Unlock button after request
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to sign in</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@mail.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {error && 'data' in error && (
            <p className="text-sm text-destructive">
              Sign in failed. Please check your credentials.
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading || submitDisabled}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

