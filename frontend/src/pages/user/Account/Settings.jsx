import React, { useEffect, useState } from 'react';
import { LogOut, Lock, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '../../../store/middlewares/user/user_auth';
import { toast } from 'react-toastify';
import passwordStorng from '../../../utils/passwordStrong';
import userAxios from '../../../api/userAxios';
const Settings = () => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrong, setPasswordStrong] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false)
  const user = useSelector(state => state.user.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    const result = dispatch(userLogout());
    if (userLogout.fulfilled.match(result)) {
      navigate('/');
    }
  };

  const validateCurrentPassword = async () => {
    if (!currentPassword.trim()) {
      return setError('Password Is Required');
    }
    try {
      const response = await userAxios.post(`/user/checkPassowrd/${user._id}`, { currentPassword });
      setShowCurrentPassword(false);
      setShowNewPassword(true);
      setError('');
    } catch (error) {
      setError(error?.response?.data?.message);
      // setCurrentPassword('')
    }

  };
  useEffect(() => {
    let result = passwordStorng(newPassword);
    if (!newPassword.trim()) return setPasswordStrong(null)
    setPasswordStrong(result)
  }, [newPassword])
  const handlePasswordChange = async () => {
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await userAxios.patch(`/user/changePassword/${user._id}`, { newPassword })
      setShowNewPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      toast.success('Password changed successfully');
    } catch (err) {
      setError('Failed to change password. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>

        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            {/* Password Change Section */}
            <button
              onClick={() => {
                setShowCurrentPassword(!showCurrentPassword);
                if (!showCurrentPassword) {
                  setShowNewPassword(false);
                }
              }}
              className="w-full flex items-center justify-between px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <div className="flex items-center">
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </div>
              <ChevronDown
                className={`h-4 w-4 transform transition-transform ${showCurrentPassword ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Current Password Form */}
            {showCurrentPassword && !showNewPassword && (
              <div className="p-4 border-t">
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setShowCurrentPassword(false);
                        setError('');
                        setCurrentPassword('')
                      }}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={validateCurrentPassword}
                      className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* New Password Form */}
            {showNewPassword && (
              <div className="p-4 border-t">
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}

                <div className="space-y-4">


                  <div className="relative">
                    {
                      passwordStrong ? <p className={passwordStrong?.statusClass}>Password is {passwordStrong?.status}</p> : <p className='text-sm'>Password must include 1 special character, 1 uppercase, 1 number, and 1 lowercase</p>
                    }

                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {
                      showPassword ? <EyeOff onClick={() => setShowPassword(false)} className='absolute  right-2 top-[30px] cursor-pointer' /> : <Eye onClick={() => setShowPassword(true)} className='absolute right-2 top-[30px] cursor-pointer' />
                    }
                    <div className={passwordStrong?.class} />

                  </div>


                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setShowNewPassword(false);
                        setShowCurrentPassword(false);
                        setError('');
                      }}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePasswordChange}
                      className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowLogoutDialog(true)}
            className="w-full flex items-center px-4 py-2 text-left bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowLogoutDialog(false)}></div>
          <div className="relative bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>

            <p className="mb-4">Are you sure you want to logout? You will need to login again to access your account.</p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;