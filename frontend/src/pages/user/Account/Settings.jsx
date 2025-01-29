import React, { useCallback, useState } from 'react';
import { LogOut, Lock } from 'lucide-react';

const Settings = () => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = useCallback(() => {
    const result = dispatch(userLogout());
    if (userLogout.fulfilled.match(result)) {
      navigate('/')
    }
  }, [navigate]);


  const handleChangePassword = () => {
    // Add your change password navigation/logic here
    console.log('Navigate to change password...');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>

        <div className="space-y-4">
          <button
            onClick={handleChangePassword}
            className="w-full flex items-center px-4 py-2 text-left border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Lock className="mr-2 h-4 w-4" />
            Change Password
          </button>

          <button
            onClick={() => setShowLogoutDialog(true)}
            className="w-full flex items-center px-4 py-2 text-left bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Logout Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="mb-6">
              Are you sure you want to logout? You will need to login again to access your account.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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