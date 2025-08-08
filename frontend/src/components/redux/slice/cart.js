import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    cart: []
}


const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem(state, action) {
            state.cart.push(action.payload);
        },
        removeItem(state, action) {
            // payload = itemId
            state.cart = state.cart.filter((item) => item.itemId != action.payload);
        },
        increaseItemQuantity(state, action) {
            //quantity++ kro by getting Id
            const item = state.cart.find(item => item.itemId === action.payload);
            item.quantity++;
            item.totalPrice = item.quantity * item.price;
        },
        decreaseItemQuantity(state, action) {
            const item = state.cart.find(item => item.itemId === action.payload);
            item.quantity--;
            item.totalPrice = item.quantity * item.price;
        },
        clearCart(state) {
            state.cart = [];
        }
    }
})

export const { addItem, removeItem, increaseItemQuantity, decreaseItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const getCart = (state) => state.cart.cart;
export const totalCartItems = (state) => state.cart.cart.reduce((sum, curr) => sum + curr.quantity, 0);
export const totalCartPrice = (state) => state.cart.cart.reduce((sum, curr) => sum + curr.totalPrice, 0);
export const getCurrentQuantityById = (itemId) => (state) => {
    const item = state.cart.cart.find((item) => item.itemId === itemId);
    return item ? item.quantity : 0;
};
