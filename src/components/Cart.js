import React, { useEffect, useState } from "react";
import { getCart, updateItemQuantity, removeFromCart } from "../services/cart";
import { placeOrder } from "../services/orders";
import { getUserProfile } from "../services/user";

function Cart({ userId, cart, setCart }) {
    const [shippingAddress, setShippingAddress] = useState("");
    const [placingOrder, setPlacingOrder] = useState(false);

    useEffect(() => {
        if (!userId) return;

        getUserProfile(userId)
            .then(res => {
                const address = res.data.shippingAddress;
                if (address) {
                    setShippingAddress(address);
                }
            })
            .catch(err => console.error("Failed to load user profile", err));
    }, [userId]);

    const handleQuantityChange = (productId, newQty) => {
        if (newQty < 1) return;

        updateItemQuantity(userId, productId, newQty)
            .then(res => setCart(res.data))
            .catch(err => {
                console.error("Error updating quantity", err);

                const errorMessage = err.response?.data?.message;

                if (errorMessage) {
                    alert(errorMessage);
                } else {
                    alert("Failed to update quantity.");
                }
            });
    };

    const handleRemove = (productId) => {
        removeFromCart(userId, productId)
            .then(res => setCart(res.data))
            .catch(err => console.error("Error removing item", err));
    };

    const handlePlaceOrder = () => {
        if (!shippingAddress.trim()) {
            alert("Please enter a shipping address");
            return;
        }

        setPlacingOrder(true);

        placeOrder(userId, shippingAddress)
            .then(res => {
                alert(`Order #${res.data.orderNumber} placed successfully!`);
                setShippingAddress("");
                return getCart(userId);
            })
            .then(cartRes => setCart(cartRes.data))
            .catch(err => {
                console.error("Error placing order", err);
                alert("Failed to place order.");
            })
            .finally(() => setPlacingOrder(false));
    };

    if (!cart) return <p>Loading cart...</p>;

    return (
        <div className="container mt-4">
            <h3>Your Cart</h3>

            {cart.missingProducts && cart.missingProducts.length > 0 && (
                <div className="alert alert-warning">
                    <strong>Some products are no longer available:</strong>
                    <ul className="mb-0">
                        {cart.missingProducts.map(product => (
                            <li key={product.id}>{product.name}</li>
                        ))}
                    </ul>
                    They have been removed from your cart.
                </div>
            )}

            <ul className="list-group mb-3">
                {cart.items.map(item => (
                    <li key={item.productId} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{item.productName}</strong> — ${item.price}
                            <br />
                            <div className="mt-1">
                                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}>-</button>
                                <span>{item.quantity}</span>
                                <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}>+</button>
                            </div>
                        </div>
                        <button className="btn btn-sm btn-danger" onClick={() => handleRemove(item.productId)}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
            <p><strong>Total:</strong> ${cart.totalPrice}</p>

            <div className="card p-3 mt-4">
                <h5>Shipping</h5>
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Enter shipping address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                />
                <button
                    className="btn btn-success"
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                >
                    {placingOrder ? "Placing Order..." : "Place Order"}
                </button>
            </div>
        </div>
    );
}

export default Cart;