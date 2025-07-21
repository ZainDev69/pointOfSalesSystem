import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from "../../../main";

// Fetch all risk assessments for a client
export const fetchRiskAssessments = createAsyncThunk(
    'riskAssessments/fetchRiskAssessments',
    async (clientId) => {
        const response = await axios.get(`${API_URL}/api/risk-assessments/client/${clientId}`);
        return response.data.data;
    }
);

// Add a new risk assessment
export const addRiskAssessment = createAsyncThunk(
    'riskAssessments/addRiskAssessment',
    async (assessment) => {
        const response = await axios.post(`${API_URL}/api/risk-assessments`, assessment);
        return response.data.data;
    }
);

// Edit a risk assessment
export const editRiskAssessment = createAsyncThunk(
    'riskAssessments/editRiskAssessment',
    async ({ id, assessment }) => {
        const response = await axios.put(`${API_URL}/api/risk-assessments/${id}`, assessment);
        return response.data.data;
    }
);

// Delete a risk assessment
export const deleteRiskAssessment = createAsyncThunk(
    'riskAssessments/deleteRiskAssessment',
    async (id) => {
        await axios.delete(`${API_URL}/api/risk-assessments/${id}`);
        return id;
    }
);

const riskAssessmentsSlice = createSlice({
    name: 'riskAssessments',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRiskAssessments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRiskAssessments.fulfilled, (state, action) => {
                state.loading = false;
                state.items = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchRiskAssessments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addRiskAssessment.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(editRiskAssessment.fulfilled, (state, action) => {
                const idx = state.items.findIndex((a) => a._id === action.payload._id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(deleteRiskAssessment.fulfilled, (state, action) => {
                state.items = state.items.filter((a) => a._id !== action.payload);
            });
    },
});

export default riskAssessmentsSlice.reducer; 