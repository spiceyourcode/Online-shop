import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchProducts = createAsyncThunk(
    "products/fetchAll",
    async () => {
        const response = await api.get(`/products/`)
        return response.data;
    }
);

export const fetchProduct = createAsyncThunk (
    "products/fetchOne",
    async () =>{
        const response = await api.get(`/products/${id}`);
        return response.data;
    }
);

const productSlice = createSlice({
    name: "product",
    initialState: {
        items :[],
        selected: null,
        status : "idle",
        error : null, 
    },
    reducers :{},
    extraReducers : (builder)=>{
        builder
        .addCase(fetchProduct.fulfilled,(state, action)=>{
            state.selected = action.payload
        })
        .addCase(fetchProducts.fulfilled, (state, action) =>{
            state.items = action.payload;
            state.status = "succeeded";
        });
    },

});

export default productSlice.reducer;