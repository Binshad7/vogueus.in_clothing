import React from 'react';
import { 
  Box, 
  Avatar, 
  Typography, 
  Rating, 
  Stack, 
  Divider,
  Button,
  Grid
} from '@mui/material';

// Demo reviews data
const demoReviews = [
  {
    id: 1,
    user: {
      name: 'John Doe',
      avatar: null, // Will use first letter as fallback
    },
    rating: 5,
    date: '2024-01-10',
    comment: 'Great fit and excellent quality! The fabric is breathable and comfortable for all-day wear. Highly recommend this product.',
    helpful: 12
  },
  {
    id: 2,
    user: {
      name: 'Sarah Smith',
      avatar: null,
    },
    rating: 4,
    date: '2024-01-08',
    comment: 'Nice shirt, but the sizing runs a bit large. I would recommend going one size down. Otherwise, the quality is good.',
    helpful: 8
  },
  {
    id: 3,
    user: {
      name: 'Mike Johnson',
      avatar: null,
    },
    rating: 5,
    date: '2024-01-05',
    comment: 'Perfect for both casual and semi-formal occasions. The color is exactly as shown in the pictures.',
    helpful: 15
  }
];

const ReviewsSection = () => {
  return (
    <Box sx={{ mt: 8, width: '100%' }}>
      <Stack spacing={4}>
        {/* Reviews Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack spacing={1}>
            <Typography variant="h6" fontWeight="bold">
              Customer Reviews
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Rating value={4.5} precision={0.5} readOnly />
              <Typography color="text.secondary">
                Based on {demoReviews.length} reviews
              </Typography>
            </Stack>
          </Stack>
          <Button variant="contained">
            Write a Review
          </Button>
        </Stack>

        <Divider />

        {/* Reviews List */}
        <Stack spacing={4}>
          {demoReviews.map((review) => (
            <Box key={review.id}>
              <Grid container spacing={2}>
                <Grid item>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {review.user.name.charAt(0)}
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" fontWeight="medium">
                        {review.user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Stack>
                    <Rating value={review.rating} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary">
                      {review.comment}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Button size="small" sx={{ color: 'text.secondary' }}>
                        Helpful ({review.helpful})
                      </Button>
                      <Button size="small" sx={{ color: 'text.secondary' }}>
                        Report
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
              <Divider sx={{ mt: 3 }} />
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ReviewsSection;