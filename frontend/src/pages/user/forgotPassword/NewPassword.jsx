import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLocation,useNavigate } from 'react-router-dom';
const NewPassword = () => {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate()
    const location = useLocation();
    const qureySearch = new URLSearchParams(location.search);
    const token = qureySearch.get('token')
    console.log(token);

    useEffect(()=>{
      if(!token){
        navigate('/login')
      }
    },[token])
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        // Add your password reset logic here

        // Simulate API call
        setTimeout(() => setLoading(false), 1000);
    };

    return (
        <div className="min-h-screen flex">
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
            )}

            {/* Left section with illustration */}
            <div className="w-1/2 flex items-center justify-center bg-white p-8">
                <img src="/assets/newPassword.png" alt="Reset Password Illustration" className="max-w-md" />
            </div>

            {/* Right section with form */}
            <div className="w-1/2 flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full px-12 py-16">
                    <h1 className="text-2xl font-bold mb-4 text-gray-900">New Password</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all"
                                    placeholder="Enter new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            <p className="text-sm text-gray-500">Use 8 or more characters with a mix of letters, numbers & symbols</p>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all"
                                    placeholder="Confirm new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {error && <p className="text-red-600 text-sm">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-md font-medium transition-all duration-200"
                        >
                            Submit
                        </button>

                        {/* Back Link */}
                        <div className="pt-4">
                            <a
                                href="/login"
                                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
                            >
                                <ArrowLeft size={16} className="mr-2" />
                                <span className="font-medium">Back to Login</span>
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewPassword;