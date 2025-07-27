import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../../main';

export const fetchActivityLogs = createAsyncThunk(
    'activityLogs/fetchActivityLogs',
    async ({ clientId, page = 1, limit = 10, date, user }, { rejectWithValue }) => {
        try {
            let url = `${API_URL}/activity-logs/client/${clientId}?page=${page}&limit=${limit}`;

            // Add filter parameters to URL
            if (date) url += `&date=${date}`;
            if (user) url += `&user=${encodeURIComponent(user)}`;

            const res = await axios.get(url);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const addActivityLog = createAsyncThunk(
    'activityLogs/addActivityLog',
    async (logData, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API_URL}/activity-logs`, logData);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteActivityLog = createAsyncThunk(
    'activityLogs/deleteActivityLog',
    async (logId, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/activity-logs/${logId}`);
            return logId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const activityLogsSlice = createSlice({
    name: 'activityLogs',
    initialState: {
        logs: [],
        loading: false,
        error: null,
        total: 0,
        page: 1,
        pages: 1,
    }, reducers: {
        clearActivityLogs: (state) => {
            state.logs = [];
            state.loading = false;
            state.error = null;
            state.total = 0;
            state.page = 1;
            state.pages = 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActivityLogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActivityLogs.fulfilled, (state, action) => {
                state.loading = false;
                state.logs = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.pages = action.payload.pages;
            })
            .addCase(fetchActivityLogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addActivityLog.fulfilled, (state, action) => {
                state.logs.unshift(action.payload);
            })
            .addCase(deleteActivityLog.fulfilled, (state, action) => {
                state.logs = state.logs.filter((log) => log._id !== action.payload);
            });
    },
});

export const { clearActivityLogs } = activityLogsSlice.actions;
export default activityLogsSlice.reducer;
export const selectActivityLogs = (state) => state.activityLogs.logs;
export const selectActivityLogsLoading = (state) => state.activityLogs.loading;
export const selectActivityLogsError = (state) => state.activityLogs.error; 