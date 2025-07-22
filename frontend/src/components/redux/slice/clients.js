import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../main";


export const createClient = createAsyncThunk(
    "clients/createClient",
    async (clientData, { rejectWithValue }) => {
        try {
            console.log("Calling the createClient")

            const response = await axios.post(`${API_URL}/clients`, clientData, {
                withCredentials: true, headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log("The Client is Saved into DB")
            return response.data.data;
        } catch (error) {
            if (error.response?.status === 400) {
                return rejectWithValue({ message: error.response.data.errors });
            }
            return rejectWithValue({ message: 'Unknown error' });
        }
    }
);


export const clientList = createAsyncThunk(
    "clients/getClients",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/clients`, { withCredentials: true });
            return response.data.data;

        } catch (error) {
            return rejectWithValue({ message: error.response.data.message });
        }
    }
)

export const getClient = createAsyncThunk(
    "clients/getClient",
    async (clientId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/clients/${clientId}`, {
                withCredentials: true,
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue({ message: error.response.data.message });
        }
    }
);


export const deleteClient = createAsyncThunk(
    "clients/deleteClient",
    async (clientId, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/clients/${clientId}`, { withCredentials: true });
            return clientId;
        } catch (error) {
            return rejectWithValue({ message: error.response.data.message });
        }
    }
)


export const updateClient = createAsyncThunk(
    "clients/updateClient",
    async ({ clientId, clientData }, { rejectWithValue }) => {
        try {
            console.log("Calling the updateClient", clientId)
            const response = await axios.patch(`${API_URL}/clients/${clientId}`, clientData, { withCredentials: true });
            console.log("The Client is updated")
            return response.data;
        } catch (error) {
            console.log("Error in updateClient:", error);
            return rejectWithValue({ message: error.response?.data?.message || error.message || 'Unknown error' });
        }
    }
)

export const archiveClient = createAsyncThunk(
    "clients/archiveClient",
    async (clientId, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${API_URL}/clients/${clientId}/archive`,
                {},
                { withCredentials: true }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue({ message: error.response.data.message });
        }
    }
);

export const unarchiveClient = createAsyncThunk(
    "clients/unarchiveClient",
    async (clientId, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${API_URL}/clients/${clientId}/unarchive`,
                {},
                { withCredentials: true }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue({ message: error.response?.data?.message || "Error unarchiving client" });
        }
    }
);
export const checkClientId = createAsyncThunk(
    "clients/checkClientId",
    async (clientId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/clients/check-id?clientId=${clientId}`, { withCredentials: true });
            return response.data.data;
        } catch (error) {
            return rejectWithValue({ message: error.response?.data?.message || "Unknown error" });
        }
    }
);


const initialState = {
    clients: [],
    client: null,
    loading: false,
    error: null
}

const clientSlice = createSlice({
    name: "clients",
    initialState,
    extraReducers: (builder) => {
        // Client List
        builder.addCase(clientList.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(clientList.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = action.payload;
            })
            .addCase(clientList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message;
            })
            //Get Single Client
            .addCase(getClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getClient.fulfilled, (state, action) => {
                state.loading = false;
                state.client = action.payload;
            })
            .addCase(getClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message;
            })

            // Creating a new Client
            .addCase(createClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createClient.fulfilled, (state, action) => {
                state.loading = false;
                state.clients.push(action.payload);
            })
            .addCase(createClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message;
            })


            // Updating the Client
            .addCase(updateClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateClient.fulfilled, (state, action) => {
                state.loading = false;

                const index = state.clients.findIndex((client) => client._id === action.payload._id);
                if (index !== -1) {
                    state.clients[index] = action.payload;
                }
            })
            .addCase(updateClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message;
            })

            // Deleting the User
            .addCase(deleteClient.pending, (state) => {
                state.loading = true;
            }).addCase(deleteClient.fulfilled, (state, action) => {
                state.loading = false;
                const deletedClientId = action.payload;
                state.clients = state.clients.filter((client) => client._id !== deletedClientId);

            }).addCase(deleteClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message;
            })
            // Archiving the Clients 
            .addCase(archiveClient.pending, (state) => {
                state.loading = true;
            })
            .addCase(archiveClient.fulfilled, (state, action) => {
                state.loading = false;
                const updatedClient = action.payload;
                const index = state.clients.findIndex((client) => client._id === updatedClient._id);
                if (index !== -1) {
                    state.clients[index] = updatedClient;
                }
            })
            .addCase(archiveClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message;
            })

            // Unarchiving the Clients
            .addCase(unarchiveClient.pending, (state) => {
                state.loading = true;
            })
            .addCase(unarchiveClient.fulfilled, (state, action) => {
                state.loading = false;
                const updatedClient = action.payload;
                const index = state.clients.findIndex((c) => c._id === updatedClient._id);
                if (index !== -1) {
                    state.clients[index] = updatedClient;
                }
            })
            .addCase(unarchiveClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message;
            });


    }
})


export const getClients = (state) => state.clients.clients;
export const getSingleClient = (state) => state.clients.client;

export default clientSlice.reducer;