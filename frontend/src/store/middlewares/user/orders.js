import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import userAxios from "../../../api/userAxios";

const createNewOreder = createAsyncThunk(
    'user/creteOrder',
    async (orderDetails, { rejectWithValue }) => {
        try {
            const response = await userAxios.post(`/neworder/${orderDetails.userId}`, { paymentMethod: orderDetails.paymentMethod, selectedAddressIndex: orderDetails.addressIndex });
            toast.success(response?.data?.message);
            return JSON.parse(response.data.orderItems);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
            return rejectWithValue(error?.response?.data?.message)
        }
    }
);

const getOrderItems = createAsyncThunk(
    'user/fetchOrderItems',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await userAxios.get(`/orders/${userId}`);
            return JSON.parse(response.data.orderItems);
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)

export {
    createNewOreder,
    getOrderItems
}