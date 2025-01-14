
import axios from "axios";



const addProductAxios = axios.create({
    baseURL: 'http://localhost:5000/api/v1/admin',
    withCredentials:true,
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});
export default addProductAxios;
