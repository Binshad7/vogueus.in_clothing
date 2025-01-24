import { createAsyncThunk } from '@reduxjs/toolkit'
import userAxios from '../../../api/userAxios'
import { toast } from 'react-toastify'
const wishlistAddAndRemovemanage = createAsyncThunk(
    "user/wishlistAddAndRemove",
    async (productId, { rejectWithValue }) => { // Fixed typo
        try {
            const response = await userAxios.post(`/product/wislistManage/${productId}`);
            toast.success(response?.data?.message);
            return JSON.parse(response?.data?.wishlistProducts);
        } catch (error) {
            toast.error(error?.response?.data?.message);
            return rejectWithValue(error?.response?.data?.message); // Fixed typo
        }
    }
);

const fetchwishlist = createAsyncThunk(
    "user/fetchwishlist",
    async (_, { rejectWithValue }) => { // Fixed typo
        try {
            const response = await userAxios.get("/product/fetchwishlist");
            return JSON.parse(response?.data?.wishlistProducts);
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message); // Fixed typo
        }
    }
);
const removeProductFromWishlist = createAsyncThunk(
    "user/removeItemFromWishlist",
    async (productId, { rejectWithValue }) => { // Fixed typo
        try {
            const response = await userAxios.delete(`/product/removeitemWislist/${productId}`);
            toast.success(response?.data?.message)
            return JSON.parse(response?.data?.wishlistProducts);
        } catch (error) {
            toast.error(error?.response?.data?.message);
            return rejectWithValue(error?.response?.data?.message); // Fixed typo
        }
    }
);


export {
    wishlistAddAndRemovemanage,
    fetchwishlist,
    removeProductFromWishlist
}