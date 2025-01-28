import { createSlice } from "@reduxjs/toolkit";
import {
    userRegister,
    userLogin,
    userRegisterWihtGoogle,
    userLoginWithGoogle,
    userLogout,
    tokenRefresh,
} from "../../middlewares/user/user_auth";
import { updateUserProfile } from "../../middlewares/user/user_updates";

// Initial state
const initialState = {
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
    user: localStorage.getItem('user') && localStorage.getItem('user') !== 'undefined'
        ? JSON.parse(localStorage.getItem('user'))
        : null,
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
    localStorage.setItem('isAuthenticated', 'true');
};

// Helper function to handle rejection
const handleRejection = (state) => {
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
        clearDemoUser: () => {
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

            // Refresh token
            .addCase(tokenRefresh.pending, handlePending)
            .addCase(tokenRefresh.fulfilled, handleAuthSuccess)
            .addCase(tokenRefresh.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem('user');
                localStorage.removeItem('isAuthenticated');
            })

            // Update user profile
            .addCase(updateUserProfile.pending, handlePending)
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(updateUserProfile.rejected, (state) => {
                state.loading = false
            })
    },
});

export const { clearUser, demoStore, clearDemoUser } = userSlice.actions;
export default userSlice.reducer;
