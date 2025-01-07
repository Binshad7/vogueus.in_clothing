import { createSlice } from "@reduxjs/toolkit";
import {
    userRegister,
    userLogin,
    userRegisterWihtGoogle,
    userLoginWithGoogle,
    userLogout,
    tokenRefresh,
} from "../../middlewares/user/user_auth";

const initialState = {
    isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated')) || false,
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
};

// Helper function to handle pending state
const handlePending = (state) => {
    state.loading = true;
};

// Helper function to handle auth success
const handleAuthSuccess = (state, action) => {
    state.loading = false;
    state.user = action.payload;
    state.isAuthenticated = true;
    localStorage.setItem('user', JSON.stringify(action.payload));
    localStorage.setItem('isAuthenticated', 'true');  // No need to JSON.stringify boolean
};

// Helper function to handle rejection
const handleRejection = (state, action) => {
    state.loading = false;
    state.user = null;
    state.isAuthenticated = false;
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
};

const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
        },
        demoStore: (state, action) => {
            localStorage.setItem('demouser', JSON.stringify(action.payload));
            state.user = action.payload;
        },
        clearDemoUser: (state) => {
            state.user = null;
            localStorage.removeItem('demouser');
        }
    },
    extraReducers: (builder) => {
        // User Register
        builder
            .addCase(userRegister.pending, handlePending)
            .addCase(userRegister.fulfilled, handleAuthSuccess)
            .addCase(userRegister.rejected, handleRejection)

            // User Login
            .addCase(userLogin.pending, handlePending)
            .addCase(userLogin.fulfilled, handleAuthSuccess)
            .addCase(userLogin.rejected, handleRejection)

            // Google Register
            .addCase(userRegisterWihtGoogle.pending, handlePending)
            .addCase(userRegisterWihtGoogle.fulfilled, handleAuthSuccess)
            .addCase(userRegisterWihtGoogle.rejected, handleRejection)

            // Google Login
            .addCase(userLoginWithGoogle.pending, handlePending)
            .addCase(userLoginWithGoogle.fulfilled, handleAuthSuccess)
            .addCase(userLoginWithGoogle.rejected, handleRejection)

            // Logout
            .addCase(userLogout.pending, handlePending)
            .addCase(userLogout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem('user');
                localStorage.removeItem('isAuthenticated');
            })
            .addCase(userLogout.rejected, (state) => {
                state.loading = false;
            })


            // referesh token 
            .addCase(tokenRefresh.pending, handlePending)
            .addCase(tokenRefresh.fulfilled, handleAuthSuccess)
            .addCase(tokenRefresh.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem('user');
                localStorage.removeItem('isAuthenticated');
            })



    },
});

export const { clearUser, demoStore, clearDemoUser } = userSlice.actions;
export default userSlice.reducer;