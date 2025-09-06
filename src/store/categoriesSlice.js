import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../api/apiClient";

// Fetch all categories
export const fetchCategoriesData = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/categories", {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Server Error");
    }
  }
);

// Add a new category
export const addCategoriesData = createAsyncThunk(
  "categories/addCategory",
  async ({ category, description }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        "/categories",
        { category, description },
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Server Error");
    }
  }
);

//update category code..
export const updateCategoryData = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, name, description }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `/categories/${id}`,
        { name, description },
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Server Error");
    }
  }
);
//update category code..
export const deleteCategoryData = createAsyncThunk(
  "categories/deleteCategoryData",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(
        `/categories/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Server Error");
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    // Fetch categories
    builder
      .addCase(fetchCategoriesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesData.fulfilled, (state, action) => {
        debugger;
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCategoriesData.rejected, (state, action) => {
        debugger;

        state.loading = false;
        state.error = action.payload;
      });

    // Add category
    builder
      .addCase(addCategoriesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategoriesData.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload); // add the new category to existing data
      })
      .addCase(addCategoriesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      //update code 
       builder
      .addCase(updateCategoryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategoryData.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.data.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) {
          state.data[idx] = action.payload;
        }
      })
      .addCase(updateCategoryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      //delete code 
       builder
      .addCase(deleteCategoryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategoryData.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg.id;
        state.data = state.data.filter((cat) => cat.id !== deletedId);
      })
      .addCase(deleteCategoryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categoriesSlice.reducer;
