import React, { useEffect, useState, useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GetCart } from '../../store/middlewares/user/cart';

// MUI components
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Badge, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  useMediaQuery,
  Box,
  CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Lucide React icons
import { Heart, User, ShoppingBag, Menu, X, Search } from 'lucide-react';

const Navigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((state) => state.Cart);

  // Fetch cart data only once when the component mounts
  useEffect(() => {
    if (!cart || cart.length === 0) {
      dispatch(GetCart());
    }
  }, [dispatch]);

  // Memoize cart length to avoid unnecessary re-renders
  const cartCount = useMemo(() => (cart ? cart.length : 0), [cart]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navItems = [
    { label: 'Shop', path: '/shop' },
    { label: 'Men', path: '/men' },
    { label: 'Women', path: '/women' },
    { label: 'Kids', path: '/kids' }
  ];

  // Style for active links
  const activeStyle = {
    fontWeight: 'bold',
    color: '#000',
    textDecoration: 'none',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '2px',
      bottom: '-4px',
      left: 0,
      backgroundColor: '#000',
    }
  };

  // Drawer content
  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2 }}>
        <IconButton onClick={handleDrawerToggle}>
          <X size={24} />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.label} 
            disablePadding
            onClick={() => {
              navigate(item.path);
              handleDrawerToggle();
            }}
            sx={{ px: 3, py: 1.5 }}
          >
            <ListItemText 
              primary={item.label} 
              sx={{ 
                '& .MuiTypography-root': {
                  fontSize: '1.1rem'
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0} sx={{ py: 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Mobile menu toggle */}
          {isMobile && (
            <IconButton 
              edge="start" 
              color="inherit" 
              aria-label="menu"
              onClick={handleDrawerToggle}
            >
              <Menu size={24} />
            </IconButton>
          )}
          
          {/* Logo */}
          <Box 
            sx={{ 
              flexGrow: isMobile ? 1 : 0, 
              display: 'flex', 
              justifyContent: isMobile ? 'center' : 'flex-start' 
            }}
          >
            <Link to="/">
              <img 
                src="/assets/vogueus.png" 
                alt="Logo" 
                style={{ 
                  width: isMobile ? '90px' : '120px', 
                  height: 'auto' 
                }} 
              />
            </Link>
          </Box>
          
          {/* Navigation Links - Only visible on tablet and desktop */}
          {!isMobile && (
            <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
              {navItems.map((item) => (
                <Button 
                  key={item.label}
                  component={NavLink}
                  to={item.path}
                  sx={{ 
                    mx: isTablet ? 1 : 2,
                    color: 'text.secondary',
                    '&.active': activeStyle,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
          
          {/* Action Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1 : 2 }}>
          
            <IconButton 
              color="inherit" 
              aria-label="wishlist"
              onClick={() => navigate('/wishlist')}
            >
              <Heart size={22} />
            </IconButton>
            
            <IconButton 
              color="inherit" 
              aria-label="account"
              onClick={() => navigate('/account-details/profile')}
            >
              <User size={22} />
            </IconButton>
            
            <IconButton 
              color="inherit" 
              aria-label="cart"
              onClick={() => navigate('/cart-items')}
            >
              <Badge 
                badgeContent={loading ? undefined : cartCount} 
                color="primary"
                overlap="circular"
              >
                {loading ? (
                  <CircularProgress size={20} thickness={5} />
                ) : (
                  <ShoppingBag size={22} />
                )}
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;