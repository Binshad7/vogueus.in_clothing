import React, { useContext, useEffect, useState } from 'react';
import { Home, Package, ShoppingCart, Users, Settings, ChevronDown, Menu, Boxes, ReceiptJapaneseYen,BadgeJapaneseYen } from 'lucide-react';
import { SideBarContext } from '../../../../context/SideBarContext';
import { useNavigate } from 'react-router-dom';
const Sidebar = ({ }) => {
  // Use an object to track open/closed state of all submenus
  const [openMenus, setOpenMenus] = useState({});
  const [activeMenuItem, setActiveMenuItem] = useState('/');
  const { isToogle, updateToogle } = useContext(SideBarContext);
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/admin${activeMenuItem}`);
  }, [activeMenuItem]);



  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      path: '/'
    },
    {
      title: 'Products',
      icon: <Package className="h-5 w-5" />,
      path: '/product',
      submenu: [
        { title: 'Product List', path: '/product' },
        { title: 'Add Product', path: '/addproduct' },
      ]
    },
    {
      title: 'Category',
      icon: <Package className="h-5 w-5" />,
      path: '/category',

    },
    {
      title: 'Orders',
      icon: <ShoppingCart className="h-5 w-5" />,
      path: '/orders'
    },
    {
      title: 'Customers',
      icon: <Users className="h-5 w-5" />,
      path: '/allusers'
    },
    {
      title: 'Stock Management',
      icon: <Boxes className="h-5 w-5" />,
      path: '/stockmanagement'
    },
    {
      title: 'Coupon',
      icon: <ReceiptJapaneseYen className="h-5 w-5" />,
      path: '/coupon'
    },
    {
      title: 'Offer',
      icon: <BadgeJapaneseYen className="h-5 w-5" />,
      path: '/offer'
    },
    {
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      path: '/settings'
    }
  ];

  const toggleSubmenu = (path) => {

    setOpenMenus(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  return (
    <aside
      className={`bg-white min-h-screen fixed border-r transition-all ${isToogle ? 'w-64' : 'w-16'
        }`}
    >

      <nav className="p-4">
        {/* Toggle Button */}
        <button
          className="flex items-center justify-center p-2 rounded-lg bg-gray-200 hover:bg-gray-300 mb-4"
          onClick={() => updateToogle(!isToogle)}
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <div key={index}>
              <button
                className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 ${activeMenuItem === item.path ? 'bg-green-100 text-green-700' : ''
                  } ${item.submenu ? 'cursor-pointer' : ''}`}
                onClick={() => {
                  if (item.submenu) {
                    toggleSubmenu(item.path);
                    setActiveMenuItem(item.path);
                  } else {
                    setActiveMenuItem(item.path);
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  {isToogle && <span>{item.title}</span>}
                </div>
                {item.submenu && isToogle && (
                  <ChevronDown
                    className={`h-4 w-4  transition-transform ${openMenus[item.path] ? 'transform rotate-180 ' : ''
                      }`}
                  />
                )}
              </button>

              {/* Submenu */}
              {item.submenu && openMenus[item.path] && isToogle && (
                <div className="pl-11 space-y-1 mt-1">
                  {item.submenu.map((subItem, subIndex) => (

                    <a
                      key={subIndex}
                      className={`block  cursor-pointer p-2 rounded-lg hover:bg-gray-100 ${activeMenuItem === subItem.path ? 'bg-green-100 text-green-700' : 'text-gray-600'
                        }`}
                      onClick={() => {

                        navigate(`/admin${subItem.path}`);
                        setActiveMenuItem(subItem.path)
                      }
                      }
                    >
                      {subItem.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;