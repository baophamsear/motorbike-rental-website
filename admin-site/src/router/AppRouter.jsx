import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AdminLayout from '../components/layout/AdminLayout'

// Pages
import Login from '../pages/auth/Login'
import DashboardPage from '../pages/dashboard/Index'
// import UsersPage from '../pages/users/Index'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute roles={['ADMIN']}> </ProtectedRoute>}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* <Route path="/users" element={<UsersPage />} /> */}
            {/* thêm các route khác */}
          </Route>
        </Route>

        <Route path="*" element={<div>Not found</div>} />
      </Routes>
    </BrowserRouter>
  )
}
