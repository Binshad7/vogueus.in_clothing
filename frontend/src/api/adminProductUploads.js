import axios from "axios";
import { ADMIN_PRODUCT_URL } from "../constant/urls";
const addProductAxios = axios.create({
    baseURL: ADMIN_PRODUCT_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});
export default addProductAxios;
