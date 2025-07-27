import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from "../../../main";

// Async thunks
export const fetchCarePlanOutcomes = createAsyncThunk(
    'outcomes/fetchCarePlanOutcomes',
    async (carePlanId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/care-plans/${carePlanId}/outcomes`);
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in fetchCarePlanOutcomes:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const createOutcome = createAsyncThunk(
    'outcomes/createOutcome',
    async ({ carePlanId, outcomeData }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/care-plans/${carePlanId}/outcomes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(outcomeData),
            });
            const data = await response.json();
            return data.data.outcome;
        } catch (error) {
            console.error('Error in createOutcome:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const updateOutcome = createAsyncThunk(
    'outcomes/updateOutcome',
    async ({ outcomeId, outcomeData }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/outcomes/${outcomeId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(outcomeData),
            });
            const data = await response.json();
            return data.data.outcome;
        } catch (error) {
            console.error('Error in updateOutcome:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const deleteOutcome = createAsyncThunk(
    'outcomes/deleteOutcome',
    async (outcomeId, { rejectWithValue }) => {
        try {
            await fetch(`${API_URL}/outcomes/${outcomeId}`, {
                method: 'DELETE',
            });
            return outcomeId;
        } catch (error) {
            console.error('Error in deleteOutcome:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const addOutcomeProgress = createAsyncThunk(
    'outcomes/addOutcomeProgress',
    async ({ outcomeId, progressData }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/outcomes/${outcomeId}/progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(progressData),
            });
            const data = await response.json();
            return data.data.outcome;
        } catch (error) {
            console.error('Error in addOutcomeProgress:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchOutcomeOptions = createAsyncThunk(
    'outcomes/fetchOutcomeOptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/outcomes/options`);
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in fetchOutcomeOptions:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const filterOutcomesByCategory = createAsyncThunk(
    'outcomes/filterOutcomesByCategory',
    async ({ carePlanId, category }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/care-plans/${carePlanId}/outcomes/filter/category?category=${category}`);
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in filterOutcomesByCategory:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const filterOutcomesByStatus = createAsyncThunk(
    'outcomes/filterOutcomesByStatus',
    async ({ carePlanId, status }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/care-plans/${carePlanId}/outcomes/filter/status?status=${status}`);
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in filterOutcomesByStatus:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const filterOutcomes = createAsyncThunk(
    'outcomes/filterOutcomes',
    async ({ carePlanId, filters }, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetch(`${API_URL}/care-plans/${carePlanId}/outcomes/filter?${queryParams}`);
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in filterOutcomes:', error);
            return rejectWithValue(error.message);
        }
    }
);

const outcomesSlice = createSlice({
    name: 'outcomes',
    initialState: {
        items: [],
        loading: false,
        error: null,
        options: {
            status: [],
            priority: [],
            category: []
        },
        optionsLoading: false,
        optionsError: null,
        filters: {
            category: '',
            status: '',
            priority: ''
        },
        filteredItems: [],
        isFiltered: false,
    },
    reducers: {
        clearOutcomes: (state) => {
            state.items = [];
            state.loading = false;
            state.error = null;
        },
        clearOutcomeOptions: (state) => {
            state.options = {
                status: [],
                priority: [],
                category: []
            };
            state.optionsLoading = false;
            state.optionsError = null;
        },
        setFilter: (state, action) => {
            const { filterType, value } = action.payload;
            state.filters[filterType] = value;
        },
        clearFilters: (state) => {
            state.filters = {
                category: '',
                status: '',
                priority: ''
            };
            state.filteredItems = [];
            state.isFiltered = false;
        },
        resetToOriginalItems: (state) => {
            state.filteredItems = [];
            state.isFiltered = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch care plan outcomes
            .addCase(fetchCarePlanOutcomes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCarePlanOutcomes.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCarePlanOutcomes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Create outcome
            .addCase(createOutcome.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOutcome.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
            })
            .addCase(createOutcome.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Update outcome
            .addCase(updateOutcome.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOutcome.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateOutcome.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Delete outcome
            .addCase(deleteOutcome.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOutcome.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(item => item._id !== action.payload);
            })
            .addCase(deleteOutcome.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Add outcome progress
            .addCase(addOutcomeProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addOutcomeProgress.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(addOutcomeProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch outcome options
            .addCase(fetchOutcomeOptions.pending, (state) => {
                state.optionsLoading = true;
                state.optionsError = null;
            })
            .addCase(fetchOutcomeOptions.fulfilled, (state, action) => {
                state.optionsLoading = false;
                state.options = action.payload;
            })
            .addCase(fetchOutcomeOptions.rejected, (state, action) => {
                state.optionsLoading = false;
                state.optionsError = action.error.message;
            })

            // Filter outcomes by category
            .addCase(filterOutcomesByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(filterOutcomesByCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.filteredItems = action.payload;
                state.isFiltered = true;
            })
            .addCase(filterOutcomesByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Filter outcomes by status
            .addCase(filterOutcomesByStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(filterOutcomesByStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.filteredItems = action.payload;
                state.isFiltered = true;
            })
            .addCase(filterOutcomesByStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Filter outcomes by multiple criteria
            .addCase(filterOutcomes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(filterOutcomes.fulfilled, (state, action) => {
                state.loading = false;
                state.filteredItems = action.payload;
                state.isFiltered = true;
            })
            .addCase(filterOutcomes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearOutcomes, clearOutcomeOptions, setFilter, clearFilters, resetToOriginalItems } = outcomesSlice.actions;
export default outcomesSlice.reducer; 