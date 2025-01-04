import { createAsyncThunk } from "@reduxjs/toolkit";
import userAxios from "../../../api/userAxios";
import { toast } from "react-toastify";

// user register
const userRegister = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('userData:', userData);
      const response = await userAxios.post('/register', userData);
      toast.success(response.data.message);
      return response.data.user;
    } catch (error) {
      console.log('error:', error.response?.data?.message || error.message || "An error occurred while registering.");

      toast.error(error.response?.data?.message || error.message || "An error occurred while registering.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// user register with google

const userRegisterWihtGoogle = createAsyncThunk(
  'user/google/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('userData:', userData);
      const response = await userAxios.post('/googleSignup', userData);
      toast.success(response.data.message);
      return response.data.user;
    } catch (error) {
      console.log('error:', error.response?.data?.message || error.message || "An error occurred while registering.");

      toast.error(error.response?.data?.message || error.message || "An error occurred while registering.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// login 
const userLogin = createAsyncThunk(
  'user/login',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('login ', userData);
      const response = await userAxios.post('/login', userData);
      toast.success('login success fully completed')
      return response.data.user
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "An error occurred while logging out.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)


// login with google

const userLoginWithGoogle = createAsyncThunk(
  'user/google/login',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('login ', userData);

      const response = await userAxios.post('/googleLogin', userData);
      toast.success('login success fully completed')
      return response.data.user
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "An error occurred while logging out.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)


// loged out 

const userLogout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAxios.get('/logout');
      toast.success(response.data.message);
      return 
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "An error occurred while logging out.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)


// toekn refresh

const tokenRefresh = createAsyncThunk(
  'user/refresh',
  async (_, {rejectWithValue})=>{
    try {
      const response = await userAxios.get('/refresh');
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)


export {
  userRegister,
  userLogin,
  userRegisterWihtGoogle,
  userLoginWithGoogle,
  userLogout,
  tokenRefresh
}