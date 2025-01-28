import axios from "axios";
import { ADMIN_BASE_URL } from "../constant/urls";
const adminAxios = axios.create({
    baseURL: ADMIN_BASE_URL,
    withCredentials: true
})

export default adminAxios;