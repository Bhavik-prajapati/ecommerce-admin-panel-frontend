// src/features/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiClient from "../api/apiClient";

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ orderId, payment_status, expected_delivery_date }, { rejectWithValue }) => {
    try {   
      const response = await apiClient.put(
        `/admin/orders/${orderId}`,
        { payment_status, expected_delivery_date },
        { withCredentials: true }
      );
      return response.data; // maybe updated order
    } catch (err) {
      return rejectWithValue(err.response?.data || "Server Error");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetOrderState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateOrder.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
