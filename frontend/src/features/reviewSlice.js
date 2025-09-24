import api from "../api/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//fetch all reviews for a product 
export const fetchReviews = createAsyncThunk(
    "reviews/fetchAll",
    async (productId) =>{
        const response = await api.get(`/reviews/${productId}/`)
        return response.data.results
    }
);
//submit a new revieẇ
 export const createReview = createAsyncThunk(
    "reviews/create",
    async({productId, review}) =>{
        const response = await api.post(`/reviews/${productId}/`, review);
        return response.data;
    }
 );


const reviewSlice = createSlice({
    name: "reviews", 
    initialState : {
        items :[],
        status : "idle",
        error : null, 
    }, 
    reducers:{},

    extraReducers : (builder)=>{
        builder
        .addCase(fetchReviews.pending, (state)=>{
            state.status = "loading";
        })
        .addCase(fetchReviews.fulfilled, (state, action) =>{
            state.status = "succeeded";
            state.items = action.payload;
        })
        .addCase(createReview.fulfilled, (state, action)=>{
            state.items.push(action.payload); // adding a new review
        })

    },
});

export default reviewSlice.reducer;