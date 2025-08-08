import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



export const userList = createAsyncThunk(
    "users/getUsers",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, { withCredentials: true });
            return res.data.data;

        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const deleteUser = createAsyncThunk(
    "users/deleteUser",
    async (userId, { rejectWithValue }) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/users/${userId}`, { withCredentials: true });
            return userId;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)


export const updateUser = createAsyncThunk(
    "users/updateUser",
    async ({ id, userData }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/users/${id}`, userData, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)


const initialState = {
    users: [],
    loading: false,
    error: null
}

const userSlice = createSlice({
    name: "users",
    initialState,
    extraReducers: (builder) => {
        // User List
        builder.addCase(userList.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(userList.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(userList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Updating the User
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;

                const index = state.users.findIndex((user) => user._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Deleting the User
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
            }).addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                const deletedUserId = action.payload;
                state.users = state.users.filter((user) => user._id !== deletedUserId);

            }).addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})


export const getUsers = (state) => state.users.users;

export default userSlice.reducer;