import { createSlice } from "@reduxjs/toolkit";
import {
   fetchAllUsers,
   updateUserStatus
} from '../../middlewares/admin/usersAdminHandle'

const initialState = {
    loading: false,
    Allusers: [],
}
const handlePending = (state) => {
    state.loading = true
}
const handleFulfilled = (state, action) => {
    state.loading = false;
    state.Allusers = action.payload
}
const handleReject = (state) => {
    state.loading = false
}


const AllUsersHandle = createSlice({
    name: 'AllUsersHandle',
    initialState,
    extraReducers: (builder) => {
        builder

            // fetch all Product
            .addCase(fetchAllUsers.pending, handlePending)
            .addCase(fetchAllUsers.fulfilled, handleFulfilled)
            .addCase(fetchAllUsers.rejected, handleReject)
            // update user status
            .addCase(updateUserStatus.pending, handlePending)
            .addCase(updateUserStatus.fulfilled, handleFulfilled)
            .addCase(updateUserStatus.rejected, handleReject)

            

    }
})

export default AllUsersHandle.reducer

