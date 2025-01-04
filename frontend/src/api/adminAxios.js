import axios from "axios";

const adminAxios = axios.create({
    baseURL: 'http://localhost:5000/api/v1/admin',
    withCredentials: true
})

export default adminAxios;