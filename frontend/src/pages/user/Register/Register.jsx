import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../components/user/Footer';
import FormInput from '../../../utils/FormInput';
import RegisterValidation from '../../../utils/FormValidation';
import passwordStorng from '../../../utils/passwordStrong';
import GoogleSignIn from '../../../components/user/GoogleSignIn';
import { demoStore } from '../../../store/reducers/user/users_auth_slice';
import emailVerification from '../../../api/email-verification';
import Spinner from '../../../components/user/Spinner';

const Register = () => {

  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false)
  const { loading } = useSelector((state) => state.user)
  const isAuthenticated = localStorage.getItem('isAuthenticated') || false;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated])


  const [userData, setuserData] = useState({
    userName: "",
    email: '',
    password: '',
    confirmPassword: ""
  });

  const [error, setError] = useState({});
  const [passwordStrong, setPasswordStrong] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  // handle on change user data
  const handleOnChange = useCallback((e) => {
    try {
      setError(null);
      const { name, value } = e.target
      setuserData(prev => ({
        ...prev,
        [name]: value,
      }))
    } catch (error) {
      console.log('error', error.message);
    }
  }, [userData]);

  // password strong checking

  useEffect(() => {
    let result = passwordStorng(userData.password);
    if (!userData.password.trim()) {
      setPasswordStrong(null);
    }
    setPasswordStrong(result);

  }, [userData.password])


  // handle on submit user data
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      let errors = RegisterValidation(userData)
      setError(errors || {});

      if (Object?.keys(errors)?.length > 0 || passwordStrong?.status !== 'strong') {
        setLoading(false)
        toast.error("Please fix the errors before submitting.");
        return
      }
      // email verification send to user
      const response = await emailVerification(userData);
      if (response) {
        dispatch(demoStore(userData));
        setLoading(false);
        navigate('/verify-email');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "Some thing wrong")
    }

  };

  return (
    <>

      {
        loading || isLoading && (
          <Spinner />
        )
      }
      <div className="min-h-screen bg-white">

        <div className="max-w-6xl mx-auto px-1 py-12 flex">
          {/* Left Side - Illustration */}
          <div className="hidden lg:flex w-1/2 items-center justify-center">
            <img
              src="/assets/signup.png"
              alt="Shopping illustration"
              className="max-w-md"
            />
          </div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-1/2 max-w-md mx-auto">
            <h1 className="text-2xl font-semibold text-center">Sign Up</h1>
            <p className="text-sm text-center text-gray-600 mt-2 mb-8">
              Sign up for free to access to any of our products
            </p>

            <div className="space-y-6">
              <GoogleSignIn signup={'signup'} />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">

                <FormInput
                  type="text"
                  name="userName"
                  value={userData?.userName}
                  onChange={handleOnChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded border border-gray-300 focus:border-black focus:ring-0"

                />
                {error?.userName && <p className='text-red-600 text-sm'>{error?.userName}</p>}

                <FormInput
                  type="email"
                  name="email"
                  value={userData?.email}
                  onChange={handleOnChange}
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded border border-gray-300 focus:border-black focus:ring-0"
                />
                {error?.email && <p className='text-red-600 text-sm'>{error?.email}</p>}


                <div className="relative">
                  {
                    passwordStrong ? <p className={passwordStrong?.statusClass}>Password is {passwordStrong?.status}</p> : <p className='text-sm'>Password must include 1 special character, 1 uppercase, 1 number, and 1 lowercase</p>
                  }



                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={userData?.password}
                    onChange={handleOnChange}
                    placeholder="Password"
                    className="w-full px-4 py-3 rounded border border-gray-300 focus:border-black focus:ring-0"
                  />
                  {
                    showPassword ? <EyeOff onClick={() => setShowPassword(false)} className='absolute  right-2 top-[44px] cursor-pointer' /> : <Eye onClick={() => setShowPassword(true)} className='absolute right-2 top-[44px] cursor-pointer' />
                  }
                  <div className={passwordStrong?.class} />
                  {error?.password && <p className='text-red-600 text-sm'>{error?.password}</p>}
                </div>

                <FormInput
                  type="password"
                  name="confirmPassword"
                  value={userData?.confirmPassword}
                  onChange={handleOnChange}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 rounded border border-gray-300 focus:border-black focus:ring-0"
                />
                {error?.confirmPassword && <p className='text-red-600 text-sm'>{error?.confirmPassword}</p>}

                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                >
                  Sign Up
                </button>
              </form>
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-black hover:underline font-medium"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
};

export default Register;