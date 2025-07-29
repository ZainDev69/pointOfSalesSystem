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
            console.error('Error in fetchRiskAssessments:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Add a new risk assessment
export const addRiskAssessment = createAsyncThunk(
    'riskAssessments/addRiskAssessment',
    async (assessment, { rejectWithValue }) => {
        try {
            console.log('=== ADD RISK ASSESSMENT REDUX THUNK CALLED ===');
            console.log('Assessment data being sent:', assessment);
            console.log('API URL:', `${API_URL}/risk-assessments`);

            const response = await axios.post(`${API_URL}/risk-assessments`, assessment, {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            console.error('=== ERROR IN ADD RISK ASSESSMENT ===');
            console.error('Error object:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            console.error('Error message:', error.message);
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
            console.error('Error in editRiskAssessment:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Delete a risk assessment
export const deleteRiskAssessment = createAsyncThunk(
    'riskAssessments/deleteRiskAssessment',
    async (id, { rejectWithValue }) => {
        try {
            console.log('=== DELETE RISK ASSESSMENT REDUX THUNK CALLED ===');
            console.log('Assessment ID:', id);
            console.log('API URL:', `${API_URL}/risk-assessments/${id}`);

            const response = await axios.delete(`${API_URL}/risk-assessments/${id}`, {
                withCredentials: true
            });

            console.log('Delete response:', response);
            return id;
        } catch (error) {
            console.error('=== ERROR IN DELETE RISK ASSESSMENT ===');
            console.error('Error object:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            console.error('Error message:', error.message);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch risk assessment types
export const fetchRiskAssessmentTypes = createAsyncThunk(
    'riskAssessments/fetchRiskAssessmentTypes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/risk-assessments/types`, {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchRiskAssessmentTypes:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch likelihood options
export const fetchLikelihoodOptions = createAsyncThunk(
    'riskAssessments/fetchLikelihoodOptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/risk-assessments/likelihood-options`, {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchLikelihoodOptions:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch severity options
export const fetchSeverityOptions = createAsyncThunk(
    'riskAssessments/fetchSeverityOptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/risk-assessments/severity-options`, {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchSeverityOptions:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch assessment status options
export const fetchAssessmentStatusOptions = createAsyncThunk(
    'riskAssessments/fetchAssessmentStatusOptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/risk-assessments/assessment-status-options`, {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchAssessmentStatusOptions:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const riskAssessmentsSlice = createSlice({
    name: 'riskAssessments',
    initialState: {
        items: [],
        loading: false,
        error: null,
        riskAssessmentTypes: [],
        riskAssessmentTypesLoading: false,
        riskAssessmentTypesError: null,
        likelihoodOptions: [],
        likelihoodOptionsLoading: false,
        likelihoodOptionsError: null,
        severityOptions: [],
        severityOptionsLoading: false,
        severityOptionsError: null,
        assessmentStatusOptions: [],
        assessmentStatusOptionsLoading: false,
        assessmentStatusOptionsError: null,
    },
    reducers: {
        clearRiskAssessments: (state) => {
            state.items = [];
            state.loading = false;
            state.error = null;
            state.riskAssessmentTypes = [];
            state.riskAssessmentTypesLoading = false;
            state.riskAssessmentTypesError = null;
            state.likelihoodOptions = [];
            state.likelihoodOptionsLoading = false;
            state.likelihoodOptionsError = null;
            state.severityOptions = [];
            state.severityOptionsLoading = false;
            state.severityOptionsError = null;
            state.assessmentStatusOptions = [];
            state.assessmentStatusOptionsLoading = false;
            state.assessmentStatusOptionsError = null;
        },
    },
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
            })
            .addCase(fetchRiskAssessmentTypes.pending, (state) => {
                state.riskAssessmentTypesLoading = true;
                state.riskAssessmentTypesError = null;
            })
            .addCase(fetchRiskAssessmentTypes.fulfilled, (state, action) => {
                state.riskAssessmentTypesLoading = false;
                state.riskAssessmentTypes = action.payload;
            })
            .addCase(fetchRiskAssessmentTypes.rejected, (state, action) => {
                state.riskAssessmentTypesLoading = false;
                state.riskAssessmentTypesError = action.error.message;
            })
            .addCase(fetchLikelihoodOptions.pending, (state) => {
                state.likelihoodOptionsLoading = true;
                state.likelihoodOptionsError = null;
            })
            .addCase(fetchLikelihoodOptions.fulfilled, (state, action) => {
                state.likelihoodOptionsLoading = false;
                state.likelihoodOptions = action.payload;
            })
            .addCase(fetchLikelihoodOptions.rejected, (state, action) => {
                state.likelihoodOptionsLoading = false;
                state.likelihoodOptionsError = action.error.message;
            })
            .addCase(fetchSeverityOptions.pending, (state) => {
                state.severityOptionsLoading = true;
                state.severityOptionsError = null;
            })
            .addCase(fetchSeverityOptions.fulfilled, (state, action) => {
                state.severityOptionsLoading = false;
                state.severityOptions = action.payload;
            })
            .addCase(fetchSeverityOptions.rejected, (state, action) => {
                state.severityOptionsLoading = false;
                state.severityOptionsError = action.error.message;
            })
            .addCase(fetchAssessmentStatusOptions.pending, (state) => {
                state.assessmentStatusOptionsLoading = true;
                state.assessmentStatusOptionsError = null;
            })
            .addCase(fetchAssessmentStatusOptions.fulfilled, (state, action) => {
                state.assessmentStatusOptionsLoading = false;
                state.assessmentStatusOptions = action.payload;
            })
            .addCase(fetchAssessmentStatusOptions.rejected, (state, action) => {
                state.assessmentStatusOptionsLoading = false;
                state.assessmentStatusOptionsError = action.error.message;
            });
    },
});

export const { clearRiskAssessments } = riskAssessmentsSlice.actions;
export default riskAssessmentsSlice.reducer; 