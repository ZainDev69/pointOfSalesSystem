import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Async thunks
export const fetchClientCarePlans = createAsyncThunk(
    'carePlans/fetchClientCarePlans',
    async (clientId) => {
        const response = await fetch(`${API_BASE_URL}/clients/${clientId}/care-plans`);
        const data = await response.json();
        return data.data;
    }
);

export const fetchActiveCarePlan = createAsyncThunk(
    'carePlans/fetchActiveCarePlan',
    async (clientId) => {
        const response = await fetch(`${API_BASE_URL}/clients/${clientId}/care-plans/active`);
        const data = await response.json();
        return data.data;
    }
);

export const fetchCarePlanHistory = createAsyncThunk(
    'carePlans/fetchCarePlanHistory',
    async (clientId) => {
        const response = await fetch(`${API_BASE_URL}/clients/${clientId}/care-plans/history`);
        const data = await response.json();
        return data.data;
    }
);

export const createCarePlan = createAsyncThunk(
    'carePlans/createCarePlan',
    async ({ clientId, carePlanData }) => {
        const response = await fetch(`${API_BASE_URL}/clients/${clientId}/care-plans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(carePlanData),
        });
        const data = await response.json();
        return data.data.carePlan;
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

            const response = await fetch(`${API_BASE_URL}/care-plans/${carePlanId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("API Error:", errorData);
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Care Plan updated successfully:", data);
            return data.data.carePlan;
        } catch (error) {
            console.error("Error updating care plan:", error);
            return rejectWithValue(error.message);
        }
    }
);

export const deleteCarePlan = createAsyncThunk(
    'carePlans/deleteCarePlan',
    async (carePlanId) => {
        await fetch(`${API_BASE_URL}/care-plans/${carePlanId}`, {
            method: 'DELETE',
        });
        return carePlanId;
    }
);

const carePlansSlice = createSlice({
    name: 'carePlans',
    initialState: {
        items: [],
        activeCarePlan: null,
        history: [],
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

export const { clearCarePlans, setActiveCarePlan } = carePlansSlice.actions;
export default carePlansSlice.reducer; 