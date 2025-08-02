import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { API_URL } from "../../../main";


export const fetchContactOptions = createAsyncThunk(
    "contacts/fetchContactOptions",
    async (_, { rejectWithValue }) => {
        try {
            console.log("Inside fetchContactOptions");
            const res = await axios.get(`${API_URL}/contacts/contactOptions`);
            console.log("Contact options fetched:", res.data);
            return res.data.data;
        } catch (error) {
            console.error('Error in fetchContactTypes:', error);
            return rejectWithValue(error.message);
        }
    }
);


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



const initialState = {
    items: [],
    loading: false,
    error: null,
    contactOptions: {
        status: [],
        types: []
    },
    contactOptionsLoading: false,
    contactOptionsError: null,
};




const contactsSlice = createSlice({
    name: "contacts",
    initialState,
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
            })
            .addCase(fetchContactOptions.pending, (state) => {
                state.contactOptionsLoading = true;
                state.contactOptionsError = null;
            })
            .addCase(fetchContactOptions.fulfilled, (state, action) => {
                state.contactOptionsLoading = false;
                state.contactOptions = action.payload;
            })
            .addCase(fetchContactOptions.rejected, (state, action) => {
                state.contactOptionsLoading = false;
                state.contactOptionsError = action.error.message;
            })

    },
});

export const { clearContacts } = contactsSlice.actions;
export default contactsSlice.reducer;
