import {useSelector, useDispatch} from "react-redux";
import api from "../api/axios";
import {clearCart} from "../features/cartsSlice"

function Checkout(){
    const{items } = useSelector( (state) => state.cart);
    const dispatch = useDispatch();

    const handleCheckOut = async () => {
        try{
            const order = {
                items: items.map((i)=>({
                    product: i.product.id,
                    quantity: i.quantity,
                })),
            };
            await api.post("/orders/", order);
            dispatch(clearCart());
            alert("Order placed successfully!");
        }
        catch(error){
            console.error(error);
            alert("Checkout failed. ");

        }
    };

    return(
        <div>
            <h2>
                Checkout
            </h2>
            <button onClick={handleCheckOut}> Place Order</button>
        </div>
    );
}

export default Checkout;