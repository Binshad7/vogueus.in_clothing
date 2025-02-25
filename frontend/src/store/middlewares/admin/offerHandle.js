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
const editOffer = createAsyncThunk(
    'admin/editOffer',
    async ({ ...offer }, { rejectWithValue }) => {
        try {
            const resposne = await adminAxios.patch('/offer/editOffer', { ...offer });
            toast.success(resposne?.data?.message);
            return resposne?.data?.offer
        } catch (error) {
            toast.error(error?.resposne?.data?.message)
            rejectWithValue()
        }
    }
);


export {
    addOffer,
    editOffer
}