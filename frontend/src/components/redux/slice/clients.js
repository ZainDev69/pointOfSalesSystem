import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../main";



export const fetchClientOptions = createAsyncThunk(
    "clients/fetchClientOptions",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/clients/client-options`, {
                withCredentials: true,
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue({ message: error.response?.data?.message || error.message });
        }
    }
);

export const createClient = createAsyncThunk(
    "clients/createClient",
    async (clientData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/clients`, clientData, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
            });
            return response.data.data;
        } catch (error) {
            if (error.response?.status === 400) {
                return rejectWithValue({ message: error.response.data.errors });
            }
            return rejectWithValue({ message: 'Unknown error' });
        }
    }
);

export const clientList = createAsyncThunk(
    "clients/getClients",
    async (params = {}, { rejectWithValue }) => {
        try {
            const query = new URLSearchParams(params).toString();
            const response = await axios.get(`${API_URL}/clients?${query}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue({ message: error.response?.data?.message || error.message });
        }
    }
);

export const getClient = createAsyncThunk(
    "clients/getClient",
    async (clientId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/clients/${clientId}`, {
                withCredentials: true,
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue({ message: error.response?.data?.message || error.message });
        }
    }
);

export const deleteClient = createAsyncThunk(
    "clients/deleteClient",
    async (clientId, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/clients/${clientId}`, { withCredentials: true });
            return clientId;
        } catch (error) {
            return rejectWithValue({ message: error.response?.data?.message || error.message });
        }
    }
);

export const updateClient = createAsyncThunk(
    "clients/updateClient",
    async ({ clientId, clientData }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${API_URL}/clients/${clientId}`, clientData, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue({ message: error.response?.data?.message || error.message });
        }
    }
);

export const archiveClient = createAsyncThunk(
    "clients/archiveClient",
    async (clientId, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${API_URL}/clients/${clientId}/archive`,
                {},
                { withCredentials: true }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue({ message: error.response?.data?.message || error.message });
        }
    }
);

export const unarchiveClient = createAsyncThunk(
    "clients/unarchiveClient",
    async (clientId, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${API_URL}/clients/${clientId}/unarchive`,
                {},
                { withCredentials: true }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue({ message: error.response?.data?.message || "Error unarchiving client" });
        }
    }
);

export const checkClientId = createAsyncThunk(
    "clients/checkClientId",
    async (clientId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/clients/check-id?clientId=${clientId}`, {
                withCredentials: true,
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue({ message: error.response?.data?.message || "Unknown error" });
        }
    }
);

// Initial State

const initialState = {
    clients: [],
    client: null,
    loading: false,
    error: null,
    total: 0,
    page: 1,
    pages: 1,
    clientOptions: {
        title: [],
        gender: [],
        relationshipStatus: [],
        ethnicity: [],
        status: [],
        preferredContactMethod: [],
        conditionSeverity: [],
        conditionStatus: [],
        allergySeverity: [],
        medicationRoute: [],
        medicationStatus: [],
        religiousPracticeLevel: [],
        dietaryAssistanceLevel: [],
    },
    clientOptionsLoading: false,
    clientOptionsError: null,
};

// Slice

const clientSlice = createSlice({
    name: "clients",
    initialState,
    extraReducers: (builder) => {
        builder
            // Fetch Enum Options
            .addCase(fetchClientOptions.pending, (state) => {
                state.clientOptionsLoading = true;
                state.clientOptionsError = null;
            })
            .addCase(fetchClientOptions.fulfilled, (state, action) => {
                state.clientOptionsLoading = false;
                state.clientOptions = action.payload;
            })
            .addCase(fetchClientOptions.rejected, (state, action) => {
                state.clientOptionsLoading = false;
                state.clientOptionsError = action.payload?.message || action.error?.message;
            })

            // Check Client ID
            .addCase(checkClientId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkClientId.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(checkClientId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message;
            })

            // List Clients
            .addCase(clientList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(clientList.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.pages = action.payload.pages;
            })
            .addCase(clientList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message;
            })

            // Get Single Client
            .addCase(getClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getClient.fulfilled, (state, action) => {
                state.loading = false;
                state.client = action.payload;
            })
            .addCase(getClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message;
            })

            // Create Client
            .addCase(createClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createClient.fulfilled, (state, action) => {
                state.loading = false;
                state.clients.push(action.payload);
            })
            .addCase(createClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message;
            })

            // Update Client
            .addCase(updateClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateClient.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.clients.findIndex(c => c._id === action.payload._id);
                if (index !== -1) state.clients[index] = action.payload;
            })
            .addCase(updateClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message;
            })

            // Delete Client
            .addCase(deleteClient.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteClient.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = state.clients.filter(c => c._id !== action.payload);
            })
            .addCase(deleteClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message;
            })

            // Archive Client
            .addCase(archiveClient.pending, (state) => {
                state.loading = true;
            })
            .addCase(archiveClient.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.clients.findIndex(c => c._id === action.payload._id);
                if (index !== -1) state.clients[index] = action.payload;
            })
            .addCase(archiveClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message;
            })

            // Unarchive Client
            .addCase(unarchiveClient.pending, (state) => {
                state.loading = true;
            })
            .addCase(unarchiveClient.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.clients.findIndex(c => c._id === action.payload._id);
                if (index !== -1) state.clients[index] = action.payload;
            })
            .addCase(unarchiveClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message;
            });
    }
});

// Selectors

export const getClients = (state) => state.clients.clients;
export const getSingleClient = (state) => state.clients.client;
export const getClientOptions = (state) => state.clients.clientOptions;

// Export Reducer

export default clientSlice.reducer;