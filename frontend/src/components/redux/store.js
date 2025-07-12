import { configureStore } from "@reduxjs/toolkit";
import clientReducer from "./slice/clients";

const store = configureStore({
    reducer: {
        client: clientReducer
    }
})


export default store;