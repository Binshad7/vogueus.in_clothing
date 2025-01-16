import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import adminAxios from "../../../api/adminAxios";


const fetchAllUsers = createAsyncThunk(
    'admin/users/fetchAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await adminAxios.get('/usersHandle/fetchUsers');
            return response.data.users
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
            return rejectWithValue(error.message)
        }
    }

)
const updateUserStatus = createAsyncThunk(
    'admin/users/blockAndUnBlock',
    async (userID, { rejectWithValue }) => {
        try {
            const response = await adminAxios.patch(`/usersHandle/blockAndUnBlock/${userID}`);
            toast.success(response?.data?.message || 'success fully update the user status')
            return response.data.users
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
            return rejectWithValue(error.message)
        }
    }

)

export {
    fetchAllUsers,
    updateUserStatus
}