import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserRoutes from './routes/UserRoutes'
import { ToastContainer } from 'react-toastify'
import ProtectedDashboardLayout from './routes/ProtectedDashboardLayout'
import AdminLogin from './pages/admin/Login/Login'


function App() {

  return (
    <>
      <ToastContainer position='top-center' />
      <BrowserRouter>
        <Routes>

          {/* admin   */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<ProtectedDashboardLayout />} />


          {/* user route */}

          <Route path="/*" element={<UserRoutes />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
