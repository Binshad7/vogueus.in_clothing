import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

// Protected Route Wrapper Component
const AdminProtectedRoute = ({ children }) => {
  const adminIsisAuthenticated = useSelector((state)=>state.admin.isAuthenticated)
  console.log(adminIsisAuthenticated,'from')
  useEffect(()=>{
    console.log(adminIsisAuthenticated,'admin is ');
    if (!adminIsisAuthenticated) {
      return <Navigate to="/admin/login" replace />;
    }
    
  },[adminIsisAuthenticated])

  return children;
};
export default AdminProtectedRoute;