import { createAsyncThunk } from "@reduxjs/toolkit";
import addProductAxios from "../../../api/adminProductUploads";
import { toast } from "react-toastify";

const AddProduct = createAsyncThunk(
    'admin/addProduct',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await addProductAxios.post('/product/addProduct', formData);
            toast.success(response?.data?.message || 'Product Success Fully Added')
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            return rejectWithValue()
        }
    }
)


const EditProduct = createAsyncThunk(
    'admin/EditProduct',
    async (product, { rejectWithValue }) => {
        try {

        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            return rejectWithValue()
        }
    }
)


const unlistProduct = createAsyncThunk(
    'admin/unlistProduct',
    async (_, { rejectWithValue }) => {
        try {

        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            return rejectWithValue()
        }
    }
)


const fetchProduct = createAsyncThunk(
    'admin/fetchProduct',
    async (_, { rejectWithValue }) => {
        try {


        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            return rejectWithValue()
        }
    }
)


export {
    AddProduct,
    EditProduct,
    unlistProduct,
    fetchProduct
}