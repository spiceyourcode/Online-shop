import { useSelector, useDispatch } from "react-redux";
import api from "../api/axios";
import { clearCart } from "../features/cartsSlice";
import { useState } from "react";

function Checkout() {
    const { items, total } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleCheckOut = async () => {
        try {
            setLoading(true);

            // Step 1: Create order in backend
            const order = {
                items: items.map((i) => ({
                    product: i.product.id,
                    quantity: i.quantity,
                })),
                total: total,
            };

            const orderResponse = await api.post("/orders/", order);

            // Step 2: Initialize payment
            const paymentResponse = await api.post("/payments/initiate/", {
                order_id: orderResponse.data.id,
                amount: total,
            });

            // Step 3: Redirect or handle in-app
            if (paymentResponse.data.redirect_url) {
                window.location.href = paymentResponse.data.redirect_url;
            } else {
                dispatch(clearCart());
                alert("Order placed and payment processed successfully!");
            }
        } catch (error) {
            console.error(error);
            alert("Checkout failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Checkout</h2>
            <p>Total: {total} Ksh</p>
            <button onClick={handleCheckOut} disabled={loading}>
                {loading ? "Processing..." : "Place Order & Pay"}
            </button>
        </div>
    );
}

export default Checkout;
