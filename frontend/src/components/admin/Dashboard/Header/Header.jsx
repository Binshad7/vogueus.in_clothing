import React, { useContext, useState } from 'react';
import { Search, Bell, MessageSquare, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { SideBarContext } from '../../../../context/SideBarContext';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLogout } from '../../../../store/middlewares/admin/admin_auth';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { isToogle } = useContext(SideBarContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await dispatch(adminLogout());
      if (adminLogout.fulfilled.includes(result)){
        navigate('/admin/dash')
      }

    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white border-b h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side - Search */}
        <div className="flex items-center flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Right side - Notifications & Profile */}
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="h-6 w-6 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MessageSquare className="h-6 w-6 text-gray-500" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <div
              className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
              <span className="font-medium">Admin</span>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showDropdown ? 'transform rotate-180' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                  onClick={() => navigate('/admin/profile')}
                >
                  <User size={16} className="text-gray-500" />
                  <span>Profile</span>
                </button>

                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                  onClick={() => navigate('/admin/settings')}
                >
                  <Settings size={16} className="text-gray-500" />
                  <span>Settings</span>
                </button>

                <div className="border-t my-1"></div>

                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="text-red-600" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;