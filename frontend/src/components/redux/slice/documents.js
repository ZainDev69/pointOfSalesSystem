import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../main";

// Fetch documents for a client
export const fetchDocuments = createAsyncThunk(
    "documents/fetchDocuments",
    async (clientId, { rejectWithValue }) => {
        try {
            console.log("Fetching the documents", clientId);
            const res = await axios.get(`${API_URL}/clients/${clientId}/documents`, { withCredentials: true });
            console.log("Documents fetched", res.data.data);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Add a document
export const addDocument = createAsyncThunk(
    "documents/addDocument",
    async ({ clientId, documentData }, { rejectWithValue }) => {
        try {
            console.log("Adding the document", documentData);
            const res = await axios.post(`${API_URL}/clients/${clientId}/documents`, documentData, { withCredentials: true });
            console.log("Document added", res.data.data);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Update a document
export const updateDocument = createAsyncThunk(
    "documents/updateDocument",
    async ({ clientId, documentId, documentData }, { rejectWithValue }) => {
        try {
            console.log("Updating the document", documentData);
            const res = await axios.patch(`${API_URL}/clients/${clientId}/documents/${documentId}`, documentData, { withCredentials: true });
            console.log("Document updated", res.data.data);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Delete a document
export const deleteDocument = createAsyncThunk(
    "documents/deleteDocument",
    async ({ clientId, documentId }, { rejectWithValue }) => {
        try {
            console.log("Deleting the document", documentId);
            await axios.delete(`${API_URL}/clients/${clientId}/documents/${documentId}`, { withCredentials: true });
            console.log("Document deleted", documentId);
            return documentId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Upload an attachment
export const uploadAttachment = createAsyncThunk(
    "documents/uploadAttachment",
    async ({ clientId, file }, { rejectWithValue }) => {
        try {
            console.log("Uploading the Document")
            const formData = new FormData();
            formData.append('file', file);
            const res = await axios.post(`${API_URL}/clients/${clientId}/documents/attachment`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            console.log("Document is uploaded")
            return res.data.url;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const documentsSlice = createSlice({
    name: "documents",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearDocuments: (state) => {
            state.items = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDocuments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDocuments.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchDocuments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addDocument.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateDocument.fulfilled, (state, action) => {
                const idx = state.items.findIndex((d) => d.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(deleteDocument.fulfilled, (state, action) => {
                state.items = state.items.filter((d) => d.id !== action.payload);
            });
    },
});

export const { clearDocuments } = documentsSlice.actions;
export default documentsSlice.reducer; 