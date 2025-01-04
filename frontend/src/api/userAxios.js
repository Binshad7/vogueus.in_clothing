import axios from 'axios'

const userAxios = axios.create({
    baseURL: 'http://localhost:5000/api/v1/user',
    withCredentials: true
})

export default userAxios;