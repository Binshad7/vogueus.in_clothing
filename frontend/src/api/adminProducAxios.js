import axios from "axios";
import { ADMIN_PRODUCT_URL } from "../constant/urls";
const adminProductAxios = axios.create({
    baseURL: ADMIN_PRODUCT_URL,
    withCredentials: true,
    headers: {

        'Content-Type': 'multipart/form-data'

    }
})

export default adminProductAxios;