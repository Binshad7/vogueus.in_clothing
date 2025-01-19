import React, { useCallback, useEffect, useState } from 'react'
import GoogleSignIn from '../../../components/user/GoogleSignIn'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import { Eye, EyeOff } from 'lucide-react'
import FormInput from '../../../utils/FormInput'
import { userLogin } from '../../../store/middlewares/user/user_auth'
const Login = () => {
  const navigate = useNavigate()
  const isAuthenticated  = localStorage.getItem('isAuthenticated') || false
  
  useEffect(() => { 
      if(isAuthenticated){
          navigate('/')
      }
  }, [isAuthenticated])


  const [values, setValues] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const dispatch = useDispatch()

  const validateField = useCallback((userData) => {
    const errors = {}
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    
    if (!userData.email) {
      errors.email = 'Email is required'
    } else if (!emailRegex.test(userData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!userData.password) {
      errors.password = 'Password is required'
    }
    
    return errors
  }, [])

  const onSubmit = useCallback((e) => {
    e.preventDefault()
    const validationErrors = validateField(values)
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    dispatch(userLogin(values))
  }, [dispatch, navigate, values, validateField])

  const handleOnChange = useCallback((e) => {
    const { name, value } = e.target
    setErrors(prev => ({ ...prev, [name]: '' }))
    setValues(prev => ({
      ...prev,
      [name]: value.trim()
    }))
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12 flex items-center justify-between">
        <div className="hidden lg:block w-1/2">
          <div className="relative">
            <img
              src="/assets/login.png"
              alt="Login illustration"
              className="w-full max-w-lg"
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 max-w-md mx-auto">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl text-center font-semibold text-gray-900">Sign In</h1>
            </div>

            <div className="w-full">
              <GoogleSignIn />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div>
                <FormInput
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleOnChange}
                  placeholder="Email Address"
                  className={`w-full px-4 py-3 rounded border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:border-black focus:ring-0 text-sm pr-10`}
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1" role="alert">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={values.password}
                  onChange={handleOnChange}
                  placeholder="Password"
                  className={`w-full px-4 py-3 rounded border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } focus:border-black focus:ring-0 text-sm pr-10`}
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1" role="alert">{errors.password}</p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 
                    <EyeOff className="w-5 h-5" /> : 
                    <Eye className="w-5 h-5" />
                  }
                </button>
                <Link 
                to={'/forgot-password'}
                className="absolute right-0 -bottom-6 text-xs text-gray-600 hover:text-black">
                  Forgot your password?
                </Link>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Sign In
                </button>
              </div>
            </form>

            <p className="text-center text-sm text-gray-600">
              New to our platform?{' '}
              <Link
                to="/register"
                className="text-black hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login