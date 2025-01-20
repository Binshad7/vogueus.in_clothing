import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const NotFoundPage = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h1 className="text-4xl font-bold text-gray-900">404</h1>
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800">
              Page Not Found
            </h2>
            <p className="text-gray-600 max-w-md">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors min-w-[120px]"
            >
              Go Back
            </button>
            <button 
              onClick={() =>  navigate('/')}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors min-w-[120px]"
            >
              Home Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;