import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import adminAxios from "../../../api/adminAxios";


const adminLogin = createAsyncThunk(
    'admin/login',
    async (adminData, { rejectWithValue }) => {
        try {
            console.log('admin login hit');
            console.log(adminData);
            const response = await adminAxios.post('/login', adminData);
            toast.success('login success fully completed')
            console.log("login success fully completed")
            return response.data.admin
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "An error occurred while logging out.")
            rejectWithValue(error.response?.data || error.message)
        }
    }
)

export {
    adminLogin
}