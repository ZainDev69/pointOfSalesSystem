import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const getSales = createAsyncThunk(
    "sales/getSales",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/sales`, { withCredentials: true });
            return res.data.data;

        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)



const initialState = {
    sales: [],
    loading: false,
    error: null
}


const salesSlice = createSlice({
    name: "sales",
    initialState,
    extraReducers: (builder) => {

        builder.addCase(getSales.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(getSales.fulfilled, (state, action) => {
            state.loading = false;
            state.sales = action.payload;
        }).addCase(getSales.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }

})




export default salesSlice.reducer;

