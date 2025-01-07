import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import adminAxios from "../../../api/adminAxios";


const adminLogin = createAsyncThunk(
    'admin/login',
    async (adminData, { rejectWithValue }) => {
        try {
            console.log('admin login hit');
            const response = await adminAxios.post('/login', adminData);
            toast.success('login success fully completed')   
            console.log('admin login success') 
            return response.data.admin
        } catch (error) {
            console.log('login error hit')

            toast.error(error.response?.data?.message || error.message || "An error occurred while logging out.")
            rejectWithValue(error.response?.data || error.message)
        }
    }
)

export {
    adminLogin
}