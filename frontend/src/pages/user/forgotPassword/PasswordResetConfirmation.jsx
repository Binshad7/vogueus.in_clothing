import React from 'react';
import { CheckCircle } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box,
} from '@mui/material';

const PasswordResetConfirmation = () => {
  const handleReturnToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ padding: '1.5rem' }}>
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '1rem'
            }}
          >
            <Box 
              sx={{ 
                backgroundColor: '#d1fae5',
                borderRadius: '50%',
                padding: '0.75rem'
              }}
            >
              <CheckCircle 
                size={32}
                style={{ color: '#059669' }}
              />
            </Box>
            
            <Typography 
              variant="h5" 
              component="h1"
              sx={{ 
                fontWeight: 'bold',
                color: '#111827'
              }}
            >
              Check Your Email
            </Typography>
            
            <Typography 
              variant="body1"
              sx={{ 
                color: '#4b5563',
                maxWidth: '20rem'
              }}
            >
              We've sent password reset instructions to your email address. Please check your inbox and follow the link to reset your password.
            </Typography>
            
            <Button 
              variant="contained"
              fullWidth
              onClick={handleReturnToLogin}
              sx={{ 
                marginTop: '0.5rem',
                maxWidth: '16rem',
                textTransform: 'none',
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0'
                }
              }}
            >
              Return to Login
            </Button>
            
            <Typography 
              variant="body2"
              sx={{ 
                color: '#6b7280',
                fontSize: '0.875rem'
              }}
            >
              Didn't receive the email? Check your spam folder or try requesting another reset.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PasswordResetConfirmation;