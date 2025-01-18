import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchAllProducts } from '../../../store/middlewares/user/products_handle';
import ProductCard from '../ProductListPage/ProductCard';
import SectionHeading from '../../../components/Sections/SectionsHeading/SectionHeading';
import Spinner from '../../../components/user/Spinner';
import Category from '../../../components/Sections/Categories/Category';
import {
  Box,
  Breadcrumbs,
  Typography,
  Button,
  Paper,
  Rating,
  Chip,
  Divider,
  IconButton,
  Grid,
  Stack,
  Container
} from '@mui/material';
import {
  Heart,
  ShoppingCart,
  Truck,
  RotateCcw,
  CreditCard,
  Ruler,
  ChevronRight
} from 'lucide-react';
import RelatedProductsSection from './RelatedProductsSection ';
import ReviewsSection from './ReviewsSection';
import Breadcrumb from '../../../components/user/Breadcrumb';
const ProductDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [product, setProduct] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { productId } = useParams();
  const { AllProducts, loading } = useSelector((state) => state.AllProductManageSlice);
  useEffect(() => {
    if (!productId) {
      navigate('/')
    }
  })
  useEffect(() => {
    if (!AllProducts.length) {
      dispatch(fetchAllProducts());
    }
  }, [AllProducts.length, dispatch]);

  useEffect(() => {
    setPageLoading(true);
    const currentProduct = AllProducts?.find((item) => item?._id === productId);
    setProduct(currentProduct);
    let relateProduct = AllProducts.filter((item) =>
      item?.category?.categoryName === currentProduct?.category?.categoryName &&
      item?.productName !== currentProduct?.productName
    );
    setRelatedProducts(relateProduct);
    setPageLoading(false);
  }, [AllProducts, productId]);

  const demoProduct = {
    id: '1',
    rating: 4.5,
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [error, setError] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (product?.images?.length) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const extraFeatures = [
    { icon: <CreditCard className="w-6 h-6" />, label: 'Secure Payment', description: 'Safe & secure checkout' },
    { icon: <Ruler className="w-6 h-6" />, label: 'Size & Fit', description: 'Find your perfect fit' },
    { icon: <Truck className="w-6 h-6" />, label: 'Free Shipping', description: 'On orders above ₹999' },
    { icon: <RotateCcw className="w-6 h-6" />, label: 'Easy Returns', description: '30-day return policy' }
  ];

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }

    const selectedVariant = product?.variants?.find(
      (variant) => variant?.size === selectedSize
    );

    if (selectedVariant?.stock === 0) {
      setError("Selected size is out of stock");
      return;
    }

    // Add to cart logic here
    // addToCart(selectedVariant);
    setError(""); // Clear errors if successfully added
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {loading && <Spinner />}

      {/* Breadcrumb */}
      {/* <Breadcrumbs
        separator={<ChevronRight sx={{ fontSize: 16 }} />}
        sx={{ mb: 4 }}
      >
        <Link to={'/'} color="inherit" className='cursor-pointer' underline="hover">Home</Link>
        <Link to={'/men'} color="inherit" className='cursor-pointer' underline="hover">Men</Link>
        <Typography color="text.primary">Shirts</Typography>
      </Breadcrumbs> */}
      <Breadcrumb />

      {/* Product Details Section */}
      <Box sx={{ mb: 6 }}>
        <Grid container spacing={6}>
          {/* Left: Image Gallery */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              {/* Main Image with Zoom */}
              <Paper
                elevation={0}
                sx={{
                  overflow: 'hidden',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    paddingTop: '125%',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleMouseMove}
                >
                  <Box
                    component="img"
                    src={selectedImage}
                    alt={product?.productName}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: isZoomed ? 'scale(2)' : 'scale(1)',
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      transition: 'transform 0.3s ease-out'
                    }}
                  />
                </Box>
              </Paper>

              {/* Thumbnail Strip */}
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                sx={{ px: 2 }}
              >
                {product?.images?.map((image, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: selectedImage === image ? 'primary.main' : 'transparent',
                      '&:hover': {
                        borderColor: 'primary.light'
                      }
                    }}
                    onClick={() => setSelectedImage(image)}
                  >
                    <Box
                      component="img"
                      src={image}
                      alt={`View ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Paper>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Right: Product Info */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  {product?.productName}
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Rating
                    value={demoProduct.rating}
                    precision={0.5}
                    readOnly
                  />
                  <Typography color="text.secondary">
                    {demoProduct.rating} rating
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
                  {product?.currentPrice > 0 ? (
                    <>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        style={{ textDecoration: 'line-through', color: 'gray', marginRight: '8px' }}
                      >
                        ₹{product?.regularPrice}
                      </Typography>
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        ₹{product?.currentPrice}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="h5" fontWeight="bold">
                      ₹{product?.regularPrice || 'N/A'}
                    </Typography>
                  )}
                  <Chip
                    label="10% OFF"
                    color="error"
                    size="small"
                  />
                </Stack>
              </Box>

              <Divider />

              {/* Size Selection */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Select Size
                  </Typography>
                  <Link href="#size-guide" underline="hover">
                    Size Guide
                  </Link>
                </Stack>

                <Grid container spacing={2}>
                  {product?.variants?.map((variant) => (
                    <Grid item xs={3} key={variant?.size}>
                      <Button
                        fullWidth
                        variant={selectedSize === variant?.size ? "contained" : "outlined"}
                        onClick={() => {
                          setSelectedSize(variant?.size);
                          setError('');
                        }}
                        disabled={variant?.stock === 0}
                        sx={{
                          height: 48,
                          borderRadius: 1,
                          backgroundColor: variant?.stock === 0 ? "#f8d7da" : undefined,
                          color: variant?.stock === 0 ? "#721c24" : undefined,
                        }}
                      >
                        {variant?.size} ({variant?.stock > 0 ? `${variant?.stock}` : "Out of stock"})
                      </Button>
                    </Grid>
                  ))}
                </Grid>

                {error && (
                  <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                    {error}
                  </Typography>
                )}
              </Box>

              {/* Add to Cart */}
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={!selectedSize || product?.variants?.find((variant) => variant?.size === selectedSize)?.stock === 0}
                >
                  {selectedSize &&
                    product?.variants?.find((variant) => variant?.size === selectedSize)?.stock === 0
                    ? "Out of Stock"
                    : "Add to Cart"}
                </Button>

                <IconButton
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Heart />
                </IconButton>
              </Stack>

              {/* Extra Features */}
              <Grid container spacing={3}>
                {extraFeatures.map((feature, index) => (
                  <Grid item xs={6} key={index}>
                    <Stack direction="row" spacing={2}>
                      <Box sx={{ color: 'text.secondary' }}>
                        {feature.icon}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">
                          {feature.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                ))}
              </Grid>

              {/* Description */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography color="text.secondary">
                  {product?.description}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Reviews Section */}
      <Box sx={{ mb: 6 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Product Reviews
          </Typography>
          <ReviewsSection />
        </Paper>
      </Box>

      {/* Related Products Section */}
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          You May Also Like
        </Typography>
        <RelatedProductsSection relatedProducts={relatedProducts} />
      </Box>
    </Container>
  );
};

export default ProductDetails;