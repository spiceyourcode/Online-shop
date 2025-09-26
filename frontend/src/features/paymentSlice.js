import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axios";

// asyncthunk to initiate the payments 
export const initiatePayment = createAsyncThunk(
    "payments/initiate", 
    async ({orderId, amount}) =>{
        const response = await api.post("/payments/initiate/",{
            orderId : orderId, 
            amount : amount
        });
        return response.data;
    }    
);

const paymentSlice = createSlice ({
    name:"payments", 
    initialState:{
     status : "idle", //  idle| loading| succeeded| failed
     error : null , 
     redirectUrl:null,  
    }, 

    reducers: {
        resetPayment: (state) =>{
            state.status ="idle";
            state.error = null;
            state.redirectUrl = null;
        }
    },
    extraReducers : (builder) =>{
        builder
        .addCase(initiatePayment.pending, (state)=>{
            state.status = "loading";
            state.error = null;
            state.redirectUrl = null;
        })
        .addCase(initiatePayment.fulfilled, (state, action)=>{
            state.status = "succeeded";
            state.redirectUrl = action.payload.redirect_url || null
        })
        .addCase(initiatePayment.rejected, (state, action)=>{
            state.status = "failed";
            state.error = action.error.message;
        });
    }
})

export default paymentSlice.reducer
export const {resetPayment} = paymentSlice.actions