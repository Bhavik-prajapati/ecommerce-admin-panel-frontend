// src/store/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../api/apiClient";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {limit:10,offset:0}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/products",{params});
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Server Error");
    }
  }
);

// Add a new product
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (newProduct, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/products", newProduct);
      return response.data; // newly created product from backend
    } catch (err) {
      return rejectWithValue(err.response?.data || "Server Error");
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (updatedProduct, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `/products/${updatedProduct.id}`,
        updatedProduct
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Server Error");
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct", // ✅ fixed name
  async ({ id }, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/products/${id}`, { withCredentials: true });
      return id; // return deleted product id to update state
    } catch (err) {
      return rejectWithValue(err.response?.data || "Server Error");
    }
  }
);

//
// --- Slice ---
//
const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products=action.payload.products;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload); // add new product to list
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
