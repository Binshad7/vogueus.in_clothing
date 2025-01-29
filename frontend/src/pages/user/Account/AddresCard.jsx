import React, { useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
} from '@mui/material';
import { Phone, Edit, MapPin, Trash2 } from 'lucide-react';
import DeleteModalAddress from './modal/DeleteModalAddress';
import { deleteAddress } from '../../../store/middlewares/user/address';
import { useDispatch } from 'react-redux';
import EditAddress from './EditAddress';
const AddressCard = ({ address, userId }) => {
  const [deleteAddressModal, setDeleteAddressModal] = useState(false)
  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null)
  const [deleteAddressId, setDeleteAddressId] = useState(null)
  const dispatch = useDispatch()
  // delete modal
  const handleDeleteModalCancel = () => {
    setDeleteAddressModal(false)
    setDeleteAddressId(null)
  }
  const handleDeleteModalOpen = (addressId) => {
    setDeleteAddressModal(true)
    console.log(addressId)
    setDeleteAddressId(addressId)
  }
  const handleDeleteModalConfirm = () => {
    dispatch(deleteAddress({ deleteAddressId, userId }));
    setDeleteAddressId(null)
    setDeleteAddressModal(false)
  }

  // editAddress
  const handleEditAddressOpen = (editAddress) => {
    setEditAddressOpen(true);
    setEditAddress(editAddress);
  }
  const handleEditAddressCancel = () => {
    setEditAddressOpen(false);
    setEditAddress(null);
  }
  if (editAddressOpen) {

    return < EditAddress
      editUserAddress={editAddress}
      closeModal={handleEditAddressCancel}
    />
  }
  return (

    <>
      {
        deleteAddressModal && <DeleteModalAddress
          modalIsOpen={deleteAddressModal}
          closeModal={handleDeleteModalCancel}
          handleDeleteModalConfirm={handleDeleteModalConfirm}
        />
      }

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
            onClick={() => handleEditAddressOpen(address)}
          >
            Edit
          </Button>
          <Button
            startIcon={<Trash2 size={18} />}
            color="error"
            size="medium"
            variant="outlined"
            onClick={() => handleDeleteModalOpen(address._id)}
          >
            Remove
          </Button>
        </Box>
      </Paper>

    </>
  )
}
export default AddressCard