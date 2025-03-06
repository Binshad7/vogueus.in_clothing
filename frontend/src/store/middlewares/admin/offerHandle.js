import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import adminAxios from "../../../api/adminAxios";


const addOffer = createAsyncThunk(
    'admin/addOffer',
    async (offer, { rejectWithValue }) => {
        try {
            const resposne = await adminAxios.post('/offer/addOffer', { ...offer });
            toast.success(resposne?.data?.message);
            return resposne?.data?.offer
        } catch (error) {
            toast.error(error?.resposne?.data?.message)
            rejectWithValue()
        }
    }
);
const getAllOffers = createAsyncThunk(
    'admin/getAllOffers',
    async (_, { rejectWithValue }) => {
        try {
            const resposne = await adminAxios.get('/offer/getAllOffers');
            return resposne?.data
        } catch (error) {
            // toast.error(error?.resposne?.data?.message)
            rejectWithValue()
        }
    }
);
const deleteOffer = createAsyncThunk(
    'admin/deleteOffer',
    async (deleteItem, { rejectWithValue }) => {
        try {
            const resposne = await adminAxios.delete(`/offer/deleteOffer`, { data: deleteItem });
            toast.success(resposne?.data?.message);
            return resposne?.data
        } catch (error) {
            toast.error(error?.response?.data?.message)
            rejectWithValue()
        }
    }
);


export {
    addOffer,
    getAllOffers,
    deleteOffer,

}