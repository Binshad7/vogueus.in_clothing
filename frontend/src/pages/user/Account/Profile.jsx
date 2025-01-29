import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import { User, Mail, Edit, Plus, } from 'lucide-react';
import AddressCard from './AddresCard';
import AddAddress from './AddAddress';
import { useSelector } from 'react-redux'
import EditProfile from './modal/EditProfile';
import Spinner from '../../../components/user/Spinner';
const Profile = () => {
  const [addingAddress, setAddingAddress] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const { user, loading } = useSelector((state) => state.user);


  const onCancelAddAddress = () => {
    setAddingAddress(false)
  }
  const handleEditProfileOpen = () => {
    setEditProfile(true);
    setAddingAddress(false)
  }
  const handleEditProfileCancel = () => {
    setEditProfile(false);
  }

 
  if (loading) {
    return <Spinner />
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ fontSize: '2.5rem' }}> {/* Larger profile title */}
          My Info
        </Typography>
        {
          editProfile && <EditProfile
            userName={user.userName}
            userEmail={user.email}
            userId={user._id}
            modalIsOpen={editProfile}
            closeModal={handleEditProfileCancel}
          />

        }
        
        {!addingAddress ? (
          <Box>
            {/* Contact Details Section */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Contact Details</Typography>
                <Button
                  startIcon={<Edit size={16} />}
                  variant="outlined"
                  onClick={handleEditProfileOpen}
                >
                  Edit
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <User size={20} />
                    <Box>
                      <Typography color="text.secondary" variant="subtitle2">
                        Full Name
                      </Typography>
                      <Typography>
                        {user?.userName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <Mail size={20} />
                    <Box>
                      <Typography color="text.secondary" variant="subtitle2">
                        Email
                      </Typography>
                      <Typography>{user?.email}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Divider sx={{ my: 4 }} />

            {/* Address Section */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Address</Typography>
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={() => setAddingAddress(true)}
                >
                  Add New
                </Button>
              </Box>

              {user?.address?.length === 0 ? (
                <Typography textAlign="center" color="text.secondary" sx={{ py: 4 }}>
                  No addresses added yet
                </Typography>
              ) : (
                <Grid container spacing={3}>
                  {user?.address?.map((address, index) => (
                    <Grid item xs={12} sm={6} md={6} key={index}> 
                      <AddressCard
                        address={address}
                        userId={user._id}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Box>
        ) : (
          <Box>

            <AddAddress onCancel={onCancelAddAddress} />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Profile;