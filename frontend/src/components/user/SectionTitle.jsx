import React from 'react';
import { 
  Box, 
  Typography
} from '@mui/material';
const SectionTitle = ({ title }) => (
  <Box sx={{ mb: 4, mt: 6 }}>
    <Typography 
      variant="h5" 
      component="h2" 
      fontWeight="bold"
      sx={{ 
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          bottom: -8,
          left: 0,
          width: 60,
          height: 3,
          backgroundColor: 'primary.main'
        }
      }}
    >
      {title}
    </Typography>
  </Box>
);
export default  SectionTitle