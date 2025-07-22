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

const visitSchedulesSlice = createSlice({
    name: 'visitSchedules',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearVisitSchedules: (state) => {
            state.items = [];
            state.loading = false;
            state.error = null;
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
            });
    },
});

export const { clearVisitSchedules } = visitSchedulesSlice.actions;
export default visitSchedulesSlice.reducer; 