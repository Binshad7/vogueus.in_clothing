import { createAsyncThunk } from "@reduxjs/toolkit";
import userAxios from "../../../api/userAxios";
import { toast } from "react-toastify";

const addewAddress = createAsyncThunk(
    'user/addewAddress',
    async (address) => {
        try {
            const response = await userAxios.post(`/addNewAddress/${address.userId}`, { address:address.address });
            toast.success(response.data.message);
            return response.data.user
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }
)
const updateAddress = createAsyncThunk(
    'user/updateAddress',
    async (updatedAddress) => {
        try {
            const response = await userAxios.patch(`/updateAddress/${updateAddress.userID}`, { updatedAddress });
            toast.success(response.data.message);
            return response.data.user
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }
)
const deleteAddress = createAsyncThunk(
    'user/deleteAddress',
    async (deleteDetails) => {
        try {
            const response = await userAxios.post(`/addNewAddress/${deleteDetails.userID}`, { index });
            toast.success(response.data.message);
            return response.data.user
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }
)

export {
    addewAddress,
    updateAddress,
    deleteAddress
}