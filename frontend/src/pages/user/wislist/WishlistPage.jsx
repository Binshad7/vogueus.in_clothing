import React, { useEffect, useState } from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';
import {
  Typography,
  Paper,
  IconButton,
  Stack,
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchwishlist, removeProductFromWishlist } from '../../../store/middlewares/user/wishlist';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { wishlistItems, loading } = useSelector((state) => state.wishlist);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const naviagate = useNavigate()
  useEffect(() => {
    dispatch(fetchwishlist());
  }, [dispatch]);

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // Add your delete logic here
    dispatch(removeProductFromWishlist(selectedItem._id))
    setDeleteModal(false);
    setSelectedItem(null);
  };

  const handleCloseModal = () => {
    setDeleteModal(false);
    setSelectedItem(null);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #3498db',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }}
        />
      </Box>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          sx={{
            textAlign: 'center',
            py: 6,
            px: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <ShoppingBag size={64} color="#9e9e9e" />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#212121' }}>
            Your wishlist is empty
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Save items you love in your wishlist and review them anytime
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#2874f0',
              '&:hover': { bgcolor: '#1a5fb4' }
            }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

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

            key={item._id}
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
                src={item.images[0]}
                alt={item.productName}
                style={{ width: '100%', height: 'auto' }}
              />
            </Box>
            <div onClick={() => naviagate(`/product/${item._id}`)}>

              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    color: '#212121',
                    fontSize: '16px',
                    marginBottom: 1,
                    '&:hover': {
                      color: '#2874f0',
                      cursor: 'pointer'
                    }
                  }}
                >
                  {item.productName}
                </Typography>

                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#757575',
                    marginBottom: 1
                  }}
                >
                  {item.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {

                    item.currentPrice > 0 ?
                      (
                        <div>

                          <Typography
                            sx={{
                              fontSize: '14px',
                              color: '#878787',
                              textDecoration: 'line-through'
                            }}
                          >
                            ₹{item.regularPrice.toLocaleString()}

                          </Typography>
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
                              color: '#388e3c'
                            }}
                          >
                            {Math.round(
                              ((item.regularPrice - item.currentPrice) / item.regularPrice) * 100
                            )}% off
                          </Typography>
                        </div>
                      )
                      :
                      <Typography
                        sx={{
                          fontSize: '20px',
                          fontWeight: 500,
                          color: '#212121'
                        }}
                      >

                        ₹{item.regularPrice.toLocaleString()}
                      </Typography>

                  }
                </Box>
              </Box>
            </div>

            <IconButton
              onClick={() => handleDeleteClick(item)}
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

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModal}
        onClose={handleCloseModal}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Remove from Wishlist
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove "<span className='text-red-700 text-xl'> {selectedItem?.productName}  </span>  " from your wishlist?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            sx={{ color: '#616161' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              bgcolor: '#ff3d00',
              '&:hover': { bgcolor: '#dd2c00' }
            }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WishlistPage;