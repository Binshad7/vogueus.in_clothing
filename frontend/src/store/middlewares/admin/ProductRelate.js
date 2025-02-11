import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import adminProductAxios from "../../../api/adminProducAxios";
import adminAxios from "../../../api/adminAxios";


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


const updateProduct = createAsyncThunk(
    'admin/updateProduct',
    async (product, { rejectWithValue }) => {
        try {
            console.log(product)
            const response = await adminProductAxios.patch(`/updateProduct/${product.id}`, product.formData);
            toast.success(response.data.message || 'Product Updated');
            return response.data.product
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            return rejectWithValue()
        }
    }
)

const updateStocks = createAsyncThunk(
    'admin/updateStocks',
    async ({productId,variants},{rejectWithValue}) => {
        try{
            
            const response = await adminAxios.put(`/product/variantsupdate/${productId}`,{variants})
            toast.success(response?.data?.message);
            return response.data.product
        }catch(error){
            toast.error(error?.response.data?.message || error.message)
            return rejectWithValue()
        }
    }
)

export {
    addProdcut,
    fetchProduct,
    blockAndUnBlock,
    updateProduct,
    updateStocks
}