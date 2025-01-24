import { createSlice } from "@reduxjs/toolkit";
import { wishlistAddAndRemovemanage, fetchwishlist, removeProductFromWishlist } from "../../middlewares/user/wishlist";
import { userLogout } from '../../middlewares/user/user_auth'
const initialState = {
    loading: false,
    wishlistItems: []
}

const handlePendding = (state) => {
    state.loading = true
}
const handleFulfiled = (state, action) => {
    state.loading = false;
    state.wishlistItems = action.payload || [];
}
const handleReject = (state) => {
    state.loading = false
}

const wishlist = createSlice({
    name: "wishListHandle",
    initialState,
    extraReducers: (builder) => {
        builder
            // this like a togle if user click the wishlist button initial add the product to wishlist again click time that remove from the wishlist
            .addCase(wishlistAddAndRemovemanage.pending, handlePendding)
            .addCase(wishlistAddAndRemovemanage.fulfilled, handleFulfiled)
            .addCase(wishlistAddAndRemovemanage.rejected, handleReject)
            // fetch data 
            .addCase(fetchwishlist.pending, handlePendding)
            .addCase(fetchwishlist.fulfilled, handleFulfiled)
            .addCase(fetchwishlist.rejected, handleReject)
            // remove Product from wishlist
            .addCase(removeProductFromWishlist.pending, handlePendding)
            .addCase(removeProductFromWishlist.fulfilled, handleFulfiled)
            .addCase(removeProductFromWishlist.rejected, handleReject)
            // user logout time clear the wishlist
            .addCase(userLogout.fulfilled, (state) => {
                state.wishlistItems = []
            })

    }
})


export default wishlist.reducer