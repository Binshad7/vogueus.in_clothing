import React from 'react';
import { Trash2 } from 'lucide-react';
import {
  Typography,
  Paper,
  IconButton,
  Stack,
  Box
} from '@mui/material';

const WishlistPage = () => {
  // Sample data - replace with your actual data
  const wishlistItems = [
    {
      id: 1,
      image: "/api/placeholder/150/150",
      name: "ZEBRONICS Pure Pixel 60.96 cm (24 inch) Full HD VA Panel with 250 nits brightness, HDMI, VGA, Ultra Sl...",
      currentPrice: 6999,
      originalPrice: 24999,
      discount: 72,
      assured: true
    },
    {
      id: 2,
      image: "/api/placeholder/150/150",
      name: "NikkFashionista Typography Men Round Neck Black T-Shirt",
      currentPrice: 274,
      originalPrice: 999,
      discount: 72,
      assured: false
    },
    {
      id: 3,
      image: "/api/placeholder/150/150",
      name: "EVOFOX Fireblade LED Backlit Wired USB Gaming Keyboard",
      currentPrice: 951,
      originalPrice: 1299,
      discount: 26,
      assured: true
    }
  ];

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600, 
          marginBottom: 2,
          color: '#212121'
        }}
      >
        My Wishlist ({wishlistItems.length})
      </Typography>

      <Stack spacing={2}>
        {wishlistItems.map((item) => (
          <Paper 
            key={item.id}
            sx={{ 
              p: 2,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              position: 'relative'
            }}
          >
            <Box sx={{ width: 150, flexShrink: 0 }}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '100%', height: 'auto' }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography 
                sx={{ 
                  color: '#212121',
                  fontSize: '14px',
                  marginBottom: 1,
                  '&:hover': {
                    color: '#2874f0',
                    cursor: 'pointer'
                  }
                }}
              >
                {item.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
                {item.assured && (
                  <Typography 
                    component="span"
                    sx={{
                      backgroundColor: '#2874f0',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '2px',
                      fontSize: '12px'
                    }}
                  >
                    Assured
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography 
                  sx={{ 
                    fontSize: '20px',
                    fontWeight: 500,
                    color: '#212121'
                  }}
                >
                  ₹{item.currentPrice.toLocaleString()}
                </Typography>
                <Typography 
                  sx={{ 
                    fontSize: '14px',
                    color: '#878787',
                    textDecoration: 'line-through'
                  }}
                >
                  ₹{item.originalPrice.toLocaleString()}
                </Typography>
                <Typography 
                  sx={{ 
                    fontSize: '14px',
                    color: '#388e3c'
                  }}
                >
                  {item.discount}% off
                </Typography>
              </Box>
            </Box>

            <IconButton 
              sx={{ 
                position: 'absolute',
                top: 8,
                right: 8,
                color: '#878787'
              }}
            >
              <Trash2 size={18} />
            </IconButton>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default WishlistPage;