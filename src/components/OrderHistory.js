import React, { useEffect, useState, useCallback } from "react";
import { getOrderHistory } from "../services/orders";
import api from "../services/api";
import { getRoleFromToken } from "../utils/authUtils";

function OrderHistory({ userId }) {
    const [orders, setOrders] = useState([]);
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        getOrderHistory(userId)
            .then(res => setOrders(res.data))
            .catch(err => console.error("Failed to load orders", err));
    }, [userId]);

    useEffect(() => {
        setUserRole(getRoleFromToken());
    }, []);

    const handleReturnItem = useCallback((orderId, productId) => {
        if (!window.confirm("Are you sure you want to return this item?")) return;

        api.post(`/orders/${orderId}/return`, null, {
            params: { productId }
        })
            .then(res => {
                setOrders(prev =>
                    prev.map(order =>
                        order.id === orderId ? res.data : order
                    )
                );
            })
            .catch(err => {
                alert("Failed to return item");
                console.error(err);
            });
    }, []);

    if (!orders.length) return <p className="mt-4">You have no orders yet.</p>;

    return (
        <div className="container mt-4">
            <h3>Order History</h3>
            <ul className="list-group">
                {orders.map(order => (
                    <li key={order.id} className="list-group-item">
                        <strong>Order #{order.orderNumber}</strong> — {new Date(order.createdAt).toLocaleString()}
                        <br />
                        {order.items.map((item, index) => (
                            <div key={`${item.productId}-${index}`}>
                                {item.productName} x{item.quantity} — ${item.price}
                                {!item.returned && userRole === "ROLE_CUSTOMER" && (
                                    <button
                                        className="btn btn-sm btn-outline-danger ms-2"
                                        onClick={() => handleReturnItem(order.id, item.productId)}
                                    >
                                        Return
                                    </button>
                                )}
                                {item.returned && (
                                    <span className="text-success ms-2">(Returned)</span>
                                )}
                            </div>
                        ))}
                        <div><strong>Total:</strong> ${order.totalPrice}</div>
                        <div><strong>Status:</strong> {order.status}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default OrderHistory;
