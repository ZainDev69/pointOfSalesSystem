import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from "../../../main";

// Fetch all risk assessments for a client
export const fetchRiskAssessments = createAsyncThunk(
    'riskAssessments/fetchRiskAssessments',
    async (clientId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/risk-assessments/client/${clientId}`, {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Add a new risk assessment
export const addRiskAssessment = createAsyncThunk(
    'riskAssessments/addRiskAssessment',
    async (assessment, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/risk-assessments`, assessment, {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Edit a risk assessment
export const editRiskAssessment = createAsyncThunk(
    'riskAssessments/editRiskAssessment',
    async ({ id, assessment }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/risk-assessments/${id}`, assessment, {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Delete a risk assessment
export const deleteRiskAssessment = createAsyncThunk(
    'riskAssessments/deleteRiskAssessment',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/risk-assessments/${id}`, {
                withCredentials: true
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch risk assessment types
export const fetchRiskAssessmentOptions = createAsyncThunk(
    'riskAssessments/fetchRiskAssessmentOptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/risk-assessments/risk-options`, {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);






const initialState = {
    items: [],
    loading: false,
    error: null,
    riskAssessmentOptions: {
        likelihood: [],
        type: [],
        severity: [],
        status: [],
    },
    riskAssessmentOptionsLoading: false,
    riskAssessmentOptionsError: null,
}

const riskAssessmentsSlice = createSlice({
    name: 'riskAssessments',
    initialState,
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
            }).
            addCase(fetchRiskAssessmentOptions.pending, (state) => {
                state.riskAssessmentOptionsLoading = true;
                state.riskAssessmentOptionsError = null;
            }).addCase(fetchRiskAssessmentOptions.fulfilled, (state, action) => {
                state.riskAssessmentOptionsLoading = false;
                state.riskAssessmentOptions = action.payload;
            }).addCase(fetchRiskAssessmentOptions.rejected, (state, action) => {
                state.riskAssessmentOptionsLoading = false;
                state.riskAssessmentOptionsError = action.error.message;
            });

    },
});


export default riskAssessmentsSlice.reducer; 