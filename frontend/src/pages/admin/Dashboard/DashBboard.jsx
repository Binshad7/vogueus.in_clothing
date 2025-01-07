import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import StatusCard from '../../../components/admin/Dashboard/StatusCardRow/StatusCard';
import SalesStatistics from '../../../components/admin/Dashboard/Chart/SalesStatistics';
import RevenueArea from '../../../components/admin/Dashboard/Chart/RevenueArea';
import NewOrders from '../../../components/admin/Dashboard/OrcersAndMembers/NewOrders';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  console.log('dash compontet dash')
  // Sample data
  const { isAuthenticated } = useSelector((state) => state.user)
  console.log('user',isAuthenticated);
  
  const navigate = useNavigate()
  useEffect(() => {
    if(!isAuthenticated) return  navigate('/admin/login')
  }, [isAuthenticated])
  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header with Create Report Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="h-5 w-5" />
          Create Report
        </button>
      </div>
      <StatusCard />
      <div className="grid grid-cols-1 lg:grid-cols-[60%,38%] gap-6">
        <SalesStatistics />
        <RevenueArea />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NewOrders />
        <NewOrders />
      </div>
    </div>
  );
};

export default Dashboard;