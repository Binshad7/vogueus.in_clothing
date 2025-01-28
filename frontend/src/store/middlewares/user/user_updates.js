import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import userAxios from "../../../api/userAxios";


const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async (userData) => {
        try {
            const response = await userAxios.patch(`/user/upddateProfile/${userData.userId}`, { userName: userData.name, email: userData.userEmail});
            console.log('success',response.data.user)
            toast.success(response?.data?.message);
            return response?.data?.user
        } catch (error) {
            console.log('errror')
            toast.error(error?.response?.data?.message);
        }
    }
)

export {
    updateUserProfile
}