import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import adminAxios from "../../../api/adminAxios";


const adminLogin = createAsyncThunk(
    'admin/login',
    async (adminData, { rejectWithValue }) => {
        try {
            const response = await adminAxios.post('/login', adminData);
            toast.success('login success fully completed')
            return response.data.admin
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "An error occurred while logging out.")
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)


const adminRefresh = createAsyncThunk(
    'admin/refresh',
    async (_, { rejectWithValue }) => {
        try {
            const response = await adminAxios.get('/refresh')
            return response.data.admin
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)

        }
    }
)

const adminLogout = createAsyncThunk(
    'admin/adminLogout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await adminAxios.post('/logout');
            toast.success(response?.data?.message);
            return
        } catch (error) {
            toast.success(error?.response?.data?.message);
            return rejectWithValue(error.response?.data || error.message)

        }
    }
)

export {
    adminLogin,
    adminRefresh,
    adminLogout
}