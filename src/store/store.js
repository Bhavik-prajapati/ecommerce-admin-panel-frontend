// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import dashboardReducer from "./dashboardSlice";
import orderReducer from "./orderSlice";
import productReducer from "./productSlice";
import categoryReducer from "./categoriesSlice";


const store = configureStore({
  reducer: {
    theme: themeReducer,
    dashboard:dashboardReducer,
    order:orderReducer,
    products:productReducer,
    categories:categoryReducer
  },
});

export default store;
