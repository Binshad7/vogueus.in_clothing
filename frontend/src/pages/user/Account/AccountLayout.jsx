import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { User, ShoppingBag, MapPin, Settings, Wallet } from 'lucide-react';

const AccountLayout = () => {
  const location = useLocation();

  const navLinks = [
    {
      to: '/account-details/profile',
      label: 'Profile',
      icon: <User className="w-5 h-5" />
    },
    {
      to: '/account-details/orders',
      label: 'Orders',
      icon: <ShoppingBag className="w-5 h-5" />
    },
    {
      to: '/account-details/wallet',
      label: 'Wallet',
      icon: <Wallet className="w-5 h-5" />
    },
    {
      to: '/account-details/address',
      label: 'Address',
      icon: <MapPin className="w-5 h-5" />
    },
    {
      to: '/account-details/settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  // Extract the current page title from the location
  const getCurrentPageTitle = () => {
    const currentLink = navLinks.find(link => link.to === location.pathname);
    return currentLink ? currentLink.label : 'Account';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b">
        <div className="px-4 py-3">
          <h1 className="text-lg font-semibold text-gray-900">
            {getCurrentPageTitle()}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-8">
          {/* Sidebar Navigation */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Desktop Header */}
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Account Settings
                </h2>
              </div>
              <nav className="p-2">
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
                    <span
                      className={({ isActive }) =>
                        `transition-colors duration-200 ${
                          isActive ? 'text-white' : 'text-gray-400'
                        }`
                      }
                    >
                      {link.icon}
                    </span>
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="lg:hidden mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {getCurrentPageTitle()}
                </h1>
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