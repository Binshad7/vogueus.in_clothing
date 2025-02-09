import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import userAxios from "../../../api/userAxios";



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

const cancelOrder = createAsyncThunk(
    'user/cancelOrder',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await userAxios.patch(`/orders/cancellOrder/${userId}`);
            toast.success(response.data.message);
            return JSON.parse(response.data.orderItems);
        } catch (error) {
            toast.error(error.response.data.message);
            return rejectWithValue(error.response.data.message);
        }
    }
)
const cancelOrderItem = createAsyncThunk(
    'user/cancelOrderItem',
    async ({ orderId, itemId }, { rejectWithValue }) => {
        try {
            const response = await userAxios.patch(`/orders/cancellItem/${orderId}/${itemId}`);
            toast.success(response.data.message);
            return JSON.parse(response.data.orderItems);
        } catch (error) {
            toast.error(error.response.data.message);
            return rejectWithValue(error.response.data.message);
        }
    }
);

const returnOrderItem = createAsyncThunk(
    'user/returnOrderItem',
    async ({ orderId, updateDetails }, { rejectWithValue }) => {
        try {
            const response = await userAxios.patch(`/orders/returnOrderItem/${orderId}`, { ...updateDetails });
            toast.success(response.data.message);
            return JSON.parse(response.data.orderItems);
        } catch (error) {
            toast.error(error.response.data.message);
            return rejectWithValue(error.response.data.message);
        }
    }
);
const returnOrder = createAsyncThunk(
    'user/returnOrder',
    async ({ orderId, returnMessage }, { rejectWithValue }) => {
        try {
            const response = await userAxios.patch(`/orders/returnOrder/${orderId}`, { returnMessage });
            toast.success(response.data.message);
            return JSON.parse(response.data.orderItems);
        } catch (error) {
            toast.error(error.response.data.message);
            return rejectWithValue(error.response.data.message);
        }
    }
);



export {
    getOrderItems,
    cancelOrder,
    cancelOrderItem,
    returnOrderItem,
    returnOrder
}