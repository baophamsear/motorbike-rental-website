// components/layout/AdminLayout.jsx
import { Link, Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

export default function AdminLayout(){
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', minHeight:'100vh' }}>
      <aside style={{ padding:16, borderRight:'1px solid #eee' }}>
        <h3>Admin</h3>
        <nav style={{ display:'grid', gap:8 }}>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/users">Users</Link>
        </nav>
        <button onClick={onLogout} style={{ marginTop:16 }}>Logout</button>
      </aside>
      <main style={{ padding:24 }}>
        <Outlet />
      </main>
    </div>
  )
}
