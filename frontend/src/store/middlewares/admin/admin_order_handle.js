import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import adminAxios from "../../../api/adminAxios";


 const getAllOrders = createAsyncThunk(
    "admin/getAllOrders",
    async ({ page, limit, search = "", status = "" }, { rejectWithValue }) => {
        try {
            const response = await adminAxios.get(`/orders/getallorders`, {
                params: { page, limit, search, status }
            });
            return response.data.orders; // Ensure backend sends paginated results
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch orders");
            return rejectWithValue(error.response?.data);
        }
    }
);

export {
    getAllOrders
}