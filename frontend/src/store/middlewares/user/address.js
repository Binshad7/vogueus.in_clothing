import { createAsyncThunk } from "@reduxjs/toolkit";
import userAxios from "../../../api/userAxios";
import { toast } from "react-toastify";

const addewAddress = createAsyncThunk(
    'user/addewAddress',
    async (address, { rejectWithValue }) => {
        try {
            const response = await userAxios.post(`/addNewAddress/${address.userId}`, { address: address.address });
            toast.success(response.data.message);
            return JSON.parse(response.data.user)
        } catch (error) {
            toast.error(error?.response?.data?.message);
            rejectWithValue(error.message.data.message)
        }
    }
)

const deleteAddress = createAsyncThunk(
    'user/deleteAddress',
    async (deleteDetails, { rejectWithValue }) => {
        try {
            const response = await userAxios.delete(`/deleteAddress/${deleteDetails.deleteAddressId}`);
            toast.success(response.data.message);
            return JSON.parse(response.data.address)
        } catch (error) {
            toast.error(error?.response?.data?.message);
            rejectWithValue(error.message.data.message);
        }
    }
)

const editAddress = createAsyncThunk(
    'user/editAddress',
    async (updatedAddress) => {
        try {
            const response = await userAxios.patch(`/editAddress/${updatedAddress.editAddressId}`, { address: updatedAddress.address });
            toast.success(response.data.message);
            return JSON.parse(response.data.updatedAddress)
        } catch (error) {
            toast.error(error?.response?.data?.message);
            rejectWithValue(error.message.data.message);
        }
    }
)
export {
    addewAddress,
    editAddress,
    deleteAddress
}