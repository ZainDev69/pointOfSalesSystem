import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../../main';

export const fetchCommunicationTypes = createAsyncThunk(
    'communications/fetchCommunicationTypes',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}/communications/types`);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchCommunicationCategories = createAsyncThunk(
    'communications/fetchCommunicationCategories',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}/communications/categories`);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchCommunications = createAsyncThunk(
    'communications/fetchCommunications',
    async ({ clientId, type, category, page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const params = [];
            if (type) params.push(`type=${type}`);
            if (category) params.push(`category=${category}`);
            params.push(`page=${page}`);
            params.push(`limit=${limit}`);
            const query = params.length ? `?${params.join('&')}` : '';
            const res = await axios.get(`${API_URL}/communications/client/${clientId}${query}`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const createCommunication = createAsyncThunk(
    'communications/createCommunication',
    async (data, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API_URL}/communications`, data);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateCommunication = createAsyncThunk(
    'communications/updateCommunication',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await axios.put(`${API_URL}/communications/${id}`, data);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteCommunication = createAsyncThunk(
    'communications/deleteCommunication',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/communications/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchInitiatedByOptions = createAsyncThunk(
    'communications/fetchInitiatedByOptions',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}/communications/initiated-by`);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchCommunicationStatuses = createAsyncThunk(
    'communications/fetchCommunicationStatuses',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}/communications/statuses`);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const communicationsSlice = createSlice({
    name: 'communications',
    initialState: {
        items: [],
        loading: false,
        error: null,
        communicationType: [],
        communicationTypeLoading: false,
        communicationTypeError: null,
        category: [],
        categoryLoading: false,
        categoryError: null,
        total: 0,
        page: 1,
        pages: 1,
        initiatedByOptions: [],
        initiatedByOptionsLoading: false,
        initiatedByOptionsError: null,
        statuses: [],
        statusesLoading: false,
        statusesError: null,
    },
    reducers: {
        clearCommunications: (state) => {
            state.items = [];
            state.loading = false;
            state.error = null;
            state.total = 0;
            state.page = 1;
            state.pages = 1;
            state.communicationType = [];
            state.communicationTypeLoading = false;
            state.communicationTypeError = null;
            state.category = [];
            state.categoryLoading = false;
            state.categoryError = null;
            state.initiatedByOptions = [];
            state.initiatedByOptionsLoading = false;
            state.initiatedByOptionsError = null;
            state.statuses = [];
            state.statusesLoading = false;
            state.statusesError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCommunicationTypes.pending, (state) => {
                state.communicationTypeLoading = true;
                state.communicationTypeError = null;
            })
            .addCase(fetchCommunicationTypes.fulfilled, (state, action) => {
                state.communicationTypeLoading = false;
                state.communicationType = action.payload;
            })
            .addCase(fetchCommunicationTypes.rejected, (state, action) => {
                state.communicationTypeLoading = false;
                state.communicationTypeError = action.payload;
            })
            .addCase(fetchCommunicationCategories.pending, (state) => {
                state.categoryLoading = true;
                state.categoryError = null;
            })
            .addCase(fetchCommunicationCategories.fulfilled, (state, action) => {
                state.categoryLoading = false;
                state.category = action.payload;
            })
            .addCase(fetchCommunicationCategories.rejected, (state, action) => {
                state.categoryLoading = false;
                state.categoryError = action.payload;
            })
            .addCase(fetchCommunications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCommunications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.pages = action.payload.pages;
            })
            .addCase(fetchCommunications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createCommunication.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(updateCommunication.fulfilled, (state, action) => {
                const idx = state.items.findIndex((c) => c._id === action.payload._id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(deleteCommunication.fulfilled, (state, action) => {
                state.items = state.items.filter((c) => c._id !== action.payload);
            })
            .addCase(fetchInitiatedByOptions.pending, (state) => {
                state.initiatedByOptionsLoading = true;
                state.initiatedByOptionsError = null;
            })
            .addCase(fetchInitiatedByOptions.fulfilled, (state, action) => {
                state.initiatedByOptionsLoading = false;
                state.initiatedByOptions = action.payload;
            })
            .addCase(fetchInitiatedByOptions.rejected, (state, action) => {
                state.initiatedByOptionsLoading = false;
                state.initiatedByOptionsError = action.payload;
            })
            .addCase(fetchCommunicationStatuses.pending, (state) => {
                state.statusesLoading = true;
                state.statusesError = null;
            })
            .addCase(fetchCommunicationStatuses.fulfilled, (state, action) => {
                state.statusesLoading = false;
                state.statuses = action.payload;
            })
            .addCase(fetchCommunicationStatuses.rejected, (state, action) => {
                state.statusesLoading = false;
                state.statusesError = action.payload;
            });
    },
});

export const { clearCommunications } = communicationsSlice.actions;
export default communicationsSlice.reducer; 