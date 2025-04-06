import React, { useEffect, useState } from 'react';
import api from '../services/api';

function AdminUserViewer() {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [userProfile, setUserProfile] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const loadUsers = (query) => {
        api.get(`/users?query=${query}`)
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => console.error("Failed to load users", err));
    };

    const handleSelectUser = (e) => {
        const userId = e.target.value;
        setSelectedUserId(userId);
        if (!userId) return;

        api.get(`/users/${userId}/profile`)
            .then(res => setUserProfile(res.data))
            .catch(err => console.error("Failed to load profile", err));

        api.get(`/orders/${userId}/history`)
            .then(res => setUserOrders(res.data))
            .catch(err => console.error("Failed to load orders", err));
    };

    useEffect(() => {
        if (searchQuery.trim()) {
            loadUsers(searchQuery);
        } else {
            setUsers([]);
        }
    }, [searchQuery]);

    return (
        <div className="container mt-4">
            <h3>Admin: View User Profile and Orders</h3>

            <input
                className="form-control mb-2"
                placeholder="Search users by email"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
            />

            <select className="form-control mb-3" value={selectedUserId} onChange={handleSelectUser}>
                <option value="">Select user</option>
                {users.map(user => (
                    <option key={user.userId} value={user.userId}>{user.email}</option>
                ))}
            </select>

            {userProfile && (
                <div className="card p-3 mb-4">
                    <h5>User Profile</h5>
                    <p><strong>Name:</strong> {userProfile.firstName} {userProfile.lastName}</p>
                    <p><strong>Email:</strong> {userProfile.email}</p>
                    <p><strong>Role:</strong> {userProfile.role}</p>
                    {userProfile.shippingAddress && <p><strong>Shipping Address:</strong> {userProfile.shippingAddress}</p>}
                </div>
            )}

            {userOrders.length > 0 && (
                <div className="card p-3">
                    <h5>Order History</h5>
                    <ul className="list-group">
                        {userOrders.map(order => (
                            <li key={order.id} className="list-group-item">
                                Order #{order.orderNumber} — {new Date(order.createdAt).toLocaleString()}
                                <br />
                                Total: ${order.totalPrice} — Status: {order.status}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default AdminUserViewer;