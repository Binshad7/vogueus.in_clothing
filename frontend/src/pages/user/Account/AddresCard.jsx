import React, { useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
} from '@mui/material';
import { Phone, Edit, MapPin, Trash2 } from 'lucide-react';

const AddressCard = ({ address, onEdit, onRemove }) => (
  <Paper
    elevation={2}
    sx={{
      p: 3, // Moderate padding
      bgcolor: 'grey.50',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5 }}>
      {address.fullName}
    </Typography>
    
    <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
      <Phone size={20} /> {/* Moderate icon size */}
      <Typography variant="body1">{address.mobileNumber}</Typography>
    </Box>

    <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, flex: 1 }}>
      <MapPin size={20} />
      <Box>
        <Typography variant="body1" sx={{ mb: 0.5 }}>
          {address.address}
        </Typography>
        <Typography variant="body1" sx={{ mb: 0.5 }}>
          {address.cityDistrictTown}, {address.state}, {address.pinCode}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {address.landmark}
        </Typography>
      </Box>
    </Box>

    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
      <Button
        startIcon={<Edit size={18} />}
        size="medium"
        variant="outlined"
        onClick={onEdit}
      >
        Edit
      </Button>
      <Button
        startIcon={<Trash2 size={18} />}
        color="error"
        size="medium"
        variant="outlined"
        onClick={onRemove}
      >
        Remove
      </Button>
    </Box>
  </Paper>
);
export default  AddressCard