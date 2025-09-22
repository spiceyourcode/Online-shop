import { configureStore } from "@reduxjs/toolkit";  //this is the store to hold the app state
import authReducer from "../features/authSlice"; 
import productsReducer from "../features/productsSlice"
//reducer - function that updtaes states based on actions 


export const store = configureStore({
    reducer: {
        // This manages authentication state (login/loggedout)
        auth : authReducer,
        products: productsReducer,
    },
});