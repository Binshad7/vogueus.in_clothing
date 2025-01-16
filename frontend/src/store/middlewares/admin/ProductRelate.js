import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import adminProductAxios from "../../../api/adminProducAxios";


const addProdcut = createAsyncThunk(
    'admin/addProduct',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await adminProductAxios.post('/addProduct', formData);
            toast.success('Product successfully added')
            return response.data.products
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
            return rejectWithValue(error.message)
        }
    }
)

const fetchProduct = createAsyncThunk(
    'admin/fetchProduct',
    async (_, { rejectWithValue }) => {
        try {

            const response = await adminProductAxios.get('/fetchProduct')
            return response.data.product
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            return rejectWithValue()
        }
    }
)

const blockAndUnBlock = createAsyncThunk(
    'admin/blockAndUnBlock',
    async (proID, { rejectWithValue }) => {
        try {
          
            const response = await adminProductAxios.patch(`/updateProductStatus/${proID}`);
            toast.success(response.data.message || 'Product Status Changed');
            return response.data.product
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


export {
    addProdcut,
    fetchProduct,
    EditProduct,
    blockAndUnBlock,
}