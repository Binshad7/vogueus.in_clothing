import React from 'react';
import {
  Box,
  Grid,
  IconButton,
  Stack,
  Divider
} from '@mui/material';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import SectionTitle from '../../../components/user/SectionTitle';
import RelatedProductCard from './RelatedProductCard';

// Main Related Products Section
const RelatedProductsSection = ({ relatedProducts = [] }) => {
  if (relatedProducts.length === 0) return null;

  return (
    <Box sx={{ mt: 8 }}>
      <Divider sx={{ mb: 6 }} />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <SectionTitle title="Related Products" />
        <Stack direction="row" spacing={1}>
          <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
            <ChevronLeft size={20} />
          </IconButton>
          <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
            <ChevronRight size={20} />
          </IconButton>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {relatedProducts.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item._id}>
            <RelatedProductCard
              slug={item._id}
              title={item.productName}
              description={item.description}
              currentPrice={item.currentPrice}
              regularPrice={item.regularPrice}
              thumbnail={item.images[0]}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RelatedProductsSection;