import { createSlice } from "@reduxjs/toolkit";
import {
    userRegister,
    userLogin,
    userRegisterWihtGoogle,
    userLoginWithGoogle,
    userLogout,
    tokenRefresh
} from "../../middlewares/user/user_auth";
import { updateUserProfile } from "../../middlewares/user/user_updates";
import { addewAddress, deleteAddress, editAddress } from '../../middlewares/user/address'
// Initial state
const initialState = {
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
    user: localStorage.getItem('user') && localStorage.getItem('user') !== 'undefined'
        ? JSON.parse(localStorage.getItem('user'))
        : null,
    loading: false,
};

const handlePending = (state) => {
    state.loading = true;
};


const handleAuthSuccess = (state, action) => {
    state.loading = false;
    state.user = action.payload;
    state.isAuthenticated = true;
    localStorage.setItem('user', JSON.stringify(action.payload));
    localStorage.setItem('isAuthenticated', 'true');
};

const handleRejection = (state) => {
    state.loading = false;
    state.user = null;
    state.isAuthenticated = false;
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
};

const userUpdatesSuccess = (state, action) => {
    state.loading = false;
    state.user = action.payload;
    localStorage.setItem('user', JSON.stringify(action.payload));
}
const deleteAddressSuccess = (state, action) => {
    state.loading = false;
    state.user.address = action.payload
}
const userUpdatesRejeted = (state) => {
    state.loading = false
}

const userAddressUpdatesSuccess = (state, action) => {

    if (state.user?.address) {
        const updateAddressIndex = state.user.address.findIndex((item) => item._id === action.payload._id);
        console.log(updateAddressIndex)
        if (updateAddressIndex !== -1) {
            state.user.address[updateAddressIndex] = action.payload;
        }
    }
    state.loading = false;
    localStorage.setItem('user', JSON.stringify(state.user));
}

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
            .addCase(userLogout.rejected, userUpdatesRejeted)

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
            .addCase(updateUserProfile.fulfilled, userUpdatesSuccess)
            .addCase(updateUserProfile.rejected, userUpdatesRejeted)


            // addNew address
            .addCase(addewAddress.pending, handlePending)
            .addCase(addewAddress.fulfilled, userUpdatesSuccess)
            .addCase(addewAddress.rejected, userUpdatesRejeted)

            //delete Address

            .addCase(deleteAddress.pending, handlePending)
            .addCase(deleteAddress.fulfilled, deleteAddressSuccess)
            .addCase(deleteAddress.rejected, userUpdatesRejeted)

            // editAddress
            .addCase(editAddress.pending, handlePending)
            .addCase(editAddress.fulfilled, userAddressUpdatesSuccess)
            .addCase(editAddress.rejected, userUpdatesRejeted)
    },
});

export const { clearUser, demoStore, clearDemoUser } = userSlice.actions;
export default userSlice.reducer;
