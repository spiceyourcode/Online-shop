import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchProducts = createAsyncThunk(
    "products/fetchAll",
    async (params ={}) => {
        const response = await api.get(`/products`,{params})
        return response.data.results;
        
    }
);

export const fetchProduct = createAsyncThunk (
    "products/fetchOne",
    async (slug) => {
        const response = await api.get(`/products/${slug}`);
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
        // fetchProducts cases
        .addCase(fetchProducts.pending, (state) => {
            state.status = "loading";
            state.error = null;
        })
        .addCase(fetchProducts.fulfilled, (state, action) =>{
            state.items = action.payload || [];
            state.status = "succeeded";
        })
        .addCase(fetchProducts.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
            state.items = [];
        })
        // fetchProduct cases
        .addCase(fetchProduct.pending, (state) => {
            state.status = "loading";
        })
        .addCase(fetchProduct.fulfilled,(state, action)=>{
            state.selected = action.payload;
            state.status = "succeeded";
        })
        .addCase(fetchProduct.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        });
    },

});

export default productSlice.reducer;