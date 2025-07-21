import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { API_URL } from "../../../main";

// Fetch contacts for a client
export const fetchContacts = createAsyncThunk(
    "contacts/fetchContacts",
    async (clientId) => {
        console.log("Fetching contacts for client:", clientId);
        const res = await axios.get(`${API_URL}/api/clients/${clientId}/contacts`, { withCredentials: true });
        console.log("Contacts fetched:", res.data);
        return res.data;
    }
);

// Add a contact
export const addContact = createAsyncThunk(
    "contacts/addContact",
    async ({ clientId, contactData }) => {
        console.log("Adding contact for client:", clientId);
        console.log("Contact data:", contactData);
        const res = await axios.post(`${API_URL}/api/clients/${clientId}/contacts`, contactData, { withCredentials: true });
        console.log("Contact added:", res.data);

        return res.data;
    }
);

// Edit a contact
export const editContact = createAsyncThunk(
    "contacts/editContact",
    async ({ clientId, contactId, contactData }) => {
        console.log("Editing contact for client:", clientId);
        console.log("Contact ID:", contactId);
        console.log("Contact data:", contactData);
        const res = await axios.put(`${API_URL}/api/clients/${clientId}/contacts/${contactId}`, contactData, { withCredentials: true });
        console.log("Contact edited:", res.data);
        return res.data;
    }
);

// Delete a contact
export const deleteContact = createAsyncThunk(
    "contacts/deleteContact",
    async ({ clientId, contactId }) => {
        console.log("Deleting contact for client:", clientId);
        console.log("Contact ID:", contactId);
        await axios.delete(`${API_URL}/api/clients/${clientId}/contacts/${contactId}`, { withCredentials: true });
        console.log("Contact deleted");
        return contactId;
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