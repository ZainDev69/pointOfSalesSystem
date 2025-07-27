import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from "../../../main";

export const fetchVisitSchedule = createAsyncThunk(
    'visitSchedules/fetchVisitSchedule',
    async (clientId, { rejectWithValue }) => {
        try {
            console.log("Fetching the visit schedule", clientId);
            const res = await axios.get(`${API_URL}/clients/${clientId}/visits`);
            console.log("Visits fetched", res.data.data.visits);
            return res.data.data.visits || [];
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const addVisit = createAsyncThunk(
    'visitSchedules/addVisit',
    async ({ clientId, visitData }, { rejectWithValue }) => {
        try {
            console.log("Adding the visit", visitData);
            const res = await axios.post(`${API_URL}/clients/${clientId}/visits`, visitData);
            console.log("Visit added", res.data.data.visits);
            return res.data.data.visits;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const updateVisit = createAsyncThunk(
    'visitSchedules/updateVisit',
    async ({ clientId, visitId, visitData }, { rejectWithValue }) => {
        try {
            console.log("Updating the visit", visitData);
            const res = await axios.put(`${API_URL}/clients/${clientId}/visits/${visitId}`, visitData);
            console.log("Visit updated", res.data.data.visits);
            return res.data.data.visits;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const deleteVisit = createAsyncThunk(
    'visitSchedules/deleteVisit',
    async ({ clientId, visitId }, { rejectWithValue }) => {
        try {
            console.log("Deleting the visit", "VisitId", visitId, "ClientId", clientId);
            await axios.delete(`${API_URL}/clients/${clientId}/visits/${visitId}`, { withCredentials: true });
            console.log("Visit deleted", visitId);
            return visitId;
        } catch (error) {
            console.error('Error in deleteVisit:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Fetch visit status types
export const fetchVisitStatusTypes = createAsyncThunk(
    'visitSchedules/fetchVisitStatusTypes',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}/visits/status-types`);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch visit priority types
export const fetchVisitPriorityTypes = createAsyncThunk(
    'visitSchedules/fetchVisitPriorityTypes',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}/visits/priority-types`);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const visitSchedulesSlice = createSlice({
    name: 'visitSchedules',
    initialState: {
        items: [],
        loading: false,
        error: null,
        visitStatusTypes: [],
        visitStatusTypesLoading: false,
        visitStatusTypesError: null,
        visitPriorityTypes: [],
        visitPriorityTypesLoading: false,
        visitPriorityTypesError: null,
    },
    reducers: {
        clearVisitSchedules: (state) => {
            state.items = [];
            state.loading = false;
            state.error = null;
            state.visitStatusTypes = [];
            state.visitStatusTypesLoading = false;
            state.visitStatusTypesError = null;
            state.visitPriorityTypes = [];
            state.visitPriorityTypesLoading = false;
            state.visitPriorityTypesError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchVisitSchedule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVisitSchedule.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchVisitSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addVisit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addVisit.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(addVisit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateVisit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateVisit.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(updateVisit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteVisit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteVisit.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((v) => v._id !== action.payload);
            })
            .addCase(deleteVisit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchVisitStatusTypes.pending, (state) => {
                state.visitStatusTypesLoading = true;
                state.visitStatusTypesError = null;
            })
            .addCase(fetchVisitStatusTypes.fulfilled, (state, action) => {
                state.visitStatusTypesLoading = false;
                state.visitStatusTypes = action.payload;
            })
            .addCase(fetchVisitStatusTypes.rejected, (state, action) => {
                state.visitStatusTypesLoading = false;
                state.visitStatusTypesError = action.error.message;
            })
            .addCase(fetchVisitPriorityTypes.pending, (state) => {
                state.visitPriorityTypesLoading = true;
                state.visitPriorityTypesError = null;
            })
            .addCase(fetchVisitPriorityTypes.fulfilled, (state, action) => {
                state.visitPriorityTypesLoading = false;
                state.visitPriorityTypes = action.payload;
            })
            .addCase(fetchVisitPriorityTypes.rejected, (state, action) => {
                state.visitPriorityTypesLoading = false;
                state.visitPriorityTypesError = action.error.message;
            });
    },
});

export const { clearVisitSchedules } = visitSchedulesSlice.actions;
export default visitSchedulesSlice.reducer; 