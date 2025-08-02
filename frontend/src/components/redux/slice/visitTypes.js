import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Async thunks
export const fetchClientVisitTypes = createAsyncThunk(

    'visitTypes/fetchClientVisitTypes',
    async (clientId) => {
        const response = await fetch(`${backendUrl}/clients/${clientId}/visit-types`);
        const data = await response.json();
        return data.data.visitTypes;
    }
);

export const fetchRequiredTaskOptions = createAsyncThunk(
    'visitTypes/fetchRequiredTaskOptions',
    async () => {

        const response = await fetch(`${backendUrl}/visit-types/options`);
        console.log('Response status:', response.status);
        const data = await response.json();

        return data.data.requiredTasks;
    }
);

export const createVisitType = createAsyncThunk(
    'visitTypes/createVisitType',
    async ({ clientId, visitTypeData }, { rejectWithValue }) => {
        try {


            const response = await fetch(`${backendUrl}/clients/${clientId}/visit-types`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(visitTypeData),
            });



            if (!response.ok) {
                const errorData = await response.json();
                console.error('Backend error:', errorData);
                return rejectWithValue(errorData.message || 'Failed to create visit type');
            }

            const data = await response.json();

            return data.data.visitType;
        } catch (error) {
            console.error('Network error:', error);
            return rejectWithValue(error.message || 'Network error');
        }
    }
);

export const updateVisitType = createAsyncThunk(
    'visitTypes/updateVisitType',
    async ({ id, visitTypeData }) => {
        const response = await fetch(`${backendUrl}/visit-types/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(visitTypeData),
        });
        const data = await response.json();
        return data.data.visitType;
    }
);

export const deleteVisitType = createAsyncThunk(
    'visitTypes/deleteVisitType',
    async (id) => {
        await fetch(`${backendUrl}/visit-types/${id}`, {
            method: 'DELETE',
        });
        return id;
    }
);

export const addNewTaskOption = createAsyncThunk(
    'visitTypes/addNewTaskOption',
    async (taskOption) => {
        const response = await fetch(`${backendUrl}/visit-types/task-options`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ taskOption }),
        });
        const data = await response.json();
        return data.data.taskOption;
    }
);

export const deleteTaskOption = createAsyncThunk(
    'visitTypes/deleteTaskOption',
    async (taskOptionName, { rejectWithValue }) => {
        try {
            const response = await fetch(`${backendUrl}/visit-types/task-options/${taskOptionName}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || 'Failed to delete task option');
            }

            return taskOptionName;
        } catch (error) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
);

const initialState = {
    visitTypes: [],
    requiredTaskOptions: [],
    loading: false,
    error: null,
    currentVisitType: null,
};

const visitTypesSlice = createSlice({
    name: 'visitTypes',
    initialState,
    reducers: {
        setCurrentVisitType: (state, action) => {
            state.currentVisitType = action.payload;
        },
        clearCurrentVisitType: (state) => {
            state.currentVisitType = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch client visit types
            .addCase(fetchClientVisitTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClientVisitTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.visitTypes = action.payload;
            })
            .addCase(fetchClientVisitTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch required task options
            .addCase(fetchRequiredTaskOptions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRequiredTaskOptions.fulfilled, (state, action) => {
                state.loading = false;
                state.requiredTaskOptions = action.payload;
                console.log('Fetched required task options:', action.payload);
            })
            .addCase(fetchRequiredTaskOptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                console.error('Error fetching required task options:', action.error);
            })

            // Create visit type
            .addCase(createVisitType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createVisitType.fulfilled, (state, action) => {
                state.loading = false;
                state.visitTypes.unshift(action.payload);
            })
            .addCase(createVisitType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Update visit type
            .addCase(updateVisitType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateVisitType.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.visitTypes.findIndex(vt => vt._id === action.payload._id);
                if (index !== -1) {
                    state.visitTypes[index] = action.payload;
                }
            })
            .addCase(updateVisitType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Delete visit type
            .addCase(deleteVisitType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteVisitType.fulfilled, (state, action) => {
                state.loading = false;
                state.visitTypes = state.visitTypes.filter(vt => vt._id !== action.payload);
            })
            .addCase(deleteVisitType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Add new task option
            .addCase(addNewTaskOption.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addNewTaskOption.fulfilled, (state, action) => {
                state.loading = false;
                state.requiredTaskOptions.push(action.payload);
                // Sort the array to maintain order
                state.requiredTaskOptions.sort();
            })
            .addCase(addNewTaskOption.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Delete task option
            .addCase(deleteTaskOption.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTaskOption.fulfilled, (state, action) => {
                state.loading = false;
                state.requiredTaskOptions = state.requiredTaskOptions.filter(
                    task => task !== action.payload
                );
            })
            .addCase(deleteTaskOption.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setCurrentVisitType, clearCurrentVisitType, clearError } = visitTypesSlice.actions;
export default visitTypesSlice.reducer; 