import { configureStore } from "@reduxjs/toolkit";
import clientReducer from "./slice/clients";
import contactReducer from "./slice/contacts";

const store = configureStore({
    reducer: {
        client: clientReducer,
        contacts: contactReducer
    }
})


export default store;