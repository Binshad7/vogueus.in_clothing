import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import adminAxios from "../../../api/adminAxios";


const getAllOrders = createAsyncThunk(
    "admin/getAllOrders",
    async ({ page = 1, limit = 10, search = '', status = '' }, { rejectWithValue }) => {
        try {
            const response = await adminAxios.get(`/orders/getallorders`, {
                params: { page, limit, search, status }
            });
            return {
                orders: JSON.parse(response.data.orders),
                totalPages: response.data.totalPages,
                totalOrders: response.data.totalOrders,
                currentPage: response.data.currentPage
            };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch orders");
            return rejectWithValue(error.response?.data);
        }
    }
);

const updateOrderItemStatus = createAsyncThunk(
    "admin/updateOrderItemStatus",
    async ({ orderId, itemId, newStatus }, { rejectWithValue }) => {
        try {
            const response = await adminAxios.patch(`/orders/updateOrderStatus/${orderId}/${itemId}`, { newStatus });
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch orders");
            return rejectWithValue(error.response?.data);
        }
    }
);

const updateOrderStatus = createAsyncThunk(
    "admin/updateOrderStatus",
    async ({ orderId, orderStatus }, { rejectWithValue }) => {
        try {
            const response = await adminAxios.patch(`/orders/updateOrderStatus/${orderId}`, { orderStatus });
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch orders");
            return rejectWithValue(error.response?.data);
        }
    }
);
const itemStatusReturn = createAsyncThunk(
    "admin/orderStatusReturn",
    async ({ orderId, itemId,returnStatus }, { rejectWithValue }) => {
        try {
            const response = await adminAxios.patch(`/orders/itemReturnStatus/${orderId}/${itemId}`, { returnStatus });
            toast.success(response.data.message)
            console.log(response.data.order)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch orders");
            return rejectWithValue(error.response?.data);
        }
    }
);



export {
    getAllOrders,
    updateOrderItemStatus,
    updateOrderStatus,
    itemStatusReturn
}