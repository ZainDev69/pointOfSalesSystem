import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from "../../../main";

// Fetch all risk assessments for a client
export const fetchRiskAssessments = createAsyncThunk(
    'riskAssessments/fetchRiskAssessments',
    async (clientId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/risk-assessments/client/${clientId}`);
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchRiskAssessments:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Add a new risk assessment
export const addRiskAssessment = createAsyncThunk(
    'riskAssessments/addRiskAssessment',
    async (assessment, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/risk-assessments`, assessment);
            return response.data.data;
        } catch (error) {
            console.error('Error in addRiskAssessment:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Edit a risk assessment
export const editRiskAssessment = createAsyncThunk(
    'riskAssessments/editRiskAssessment',
    async ({ id, assessment }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/risk-assessments/${id}`, assessment);
            return response.data.data;
        } catch (error) {
            console.error('Error in editRiskAssessment:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Delete a risk assessment
export const deleteRiskAssessment = createAsyncThunk(
    'riskAssessments/deleteRiskAssessment',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/risk-assessments/${id}`);
            return id;
        } catch (error) {
            console.error('Error in deleteRiskAssessment:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Fetch risk assessment types
export const fetchRiskAssessmentTypes = createAsyncThunk(
    'riskAssessments/fetchRiskAssessmentTypes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/risk-assessments/types`);
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchRiskAssessmentTypes:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Fetch likelihood options
export const fetchLikelihoodOptions = createAsyncThunk(
    'riskAssessments/fetchLikelihoodOptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/risk-assessments/likelihood-options`);
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchLikelihoodOptions:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Fetch severity options
export const fetchSeverityOptions = createAsyncThunk(
    'riskAssessments/fetchSeverityOptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/risk-assessments/severity-options`);
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchSeverityOptions:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Fetch risk level options
export const fetchRiskLevelOptions = createAsyncThunk(
    'riskAssessments/fetchRiskLevelOptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/risk-assessments/risk-level-options`);
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchRiskLevelOptions:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Fetch overall risk options
export const fetchOverallRiskOptions = createAsyncThunk(
    'riskAssessments/fetchOverallRiskOptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/risk-assessments/overall-risk-options`);
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchOverallRiskOptions:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Fetch assessment status options
export const fetchAssessmentStatusOptions = createAsyncThunk(
    'riskAssessments/fetchAssessmentStatusOptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/risk-assessments/assessment-status-options`);
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchAssessmentStatusOptions:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Fetch control measure type options
export const fetchControlMeasureTypeOptions = createAsyncThunk(
    'riskAssessments/fetchControlMeasureTypeOptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/risk-assessments/control-measure-type-options`);
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchControlMeasureTypeOptions:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Fetch control measure status options
export const fetchControlMeasureStatusOptions = createAsyncThunk(
    'riskAssessments/fetchControlMeasureStatusOptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/risk-assessments/control-measure-status-options`);
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchControlMeasureStatusOptions:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Fetch control measure effectiveness options
export const fetchControlMeasureEffectivenessOptions = createAsyncThunk(
    'riskAssessments/fetchControlMeasureEffectivenessOptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/risk-assessments/control-measure-effectiveness-options`);
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchControlMeasureEffectivenessOptions:', error);
            return rejectWithValue(error.message);
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
        riskLevelOptions: [],
        riskLevelOptionsLoading: false,
        riskLevelOptionsError: null,
        overallRiskOptions: [],
        overallRiskOptionsLoading: false,
        overallRiskOptionsError: null,
        assessmentStatusOptions: [],
        assessmentStatusOptionsLoading: false,
        assessmentStatusOptionsError: null,
        controlMeasureTypeOptions: [],
        controlMeasureTypeOptionsLoading: false,
        controlMeasureTypeOptionsError: null,
        controlMeasureStatusOptions: [],
        controlMeasureStatusOptionsLoading: false,
        controlMeasureStatusOptionsError: null,
        controlMeasureEffectivenessOptions: [],
        controlMeasureEffectivenessOptionsLoading: false,
        controlMeasureEffectivenessOptionsError: null,
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
            state.riskLevelOptions = [];
            state.riskLevelOptionsLoading = false;
            state.riskLevelOptionsError = null;
            state.overallRiskOptions = [];
            state.overallRiskOptionsLoading = false;
            state.overallRiskOptionsError = null;
            state.assessmentStatusOptions = [];
            state.assessmentStatusOptionsLoading = false;
            state.assessmentStatusOptionsError = null;
            state.controlMeasureTypeOptions = [];
            state.controlMeasureTypeOptionsLoading = false;
            state.controlMeasureTypeOptionsError = null;
            state.controlMeasureStatusOptions = [];
            state.controlMeasureStatusOptionsLoading = false;
            state.controlMeasureStatusOptionsError = null;
            state.controlMeasureEffectivenessOptions = [];
            state.controlMeasureEffectivenessOptionsLoading = false;
            state.controlMeasureEffectivenessOptionsError = null;
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
            .addCase(fetchRiskLevelOptions.pending, (state) => {
                state.riskLevelOptionsLoading = true;
                state.riskLevelOptionsError = null;
            })
            .addCase(fetchRiskLevelOptions.fulfilled, (state, action) => {
                state.riskLevelOptionsLoading = false;
                state.riskLevelOptions = action.payload;
            })
            .addCase(fetchRiskLevelOptions.rejected, (state, action) => {
                state.riskLevelOptionsLoading = false;
                state.riskLevelOptionsError = action.error.message;
            })
            .addCase(fetchOverallRiskOptions.pending, (state) => {
                state.overallRiskOptionsLoading = true;
                state.overallRiskOptionsError = null;
            })
            .addCase(fetchOverallRiskOptions.fulfilled, (state, action) => {
                state.overallRiskOptionsLoading = false;
                state.overallRiskOptions = action.payload;
            })
            .addCase(fetchOverallRiskOptions.rejected, (state, action) => {
                state.overallRiskOptionsLoading = false;
                state.overallRiskOptionsError = action.error.message;
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
            })
            .addCase(fetchControlMeasureTypeOptions.pending, (state) => {
                state.controlMeasureTypeOptionsLoading = true;
                state.controlMeasureTypeOptionsError = null;
            })
            .addCase(fetchControlMeasureTypeOptions.fulfilled, (state, action) => {
                state.controlMeasureTypeOptionsLoading = false;
                state.controlMeasureTypeOptions = action.payload;
            })
            .addCase(fetchControlMeasureTypeOptions.rejected, (state, action) => {
                state.controlMeasureTypeOptionsLoading = false;
                state.controlMeasureTypeOptionsError = action.error.message;
            })
            .addCase(fetchControlMeasureStatusOptions.pending, (state) => {
                state.controlMeasureStatusOptionsLoading = true;
                state.controlMeasureStatusOptionsError = null;
            })
            .addCase(fetchControlMeasureStatusOptions.fulfilled, (state, action) => {
                state.controlMeasureStatusOptionsLoading = false;
                state.controlMeasureStatusOptions = action.payload;
            })
            .addCase(fetchControlMeasureStatusOptions.rejected, (state, action) => {
                state.controlMeasureStatusOptionsLoading = false;
                state.controlMeasureStatusOptionsError = action.error.message;
            })
            .addCase(fetchControlMeasureEffectivenessOptions.pending, (state) => {
                state.controlMeasureEffectivenessOptionsLoading = true;
                state.controlMeasureEffectivenessOptionsError = null;
            })
            .addCase(fetchControlMeasureEffectivenessOptions.fulfilled, (state, action) => {
                state.controlMeasureEffectivenessOptionsLoading = false;
                state.controlMeasureEffectivenessOptions = action.payload;
            })
            .addCase(fetchControlMeasureEffectivenessOptions.rejected, (state, action) => {
                state.controlMeasureEffectivenessOptionsLoading = false;
                state.controlMeasureEffectivenessOptionsError = action.error.message;
            });
    },
});

export const { clearRiskAssessments } = riskAssessmentsSlice.actions;
export default riskAssessmentsSlice.reducer; 