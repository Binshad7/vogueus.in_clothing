import Header from "../components/admin/Dashboard/Header/Header";
import Sidebar from "../components/admin/Dashboard/Sidebar/SideBar";
import { Outlet } from "react-router-dom";
import AdminProtectRoute from './AdminProtectRoute'
import { SideBarContext } from "../context/SideBarContext";
import { useContext } from "react";
import AdminRoutes from "./AdminRoutes";
import { ToastContainer } from "react-toastify";


import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { adminRefresh } from '../store/middlewares/admin/admin_auth'

const ProtectedDashboardLayout = () => {
  const { isToogle } = useContext(SideBarContext);
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(adminRefresh())
  }, [])
  return (
    <>
      <ToastContainer position="top-center" />
      <AdminProtectRoute>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className={`flex-1 flex flex-col transition-all ${isToogle ? 'ml-64' : 'ml-16'
            }`}>
            <Header />
            <main className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Your stats cards here */}
              </div>
              <AdminRoutes />
            </main>
          </div>
        </div>
      </AdminProtectRoute>
    </>
  );
};

export default ProtectedDashboardLayout;