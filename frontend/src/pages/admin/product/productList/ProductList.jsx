import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// Material UI imports
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Grid,
  IconButton,
  Container,
  Divider,
  Paper
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LocalOffer as TagIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';

import { fetchProduct, blockAndUnBlock } from '../../../../store/middlewares/admin/ProductRelate';
import BloackProductModal from './BloackProductModal';
import { toast } from 'react-toastify';

const AdminProductList = () => {
  const [editProduct, setEditedProduct] = useState(false);


  const [modalState, setModalState] = useState({
    isOpen: false,
    productId: null,
    productName: null,
    actionType: null
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Products, loading } = useSelector((state) => state.AllProducts);

  useEffect(() => {
    dispatch(fetchProduct());
  }, [dispatch]);

  const HandleEdit = (productID) => {
      navigate(`/admin/updateProduct/${productID}`)
  };

  const handleOpenModal = useCallback((productId, productName, actionType) => {
    setModalState({
      isOpen: true,
      productId,
      productName,
      actionType
    })
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false,
    }))
  }, []);

  const handleConfirmBlock = useCallback(() => {
    if (modalState.productId) {
      dispatch(blockAndUnBlock(modalState.productId));
    }
    handleCloseModal()
  }, [modalState.productId, modalState.actionType, handleCloseModal]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <BloackProductModal
        item={'Product'}
        itemName={modalState.productName}
        typeUpdation={modalState.actionType}
        modalIsOpen={modalState.isOpen}
        closeModal={handleCloseModal}
        handleConfirmBlock={handleConfirmBlock}
      />

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Product Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and monitor your product inventory
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/admin/addproduct')}
        >
          Add New Product
        </Button>
      </Box>

      {Products.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <InventoryIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            No Products Found
          </Typography>
          <Typography color="text.secondary">
            There are no products in the system.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {Products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product?._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="260"
                    image={product?.images[0]}
                    alt={product?.productName}
                  />
                  <Chip
                    label={product?.isBlocked ? 'Inactive' : 'Active'}
                    color={product?.isBlocked ? 'error' : 'success'}
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {product.productName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {product.description}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" color="primary">
                        ₹{product.currentPrice || product.regularPrice}
                      </Typography>
                      {product.currentPrice !== 0 && product.regularPrice !== product.currentPrice && (
                        <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          ${product.regularPrice}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TagIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Category: {product?.category?.categoryName}
                      </Typography>
                    </Box>

                    <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Available Sizes
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {product?.variants?.map((variant, index) => (
                          <Chip
                            key={index}
                            label={variant.size}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Paper>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <IconButton color="primary" size="small">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="success"
                        size="small"
                        onClick={()=>HandleEdit(product._id)}
                        sx={{ ml: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Box>

                    <Button
                      startIcon={product.isBlocked ? <CancelIcon /> : <CheckCircleIcon />}
                      color={product.isBlocked ? "error" : "success"}
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenModal(
                        product._id,
                        product?.productName,
                        product.isBlocked ? 'List' : 'Unlist'
                      )}
                    >
                      {product.isBlocked ? 'List' : 'Unlist'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AdminProductList;