import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import adminAxios from "../../../api/adminAxios";

const getAllCoupons = createAsyncThunk(
    'admin/getAllCoupons',
    async (_, { rejectwithValue }) => {
        try {
            const response = await adminAxios.get('/coupon/getAllCoupons')
            return response.data.coupon
        } catch (error) {
            toast.error(error?.response?.data?.message)
            rejectwithValue()
        }
    }
)
const addCoupon = createAsyncThunk(
    'admin/addCoupon',
    async (couponData, { rejectwithValue }) => {
        try {
            const response = await adminAxios.post('/coupon/addCoupon', { ...couponData })
            console.log(response.data.coupon);

            toast.success(response?.data?.message)
            return response.data.coupon
        } catch (error) {
            toast.error(error?.response?.data?.message)
            rejectwithValue()
        }
    }
)
const updateBlockStatus = createAsyncThunk(
    'admin/updateBlockStatus',
    async (couponId, { rejectwithValue }) => {
        try {
            const response = await adminAxios.patch(`/coupon/updateStatus/${couponId}`)
            toast.success(response?.data?.message)
            return response.data.coupon
        } catch (error) {
            toast.error(error?.response?.data?.message)
            rejectwithValue()
        }
    }
)
const editCoupon = createAsyncThunk(
    'admin/editCoupon',
    async ({ editingCoupon, couponId }, { rejectwithValue }) => {
        try {
            const response = await adminAxios.patch(`/coupon/editCoupon/${couponId}`, { ...editingCoupon })
            toast.success(response?.data?.message)
            return response.data.coupon
        } catch (error) {
            toast.error(error?.response?.data?.message)
            rejectwithValue()
        }
    }
)

const deleteCoupon = createAsyncThunk(
    'admin/deleteCoupon',
    async (couponId, { rejectwithValue }) => {
        try {
            const response = await adminAxios.delete(`/coupon/deleteCoupon/${couponId}`)
            toast.success(response?.data?.message)
            return response.data.couponId
        } catch (error) {
            toast.error(error?.response?.data?.message)
            rejectwithValue()
        }
    }
)   

export {
    addCoupon,
    updateBlockStatus,
    editCoupon,
    getAllCoupons,
    deleteCoupon
}