import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
} from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import userAxios from '../../../api/userAxios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../../components/user/Spinner';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        if (!email.trim()) {
            setError('Fil The Filed');
            setLoading(false)
            return
        }
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Enter Valid Email')
            setLoading(false)
            return
        }
        setError('');
        console.log('Password reset requested for:', email);
        try {
            const response = await userAxios.post('/forgot-password', {email});
                setLoading(false)
                navigate('/PasswordResetConfirmation')
                return

        } catch (error) {
            setLoading(false)
            toast.error(error.response.data.message)
        }


    };

    return (
        <div className="min-h-screen flex">
            {
                loading && <Spinner/>
            }
            {/* Left section with illustration */}
            <div className="w-1/2 flex items-center justify-center bg-white p-8">
                <img src="/assets/forgout-password.png" alt="" />
            </div>

            {/* Right section with form */}
            <div className="w-1/2 flex items-center justify-center">
                <div className="max-w-md w-full px-12 py-16">
                    {/* Header Section */}
                    <div className="mb-10">
                        <Typography
                            variant="h3"
                            className="font-bold mb-4 text-gray-900"
                        >
                            Reset Your Password
                        </Typography>
                        <Typography
                            variant="body1"
                            className="text-gray-600 leading-relaxed"
                        >
                            Enter your email and we'll send you a link to reset your password.
                            Please check it.
                        </Typography>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <Typography
                                variant="subtitle2"
                                className="text-gray-700 font-medium"
                            >
                                Email Address
                            </Typography>
                            <TextField
                                fullWidth
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                variant="outlined"
                                className="bg-white"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#E5E7EB',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#9CA3AF',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#6B7280',
                                        },
                                    },
                                    '& input': {
                                        padding: '14px 16px',
                                    },
                                }}
                            />
                            {error && <p className='text-red-700 text-lg'>{error}</p>}
                        </div>

                        <Button
                           onClick={handleSubmit}
                            type="submit"
                            variant="contained"
                            fullWidth
                            className="bg-black hover:bg-gray-800 text-white py-4 text-base font-medium normal-case rounded-md shadow-sm transition-all duration-200"
                            sx={{
                                textTransform: 'none',
                                boxShadow: 'none',
                                '&:hover': {
                                    boxShadow: 'none',
                                },
                            }}
                        >
                            Send Reset Link
                        </Button>

                        {/* Back to Login Link */}
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

export default ForgotPassword;