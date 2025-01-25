import React, { useEffect, useMemo } from 'react';
import { Wishlist } from './common/Wishlist';
import { AccountIcon } from './common/AccountIcon';
import { CartIcon } from './common/CartIcon';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GetCart } from '../../store/middlewares/user/cart';
import Spinner from './Spinner';

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((state) => state.Cart);

  // Fetch cart data only once when the component mounts
  useEffect(() => {
    if (!cart || cart.length == 0) {
      dispatch(GetCart());
    }

  }, [cart]);

  // Memoize cart length to avoid unnecessary re-renders
const cartCount = useMemo(() => (cart ? cart.length : 0), [cart]);

  return (
    <nav className="flex items-center py-6 px-16 justify-between gap-20 custom-nav">
      {loading && <Spinner />}

      {/* Logo Section */}
      <div className="flex items-center gap-6">
        {/* Add logo or other branding */}
      </div>
      <Link to={'/'}>
        <img src="/assets/vogueus.png" className="w-20" alt="Logo" />
      </Link>

      {/* Navigation Items */}
      <div className="flex flex-wrap items-center gap-10">
        <ul className="flex gap-14 text-gray-600 hover:text-black">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'font-bold text-black' : '')}
            >
              Shop
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/men"
              className={({ isActive }) => (isActive ? 'font-bold text-black' : '')}
            >
              Men
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/women"
              className={({ isActive }) => (isActive ? 'font-bold text-black' : '')}
            >
              Women
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/kids"
              className={({ isActive }) => (isActive ? 'font-bold text-black' : '')}
            >
              Kids
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center">
        <div className="border rounded flex overflow-hidden">
          <div className="flex items-center justify-center px-4 border-1">
            <svg
              className="h-4 w-4 text-grey-dark"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
            </svg>
            <input type="text" className="px-4 py-2 outline-none" placeholder="Search" />
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="flex flex-wrap items-center gap-4">
        <ul className="flex gap-8">
          <li>
            <button onClick={() => navigate('/wishlist')}>
              <Wishlist />
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/account-details/profile')}>
              <AccountIcon />
            </button>
          </li>
          <li>
            <Link to="/cart-items" className="flex flex-wrap">
              <CartIcon />
              {!loading && (
                <div className="absolute ml-6 inline-flex items-center justify-center h-6 w-6 bg-black text-white rounded-full border-2 text-xs border-white">
                  {cartCount}
                </div>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
