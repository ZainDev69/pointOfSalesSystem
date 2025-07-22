import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { API_URL } from "../../../main";

// Fetch contacts for a client
export const fetchContacts = createAsyncThunk(
    "contacts/fetchContacts",
    async (clientId, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}/clients/${clientId}/contacts`, { withCredentials: true });
            return res.data;
        } catch (error) {
            console.error('Error in fetchContacts:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Add a contact
export const addContact = createAsyncThunk(
    "contacts/addContact",
    async ({ clientId, contactData }, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API_URL}/clients/${clientId}/contacts`, contactData, { withCredentials: true });
            return res.data;
        } catch (error) {
            console.error('Error in addContact:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Edit a contact
export const editContact = createAsyncThunk(
    "contacts/editContact",
    async ({ clientId, contactId, contactData }, { rejectWithValue }) => {
        try {
            const res = await axios.put(`${API_URL}/clients/${clientId}/contacts/${contactId}`, contactData, { withCredentials: true });
            return res.data;
        } catch (error) {
            console.error('Error in editContact:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Delete a contact
export const deleteContact = createAsyncThunk(
    "contacts/deleteContact",
    async ({ clientId, contactId }, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/clients/${clientId}/contacts/${contactId}`, { withCredentials: true });
            return contactId;
        } catch (error) {
            console.error('Error in deleteContact:', error);
            return rejectWithValue(error.message);
        }
    }
);

const contactsSlice = createSlice({
    name: "contacts",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearContacts: (state) => {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContacts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchContacts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addContact.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(editContact.fulfilled, (state, action) => {
                const idx = state.items.findIndex((c) => c._id === action.payload._id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(deleteContact.fulfilled, (state, action) => {
                state.items = state.items.filter((c) => c._id !== action.payload);
            });
    },
});

export const { clearContacts } = contactsSlice.actions;
export default contactsSlice.reducer;
