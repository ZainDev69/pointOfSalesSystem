import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from "../../../main";





export const fetchVisitOptions = createAsyncThunk(
    'visitSchedules/fetchVisitOptions',
    async (clientId, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}/clients/${clientId}/visit-options`, {
                withCredentials: true,
            });
            console.log("API_URL is", API_URL);
            console.log("✅ Fetch Visit Options SUCCESS", res);
            return res.data.data;
        } catch (error) {
            console.error("❌ Fetch Visit Options ERROR", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);



// Fetch all visits for a client
export const fetchVisitSchedule = createAsyncThunk(
    'visitSchedules/fetchVisitSchedule',
    async (clientId, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}/clients/${clientId}/visits`);
            return res.data.data.visits || [];
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Add a visit
export const addVisit = createAsyncThunk(
    'visitSchedules/addVisit',
    async ({ clientId, visitData }, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API_URL}/clients/${clientId}/visits`, visitData);
            return res.data.data.visits;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Update a visit
export const updateVisit = createAsyncThunk(
    'visitSchedules/updateVisit',
    async ({ clientId, visitId, visitData }, { rejectWithValue }) => {
        try {
            const res = await axios.put(`${API_URL}/clients/${clientId}/visits/${visitId}`, visitData);
            return res.data.data.visits;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Delete a visit
export const deleteVisit = createAsyncThunk(
    'visitSchedules/deleteVisit',
    async ({ clientId, visitId }, { rejectWithValue }) => {
        try {
            const res = await axios.delete(`${API_URL}/clients/${clientId}/visits/${visitId}`, {
                withCredentials: true,
            });
            return res.data.visitId; // Return visitId for reducer filtering
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);





const visitSchedulesSlice = createSlice({
    name: 'visitSchedules',
    initialState: {
        items: [],
        loading: false,
        error: null,
        visitScheduleOptions: {
            status: [],
            priority: [],
            taskCategory: [],
            taskPriority: []
        },
        visitScheduleOptionsLoading: false,
        visitScheduleOptionsError: null
    },
    reducers: {
        clearVisitSchedules: (state) => {
            state.items = [];
            state.loading = false;
            state.error = null;
            state.visitScheduleOptions = [];
            state.visitScheduleOptions = {
                status: [],
                priority: [],
                taskCategory: [],
                taskPriority: [],
            };
            state.visitScheduleOptionsLoading = false;
            state.visitScheduleOptionsError = null;
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
            .addCase(fetchVisitOptions.pending, (state) => {
                state.visitScheduleOptionsLoading = true;
                state.visitScheduleOptionsError = null;
            })
            .addCase(fetchVisitOptions.fulfilled, (state, action) => {
                state.visitScheduleOptionsLoading = false;
                state.visitScheduleOptions = action.payload;
            })
            .addCase(fetchVisitOptions.rejected, (state, action) => {
                state.visitScheduleOptionsLoading = false;
                state.visitScheduleOptionsError = action.error.message;
            })

    },
});

export const { clearVisitSchedules } = visitSchedulesSlice.actions;
export default visitSchedulesSlice.reducer; 