import { createAsyncThunk } from "@reduxjs/toolkit";
import userAxios from "../../../api/userAxios";
import { toast } from "react-toastify";

const fetchAllProducts = createAsyncThunk(
    'user/products',
    async (_, { rejectWithValue }) => {
            console.log('hit the fetchallProducts')
        try {
            const response = await userAxios.get('/product/fetchAllProducts');
            return response.data.products;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export {
    fetchAllProducts
}