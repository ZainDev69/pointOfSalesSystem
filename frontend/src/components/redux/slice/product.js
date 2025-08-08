import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const getProducts = createAsyncThunk(
    "products/getProducts",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`, { withCredentials: true });
            return res.data.data;

        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)
export const getSingleProduct = createAsyncThunk(
    "products/getSingleProduct",
    async (productId, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/${productId}`, { withCredentials: true });
            return res.data.data;

        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)


export const addProduct = createAsyncThunk(
    "products/addProduct",
    async (values, { rejectWithValue }) => {
        try {
            console.log("Creating the Product")
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/products`, values, { withCredentials: true });
            console.log("The Product is added into DB")
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)


export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/products/${id}`, productData, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (productId, { rejectWithValue }) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/products/${productId}`, { withCredentials: true });
            return productId;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)


export const updateBulk = createAsyncThunk(
    "products/updateBulk",
    async (productsData, { rejectWithValue }) => {
        console.log(productsData);
        try {
            const res = await axios.patch(`${import.meta.env.VITE_API_URL}/products`, productsData, { withCredentials: true });
            return res.data.updatedProducts;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)




const initialState = {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null
}


const productSlice = createSlice({
    name: "products",
    initialState,
    extraReducers: (builder) => {
        // Get All Products
        builder.addCase(getProducts.pending, (state) => {
            state.loading = true;
            state.error = null;

        }).addCase(getProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload;
        }).addCase(getProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;

            // Now for single Product
        }).addCase(getSingleProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(getSingleProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedProduct = action.payload;
        }).addCase(getSingleProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;

            // Add a Product
        }).addCase(addProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(addProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.products.push(action.payload.data);
        }).addCase(addProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

            // Update a Product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            }).addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex((product => product._id === action.payload._id));
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            }).addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Product
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            }).addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter((product) => product._id !== action.payload)
            }).addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Bulk 
            .addCase(updateBulk.pending, (state) => {
                state.loading = true;
                state.error = null;
            }).addCase(updateBulk.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.map((product) => {
                    const updatedProduct = action.payload.find((p) => p._id === product._id);
                    return updatedProduct ? updatedProduct : product;
                })
            })

    }
})



export default productSlice.reducer;

