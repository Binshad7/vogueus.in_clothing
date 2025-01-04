import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Button, TextField, Typography, Box } from '@mui/material';
import emailVerification from '../../api/email-verification';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearDemoUser } from '../../store/reducers/user/users_auth_slice';
import { userRegister } from '../../store/middlewares/user/user_auth';

const OTP = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [timeLeft, setTimeLeft] = useState(60);
  const [isExpired, setIsExpired] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setIsExpired(true);
      localStorage.removeItem('otp');
    }
  }, [timeLeft]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index) ? element.value : d)]);

    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace') {
      if (index > 0 && otp[index] === '') {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.length > 0) {
      const updatedOtp = [...otp];
      pastedData.forEach((value, index) => {
        if (index < 6 && !isNaN(value)) {
          updatedOtp[index] = value;
        }
      });
      setOtp(updatedOtp);
      const lastFilledIndex = updatedOtp.findIndex(val => val === '') - 1;
      const focusIndex = lastFilledIndex >= 0 ? lastFilledIndex : updatedOtp.length - 1;
      inputRefs.current[focusIndex].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem('demouser'));
    const validOTP = JSON.parse(localStorage.getItem('otp'));
    console.log('validOTP:', validOTP);
    console.log('otp:', otp.join(''));
    if (otp.join('') === String(validOTP)) {
      toast.success('OTP verified successfully');
      localStorage.removeItem('otp');
      dispatch(clearDemoUser());
      dispatch(userRegister(userData));
      navigate('/');
    }
    else {
      toast.error('Invalid OTP');
    };

  }
    const handleResend = () => {
      const userData = JSON.parse(localStorage.getItem('demouser'));
      const newOtp = emailVerification(userData, 'resend');
      console.log(userData, 'userData');

      if (newOtp) {
        toast.success('OTP sent successfully');
      }
      setTimeLeft(60);
      setIsExpired(false);
      setOtp(new Array(6).fill(''));
      inputRefs.current[0].focus();
    };

    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f5f5'
        }}
      >
        <Card sx={{ maxWidth: 400, width: '100%', m: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box textAlign="center" mb={3}>
              <Typography variant="h5" component="h1" gutterBottom>
                Email Verification
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please enter the verification code sent to your email
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 1,
                  mb: 3
                }}
              >
                {otp.map((data, index) => (
                  <TextField
                    key={index}
                    inputRef={el => inputRefs.current[index] = el}
                    value={data}
                    onChange={e => handleChange(e.target, index)}
                    onKeyDown={e => handleBackspace(e, index)}
                    onPaste={handlePaste}
                    inputProps={{
                      maxLength: 1,
                      style: {
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        padding: '8px',
                        width: '40px'
                      }
                    }}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>

              <Box textAlign="center" mb={2}>
                {!isExpired ? (
                  <Typography color="text.secondary" variant="body2">
                    Expires in {timeLeft} seconds
                  </Typography>
                ) : (
                  <Typography color="error" variant="body2">
                    OTP has expired!
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isExpired || otp.some(digit => digit === '')}
                  fullWidth
                >
                  Verify
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleResend}
                  disabled={!isExpired}
                  fullWidth
                >
                  Resend Code
                </Button>
              </Box>
            </form>

            <Box textAlign="center" mt={2}>
              <Typography variant="body2" color="text.secondary">
                Didn't receive the code? Check your spam folder
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  };

export default OTP;