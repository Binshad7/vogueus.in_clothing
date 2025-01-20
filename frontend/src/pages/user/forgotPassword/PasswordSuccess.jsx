import React from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PasswordSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[400px] text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 rounded-full border-2 border-green-500 flex items-center justify-center">
                        <Check className="w-6 h-6 text-green-500" />
                    </div>
                </div>
                
                <h1 className="text-xl font-semibold text-gray-800 mb-2">
                    Password Changed!
                </h1>
                
                <p className="text-gray-600 mb-6">
                    Your password has been changed successfully.
                </p>
                
                <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-md font-medium transition-all duration-200"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
};

export default PasswordSuccess;