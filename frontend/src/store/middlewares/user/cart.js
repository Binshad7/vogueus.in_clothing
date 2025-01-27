import { createAsyncThunk } from "@reduxjs/toolkit";
import userAxios from "../../../api/userAxios";
import { toast } from "react-toastify";

const addToCart = createAsyncThunk(
    'user/addToCart',
    async (productDetails, { rejectWithValue }) => {
        try {
            const response = await userAxios.post(`/product/addToCart`, { productDetails });
            toast.success(response.data.message)
            return JSON.parse(response.data.CartItems);
        } catch (error) {
            toast.error(error?.response?.data?.message)
            return rejectWithValue(error.response?.data || error.message)
        }
    }
);

const removeItemFromCart = createAsyncThunk(
    'user/removeItemFromCart',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await userAxios.delete(`/product/removeItemCart/${productId}`);
            toast.success(response.data.message)
            return JSON.parse(response.data.CartItems);
        } catch (error) {
            toast.error(error?.response?.data?.message)
            return rejectWithValue(error.response?.data || error.message)
        }
    }
);
const GetCart = createAsyncThunk(
    'user/GetCartItems',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userAxios.get('/product/getCartItems');
            return JSON.parse(response.data.CartItems);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.messalge)
        }
    }
);
const handleQuantityChange = createAsyncThunk(
    'user/cartQuantityChange',
    async (updatingData, { rejectWithValue }) => {
        try {
            console.log('updating the cart', updatingData)
            const response = await userAxios.patch(`/product/cartitemQuantityHandle/${updatingData.cartId}`, { operation: updatingData.operation, quantity: updatingData.quantity });
            toast.success(response.data.message);
            return response.data.updatedCart
        } catch (error) {
            toast.error(error?.response?.data?.message)
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export {
    addToCart,
    removeItemFromCart,
    GetCart,
    handleQuantityChange
}