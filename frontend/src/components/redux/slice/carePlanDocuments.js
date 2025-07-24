import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchCarePlanDocuments = createAsyncThunk(
    'carePlanDocuments/fetchCarePlanDocuments',
    async (carePlanId, { rejectWithValue }) => {
        try {
            console.log("Fetching the care plan documents", carePlanId);
            const res = await axios.get(`${BACKEND_URL}/careplans/${carePlanId}/documents`, { withCredentials: true });
            console.log("Care plan documents fetched", res.data.data);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const addCarePlanDocument = createAsyncThunk(
    'carePlanDocuments/addCarePlanDocument',
    async ({ carePlanId, documentData }, { rejectWithValue }) => {
        try {
            console.log("Adding the care plan document", documentData);
            const res = await axios.post(`${BACKEND_URL}/careplans/${carePlanId}/documents`, documentData, { withCredentials: true });
            console.log("Care plan document added", res.data.data);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateCarePlanDocument = createAsyncThunk(
    'carePlanDocuments/updateCarePlanDocument',
    async ({ carePlanId, docId, documentData }, { rejectWithValue }) => {
        try {
            console.log("Updating the care plan document", carePlanId, docId, documentData);
            const res = await axios.patch(`${BACKEND_URL}/careplans/${carePlanId}/documents/${docId}`, documentData, { withCredentials: true });
            console.log("Care plan document updated", res.data.data);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteCarePlanDocument = createAsyncThunk(
    'carePlanDocuments/deleteCarePlanDocument',
    async ({ carePlanId, docId }, { rejectWithValue }) => {
        try {
            console.log("Deleting the care plan document", docId);
            await axios.delete(`${BACKEND_URL}/careplans/${carePlanId}/documents/${docId}`, { withCredentials: true });
            console.log("Care plan document deleted", docId);
            return docId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const uploadCarePlanAttachment = createAsyncThunk(
    'carePlanDocuments/uploadCarePlanAttachment',
    async ({ carePlanId, file }, { rejectWithValue }) => {
        try {
            console.log("Uploading the care plan attachment", file);
            const formData = new FormData();
            formData.append('file', file);
            const res = await axios.post(`${BACKEND_URL}/careplans/${carePlanId}/documents/attachment`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            console.log("Care plan attachment uploaded", res.data);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchAllCarePlanDocumentsForClient = createAsyncThunk(
    'carePlanDocuments/fetchAllCarePlanDocumentsForClient',
    async (clientId, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${BACKEND_URL}/careplans/client/${clientId}/all-documents`, { withCredentials: true });
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
            .addCase(fetchCarePlanDocuments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCarePlanDocuments.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCarePlanDocuments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllCarePlanDocumentsForClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllCarePlanDocumentsForClient.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchAllCarePlanDocumentsForClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addCarePlanDocument.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateCarePlanDocument.fulfilled, (state, action) => {
                const idx = state.items.findIndex((d) => d._id === action.payload._id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(deleteCarePlanDocument.fulfilled, (state, action) => {
                state.items = state.items.filter((d) => d._id !== action.payload);
            });
    },
});

export const { clearCarePlanDocuments } = carePlanDocumentsSlice.actions;
export default carePlanDocumentsSlice.reducer; 