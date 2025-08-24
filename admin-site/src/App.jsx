// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import PrivateRoute from './routes/PrivateRoute';
import Login from './pages/auth/Login';
import UserProfile from './pages/auth/UserProfile';
import { MyProvider } from './context/MyContext';
import Users from './pages/users/Users';


export default function App() {
  return (
    <MyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Các route yêu cầu đăng nhập */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<UserProfile />} />
            <Route path="/users" element={<Users />} />
            {/* <Route path="/admin" element={<AdminDashboard />} /> */}
          </Route>

          {/* fallback: chuyển mọi đường khác về login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </MyProvider>
  );
}
