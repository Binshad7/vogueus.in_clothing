import React, { useContext } from 'react';
import { Search, Bell, MessageSquare, ChevronDown } from 'lucide-react';
import { SideBarContext } from '../../../../context/SideBarContext';

const Header = () => {
  const {isToogle} = useContext(SideBarContext)
  return (
    <header className={`bg-white border-b h-16 h-100}`}>
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
          <div className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100 rounded-lg">
            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
            <span className="font-medium">Admin</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;