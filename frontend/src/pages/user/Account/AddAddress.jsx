import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper
} from '@mui/material';
import { X } from 'lucide-react';

const AddAddress = ({ onCancel }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      fullName: formData.get('fullName'),
      mobileNumber: formData.get('mobileNumber'),
      pinCode: formData.get('pinCode'),
      country: formData.get('country'),
      address: formData.get('address'),
      cityDistrictTown: formData.get('cityDistrictTown'),
      state: formData.get('state'),
      landmark: formData.get('landmark'),
    };
    console.log(data); // Replace with your submit handler
  };


  return (
    <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Add New Address</Typography>
        <Button 
          startIcon={<X size={18} />}
          onClick={onCancel}
          color="inherit"
        >
          Cancel
        </Button>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              name="fullName"
              label="Full Name"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              name="mobileNumber"
              label="Mobile Number"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              name="pinCode"
              label="PIN Code"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              name="country"
              label="Country"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="address"
              label="Address"
              variant="outlined"
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              name="cityDistrictTown"
              label="City/District/Town"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              name="state"
              label="State"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              name="landmark"
              label="Landmark (Optional)"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
              >
                Save Address
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AddAddress;