import axios from "axios";

const adminProductAxios = axios.create({
    baseURL: 'http://localhost:5000/api/v1/admin/product',
    withCredentials: true,
    headers: {

        'Content-Type': 'multipart/form-data'

    }
})

export default adminProductAxios;