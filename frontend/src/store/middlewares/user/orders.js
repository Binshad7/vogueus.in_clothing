import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import userAxios from "../../../api/userAxios";

const createNewOreder = createAsyncThunk(
    'user/creteOrder',
    async (orderDetails, { rejectWithValue }) => {
        try {
            const response = await userAxios.post(`/neworder/${orderDetails.userId}`, { paymentMethod: orderDetails.paymentMethod, selectedAddressIndex: orderDetails.addressIndex });
            toast.success(response?.data?.message);
            return JSON.stringify(response.data.orders);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
            return rejectWithValue(error?.response?.data?.message)
        }
    }
)

export {
    createNewOreder
}