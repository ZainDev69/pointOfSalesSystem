import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth";
import userReducer from "./slice/users";
import productReducer from "./slice/product";
import cartReducer from "./slice/cart";
import salesReducer from "./slice/sales";

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        product: productReducer,
        cart: cartReducer,
        sales: salesReducer
    }
})


export default store;