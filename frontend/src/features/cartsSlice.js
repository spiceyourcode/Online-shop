import { createSelector, createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items:[],
    }, 
    reducers:{
        addToCart: (state, action) =>{
            const product = action.payload;
            const existing = state.items.find((item)=> item.prduct.d ===product.id);

            if(existing){
                existing.quantity +=1;
            }else{
                state.items.push({ product, quantity: 1})
            }
        },
        removeFromCart : (state, action) =>{
            state.items = state.items.filter(
                (item) => item.product.id !== action.payload
            );
        },
        updateQuantity : (state, actions) =>{
            const {id , quantity} = actions.payload; 
            const item = state.items.find((i)=>i.product.id ===id);
            if(item){
                item.quantity = quantity; 
            }
        },
        clearCart : (state) => {
            state.items = [];
        }
    }, 

});

export default cartSlice.reducer;
export const {addToCart, updateQuantity, removeFromCart, clearCart} = cartSlice.actions;