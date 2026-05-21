import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminLogin } from './components/AdminLogin'
import { AdminDashboard } from './components/AdminDashboard'
import { AdminProjects } from './components/AdminProjects'
import { AdminSkills } from './components/AdminSkills'

function AdminApp() {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/projects" element={<AdminProjects />} />
      <Route path="/admin/skills" element={<AdminSkills />} />
      {/* Redirect to login as default */}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  )
}

export default AdminApp
