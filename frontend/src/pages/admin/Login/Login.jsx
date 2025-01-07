import React, { useEffect, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, XCircle } from 'lucide-react';
import { adminLogin } from '../../../store/middlewares/admin/admin_auth';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
 const {adminIsisAuthenticated} = useSelector((state)=>state.admin)
  const { loading } = useSelector(state => state.admin)
  useEffect(() => {
     
    if (adminIsisAuthenticated) {
      navigate('/admin/dash')
    }
  }, [adminIsisAuthenticated])

  const [adminDetails, setAdminDetails] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)


  const hadnleOnChange = (e) => {
    setError({})
    setAdminDetails({ ...adminDetails, [e.target.id]: e.target.value })
  }


  // validation 
  const validate = () => {
    const errors = {}
    const regx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (!adminDetails.email.match(regx)) errors.email = 'Email is not valid'
    if (!adminDetails.email.trim()) errors.email = 'Email is required'
    if (!adminDetails.password.trim()) errors.password = 'Password is required'
    return errors
  }

  // ... [Rest of the component remains the same until the Alert usage]
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) return setError(errors);

    dispatch(adminLogin(adminDetails))
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 animate-gradient-shift">
      <div className='max-w-md w-full mx-4 space-y-8 p-8 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg 
        transition-all duration-500 ease-in-out transform hover:shadow-1xl'>

        {/* Logo Section */}
        <div className="text-center relative">
          <div className='mx-auto h-16 w-16 bg-gradient-to-tr from-indigo-600 to-purple-600 
            rounded-xl flex items-center justify-center mb-4 transform transition-all duration-700 animate-float'>
            <Lock className='h-8 w-8 text-white transition-transform duration-700 ' />
          </div>

          <div className="relative overflow-hidden">
            <h2 className='text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 
              bg-clip-text text-transparent transition-all duration-300 translate-y-0'>
              Admin Login
            </h2>
          </div>

          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your admin account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">

          <div className="relative group">
            <div className="relative transition-all duration-300 transform origin-left">
              <input
                id="email"
                type="email"
                name='email'
                required
                disabled={loading}
                value={adminDetails.email}
                onChange={hadnleOnChange}
                className="peer w-full px-10 py-3 border-2 border-gray-300 rounded-lg outline-none 
                  focus:border-indigo-500 placeholder-transparent transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed bg-white/50 backdrop-blur-sm"
                placeholder="Email"
              />
              {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
              <label
                htmlFor="email"
                className="absolute left-10 -top-6 text-sm text-gray-600 cursor-text 
                  transition-all duration-300 peer-placeholder-shown:text-base 
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                  peer-focus:-top-6 peer-focus:text-sm peer-focus:text-indigo-600"
              >
                Email address
              </label>
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 
                transition-colors duration-300 group-focus-within:text-indigo-500" />
            </div>
          </div>

          {/* Password Field with floating label */}
          <div className="relative group">
            <div className="relative transition-all duration-300 transform origin-left">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading}
                value={adminDetails.password}
                onChange={hadnleOnChange}
                name='password'
                className="peer w-full px-10 py-3 border-2 border-gray-300 rounded-lg outline-none 
                  focus:border-indigo-500 placeholder-transparent transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed bg-white/50 backdrop-blur-sm"
                placeholder="Password"
              />
              {error.password && <p className="text-red-500 text-sm">{error.password}</p>}

              <label
                htmlFor="password"
                className="absolute left-10 -top-6 text-sm text-gray-600 cursor-text 
                  transition-all duration-300 peer-placeholder-shown:text-base 
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                  peer-focus:-top-6 peer-focus:text-sm peer-focus:text-indigo-600"
              >
                Password
              </label>
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 
                transition-colors duration-300 group-focus-within:text-indigo-500" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-3.5 text-gray-400 
                  hover:text-indigo-500 transition-colors duration-300"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  disabled={loading}
                  className="peer sr-only"
                />
                <div className="h-4 w-4 border-2 border-gray-300 rounded 
                  transition-all duration-300 peer-checked:bg-indigo-500 
                  peer-checked:border-indigo-500 peer-disabled:opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center 
                  text-white scale-0 peer-checked:scale-100 transition-transform duration-300">
                  <svg className="h-3 w-3" fill="none" strokeLinecap="round"
                    strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-800 
                transition-colors duration-300">
                Remember me
              </span>
            </label>

            <a href="#" className="text-sm font-medium text-indigo-600 
              hover:text-purple-600 transition-colors duration-300">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`relative w-full py-3 px-4 border border-transparent rounded-lg
              text-sm font-medium text-[black] overflow-hidden transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed transform
              ${isSuccess
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
              } hover:scale-[1.02] active:scale-[0.98]`}
          >
            <div className="relative flex items-center justify-center">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isSuccess ? (
                'Success!'
              ) : (
                'Sign in'
              )}
            </div>

          </button>
        </form>
      </div>
    </div>
  );
};

// Animation keyframes remain the same
const styles = `
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes success-wave {
  0% { transform: translateX(-100%) skewX(-15deg); }
  50%, 100% { transform: translateX(100%) skewX(-15deg); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}

.animate-gradient-shift {
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-success-wave {
  animation: success-wave 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
`;

export default AdminLogin;