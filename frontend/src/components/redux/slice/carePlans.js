import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_URL } from "../../../main";

// Async thunks
export const fetchClientCarePlans = createAsyncThunk(
    'carePlans/fetchClientCarePlans',
    async (clientId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/clients/${clientId}/care-plans`, { withCredentials: true });
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchClientCarePlans:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchActiveCarePlan = createAsyncThunk(
    'carePlans/fetchActiveCarePlan',
    async (clientId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/clients/${clientId}/care-plans/active`, { withCredentials: true });
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchActiveCarePlan:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchCarePlanHistory = createAsyncThunk(
    'carePlans/fetchCarePlanHistory',
    async (clientId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/clients/${clientId}/care-plans/history`, { withCredentials: true });
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchCarePlanHistory:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchCarePlanById = createAsyncThunk(
    'carePlans/fetchCarePlanById',
    async (carePlanId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/care-plans/${carePlanId}`, { withCredentials: true });
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchCarePlanById:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const restoreCarePlan = createAsyncThunk(
    'carePlans/restoreCarePlan',
    async ({ carePlanId, clientId }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/care-plans/${carePlanId}/restore`, { clientId }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data.data;
        } catch (error) {
            console.error('Error in restoreCarePlan:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const createCarePlan = createAsyncThunk(
    'carePlans/createCarePlan',
    async ({ clientId, carePlanData }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/clients/${clientId}/care-plans`, carePlanData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data.data.carePlan;
        } catch (error) {
            console.error('Error in createCarePlan:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateCarePlan = createAsyncThunk(
    'carePlans/updateCarePlan',
    async ({ carePlanId, carePlanData }, { rejectWithValue }) => {
        try {
            console.log("Updating care plan", carePlanId, carePlanData);
            // Add clientId to the request body as required by the backend
            const requestData = {
                ...carePlanData,
                clientId: carePlanData.clientId || carePlanData.client // fallback for different field names
            };
            const response = await axios.patch(`${API_URL}/care-plans/${carePlanId}`, requestData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log("Care Plan updated successfully:", response.data);
            return response.data.data.carePlan;
        } catch (error) {
            console.error("Error updating care plan:", error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteCarePlan = createAsyncThunk(
    'carePlans/deleteCarePlan',
    async (carePlanId, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/care-plans/${carePlanId}`, { withCredentials: true });
            return carePlanId;
        } catch (error) {
            console.error('Error in deleteCarePlan:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const carePlansSlice = createSlice({
    name: 'carePlans',
    initialState: {
        items: [],
        activeCarePlan: null,
        history: [],
        selectedCarePlan: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCarePlans: (state) => {
            state.items = [];
            state.activeCarePlan = null;
            state.history = [];
            state.loading = false;
            state.error = null;
        },
        setActiveCarePlan: (state, action) => {
            state.activeCarePlan = action.payload;
        },
        setSelectedCarePlan: (state, action) => {
            state.selectedCarePlan = action.payload;
        },
        clearSelectedCarePlan: (state) => {
            state.selectedCarePlan = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch client care plans
            .addCase(fetchClientCarePlans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClientCarePlans.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchClientCarePlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch active care plan
            .addCase(fetchActiveCarePlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActiveCarePlan.fulfilled, (state, action) => {
                state.loading = false;
                state.activeCarePlan = action.payload;
            })
            .addCase(fetchActiveCarePlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch care plan history
            .addCase(fetchCarePlanHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCarePlanHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload;
            })
            .addCase(fetchCarePlanHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch care plan by ID
            .addCase(fetchCarePlanById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCarePlanById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCarePlan = action.payload;
            })
            .addCase(fetchCarePlanById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Restore care plan
            .addCase(restoreCarePlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(restoreCarePlan.fulfilled, (state, action) => {
                state.loading = false;
                state.activeCarePlan = action.payload;
                // Update in items
                const index = state.items.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    state.items.unshift(action.payload);
                }
            })
            .addCase(restoreCarePlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Create care plan
            .addCase(createCarePlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCarePlan.fulfilled, (state, action) => {
                state.loading = false;
                state.activeCarePlan = action.payload;
                // Add to items if not already present
                const exists = state.items.find(item => item._id === action.payload._id);
                if (!exists) {
                    state.items.unshift(action.payload);
                }
            })
            .addCase(createCarePlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Update care plan
            .addCase(updateCarePlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCarePlan.fulfilled, (state, action) => {
                state.loading = false;
                state.activeCarePlan = action.payload;
                // Update in items
                const index = state.items.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    state.items.unshift(action.payload);
                }
            })
            .addCase(updateCarePlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Delete care plan
            .addCase(deleteCarePlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCarePlan.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(item => item._id !== action.payload);
                if (state.activeCarePlan && state.activeCarePlan._id === action.payload) {
                    state.activeCarePlan = null;
                }
            })
            .addCase(deleteCarePlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearCarePlans, setActiveCarePlan, setSelectedCarePlan, clearSelectedCarePlan } = carePlansSlice.actions;
export default carePlansSlice.reducer; 