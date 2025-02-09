import axios from 'axios'
import { USER_BASE_URL } from '../constant/urls'
const userAxios = axios.create({
    baseURL: USER_BASE_URL,
    withCredentials: true
})

export default userAxios;