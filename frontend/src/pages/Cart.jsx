import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "../features/cartsSlice";

function Cart() {
    const { items } = useSelector((state) => state.cart);
    const dispatch = useDispatch;

    const total = items.reduce(
        (acc, item) => acc + items.prodcut.price * item.quantity,
        0
    );
    return (
        <div>
            <h2>
                Your Cart
            </h2>
            {items.length == 0 ?
                (<p>The cart is empty</p>) :
                (
                    <>
                        <ul>
                            {items.map(({ product, quantity }) => (
                                <li key={product.id}>
                                    {product.name} - {product.price}ksh x{" "}
                                    <input
                                        type="number"
                                        value={quantity}
                                        min="1"
                                        onChange={(e) => {
                                            dispatch(updateQuantity({
                                                id: product.id,
                                                quantity: +e.target.value
                                            })
                                            )
                                        }
                                        }
                                    />
                                    <button onClick={() => dispatch(removeFromCart(product.id))}>
                                        Remove
                                    </button>
                                </li>
                            ))}

                        </ul>

                    </>
                )
            }
        </div>
    )
}