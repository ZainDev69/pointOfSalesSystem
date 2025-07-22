import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../../main';

export const fetchActivityLogs = createAsyncThunk(
    'activityLogs/fetchActivityLogs',
    async (clientId, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}/activity-logs/client/${clientId}`);
            return res.data.data;
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
    }, reducers: {
        clearActivityLogs: (state) => {
            state.logs = [];
            state.loading = false;
            state.error = null;
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
                state.logs = action.payload;
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