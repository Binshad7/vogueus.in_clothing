import { createAsyncThunk } from "@reduxjs/toolkit";
import userAxios from "../../../api/userAxios";

const getWallete = createAsyncThunk(
    'user/wallete',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await userAxios.get(`/wallete/${userId}`);
            return response.data.userWallet
        } catch (error) {
            return rejectWithValue()
        }
    }
)

export {
    getWallete
}