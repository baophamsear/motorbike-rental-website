import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthed, selectAuth } from '../features/auth/authSlice'

export default function ProtectedRoute({ roles }) {
  const isAuthed = useSelector(selectIsAuthed)
  const { user, status } = useSelector(selectAuth)

  if (status === 'loading') return <div>Loading…</div>
  if (!isAuthed) return <Navigate to="/login" replace />

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
