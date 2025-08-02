import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export const uploadCarePlanAttachment = createAsyncThunk(
    'carePlanDocuments/uploadCarePlanAttachment',
    async ({ carePlanId, file }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await axios.post(`${BACKEND_URL}/careplans/${carePlanId}/documents/attachment`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


// Client-level document thunks
export const addClientDocument = createAsyncThunk(
    'carePlanDocuments/addClientDocument',
    async ({ clientId, documentData }, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${BACKEND_URL}/careplans/client/${clientId}/documents`, documentData, { withCredentials: true });
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateClientDocument = createAsyncThunk(
    'carePlanDocuments/updateClientDocument',
    async ({ clientId, docId, documentData }, { rejectWithValue }) => {
        try {
            const res = await axios.patch(`${BACKEND_URL}/careplans/client/${clientId}/documents/${docId}`, documentData, { withCredentials: true });
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteClientDocument = createAsyncThunk(
    'carePlanDocuments/deleteClientDocument',
    async ({ clientId, docId }, { rejectWithValue }) => {
        try {
            await axios.delete(`${BACKEND_URL}/careplans/client/${clientId}/documents/${docId}`, { withCredentials: true });
            return docId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchAllClientDocuments = createAsyncThunk(
    'carePlanDocuments/fetchAllClientDocuments',
    async (clientId, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${BACKEND_URL}/careplans/client/${clientId}/documents`, { withCredentials: true });
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const carePlanDocumentsSlice = createSlice({
    name: 'carePlanDocuments',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearCarePlanDocuments: (state) => {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllClientDocuments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllClientDocuments.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload; // array
            })
            .addCase(fetchAllClientDocuments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addClientDocument.fulfilled, (state, action) => {
                state.items.push(action.payload); // single doc
            })
            .addCase(updateClientDocument.fulfilled, (state, action) => {
                const idx = state.items.findIndex((d) => d._id === action.payload._id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(deleteClientDocument.fulfilled, (state, action) => {
                state.items = state.items.filter((d) => d._id !== action.payload);
            });
    },
});

export const { clearCarePlanDocuments } = carePlanDocumentsSlice.actions;
export default carePlanDocumentsSlice.reducer; 