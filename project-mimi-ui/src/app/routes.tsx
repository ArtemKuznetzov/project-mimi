import { Routes, Route, Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { LoginPage, FeedPage, DialoguesPage, ProfilePage } from '@/pages'
import { AppLayout } from './layouts/AppLayout'
import { useAppSelector } from './hooks'
import { MessagesPage } from "@/pages/MessagesPage";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return !isAuthenticated ? <>{children}</> : <Navigate to="/feed" replace />
}

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="feed" replace />} />
        <Route path="feed" element={<FeedPage />} />
        <Route path="messages" element={<DialoguesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="messages/:dialogueId" element={<MessagesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/feed" replace />} />
    </Routes>
  )
}

