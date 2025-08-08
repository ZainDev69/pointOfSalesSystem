import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const storedUser = JSON.parse(localStorage.getItem("user")) || null;


export const loginUser = createAsyncThunk(
    "auth/signInUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, { email, password }, { withCredentials: true });
            return response.data.data.user;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const signup = createAsyncThunk(
    "auth/signup",
    async ({ firstName, lastName, email, password, passwordConfirm }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/signup`, { firstName, lastName, email, password, passwordConfirm }, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Signup Failed");
        }
    }
)


export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/logout`, { withCredentials: true });
            return response.data.message;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);





const initialState = {
    user: storedUser,
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                localStorage.setItem("user", JSON.stringify(action.payload));
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.user = action.payload.data.user;
                localStorage.setItem("user", JSON.stringify(action.payload.data.user));
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                localStorage.removeItem("user");
            });
    },
})


export const getCurrentUser = (state) => state.auth.user;

export default authSlice.reducer;