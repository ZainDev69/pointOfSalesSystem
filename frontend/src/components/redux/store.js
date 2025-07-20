import { configureStore } from "@reduxjs/toolkit";
import clientReducer from "./slice/clients";
import contactReducer from "./slice/contacts";
import carePlansReducer from "./slice/carePlans";
import outcomesReducer from "./slice/outcomes";

const store = configureStore({
    reducer: {
        client: clientReducer,
        contacts: contactReducer,
        carePlans: carePlansReducer,
        outcomes: outcomesReducer
    }
})


export default store;