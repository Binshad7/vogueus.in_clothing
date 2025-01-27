import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { User, ShoppingBag, MapPin, Settings } from 'lucide-react';

const AccountLayout = () => {
  const location = useLocation();
  
  const navLinks = [
    {
      to: '/account-details/profile',
      label: 'Profile',
      icon: <User size={20} />
    },
    {
      to: '/account-details/orders',
      label: 'Orders',
      icon: <ShoppingBag size={20} />
    },
    {
      to: '/account-details/address',
      label: 'Address',
      icon: <MapPin size={20} />
    },
    {
      to: '/account-details/settings',
      label: 'Settings',
      icon: <Settings size={20} />
    }
  ];

  // Extract the current page title from the location
  const getCurrentPageTitle = () => {
    const currentLink = navLinks.find(link => link.to === location.pathname);
    return currentLink ? currentLink.label : 'Account';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile Header */}
        <div className="md:hidden mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{getCurrentPageTitle()}</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="md:w-64 w-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {/* Desktop Header */}
              <div className="hidden md:block p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
              </div>
              
              <nav className="p-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-gray-900 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`
                    }
                  >
                    <span className={({ isActive }) =>
                      `transition-colors duration-200 ${
                        isActive ? 'text-white' : 'text-gray-400'
                      }`
                    }>
                      {link.icon}
                    </span>
                    <span className="font-medium">{link.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="hidden md:block mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{getCurrentPageTitle()}</h1>
              </div>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;