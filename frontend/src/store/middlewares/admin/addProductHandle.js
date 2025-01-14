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

export {
    addProdcut 
}