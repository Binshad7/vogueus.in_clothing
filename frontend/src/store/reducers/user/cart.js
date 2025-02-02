import { createSlice } from "@reduxjs/toolkit";
import { addToCart, removeItemFromCart, GetCart, handleQuantityChange } from '../../middlewares/user/cart'
import { userLogout } from '../../middlewares/user/user_auth'
import { createNewOreder } from "../../middlewares/user/orders";
const initialState = {
    loading: false,
    cart: []
}

const handleFulfiled = (state, action) => {
    state.loading = false;
    state.cart = action.payload;
}

const handlePendding = (state) => {
    state.loading = true;
}

const handleRejected = (state) => {
    state.loading = false;
}

const Cart = createSlice({
    name: "userCart",
    initialState,
    extraReducers: (builder) => {
        builder
            // addToCart 
            .addCase(addToCart.pending, handlePendding)
            .addCase(addToCart.fulfilled, handleFulfiled)
            .addCase(addToCart.rejected, handleRejected)
            // product Remove From cart
            .addCase(removeItemFromCart.pending, handlePendding)
            .addCase(removeItemFromCart.fulfilled, handleFulfiled)
            .addCase(removeItemFromCart.rejected, handleRejected)
            // getCartItems
            .addCase(GetCart.pending, handlePendding)
            .addCase(GetCart.fulfilled, handleFulfiled)
            .addCase(GetCart.rejected, handleRejected)
            // getCart quantity
            .addCase(handleQuantityChange.pending, handlePendding)
            .addCase(handleQuantityChange.fulfilled, (state, action) => {
                const updateItemIndex = state.cart.findIndex((item) => item?.itemDetails?.cartItemsId == action.payload._id)
                console.log(updateItemIndex)
                state.cart[updateItemIndex].itemDetails.quantity = action.payload.quantity
                state.loading = false;
            })
            .addCase(handleQuantityChange.rejected, handleRejected)

            // when user logot then clear the Cart
            .addCase(userLogout.fulfilled, (state) => {
                state.cart = []
            })


            // if order is success fully completed then cart is empty

            .addCase(createNewOreder.fulfilled, (state) => {
                state.cart = []
            })

    }
})


export default Cart.reducer