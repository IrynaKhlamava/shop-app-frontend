import React, { useEffect, useState, useCallback } from "react";
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Register from './components/Register';
import AdminProductManager from './pages/AdminProductManager';
import { getCart } from './services/cart';
import UserProfile from './components/UserProfile';
import OrderHistory from './components/OrderHistory';
import RequireAuth from './components/RequireAuth';
import AdminUserViewer from "./components/AdminUserViewer";
import { getRoleFromToken } from './utils/authUtils';

function App() {
    const [cart, setCart] = useState(null);
    const [userId, setUserId] = useState(localStorage.getItem("userId"));
    const [role, setRole] = useState(getRoleFromToken());

    const location = useLocation();

    const isAdmin = role === "ROLE_ADMIN";

    const refreshCart = useCallback(() => {
        if (!userId) return;
        getCart(userId)
            .then(res => setCart(res.data))
            .catch(err => console.error("Failed to refresh cart", err));
    }, [userId]);

    useEffect(() => {
        setUserId(localStorage.getItem("userId"));
        setRole(getRoleFromToken());
    }, [location]);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={
                        <RequireAuth>
                            <ProductList userId={userId} onCartUpdate={refreshCart} cart={cart} />
                        </RequireAuth>
                    } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={
                        <RequireAuth>
                            <Cart userId={userId} cart={cart} setCart={setCart} />
                        </RequireAuth>
                    } />
                    <Route path="/profile" element={
                        <RequireAuth>
                            <UserProfile userId={userId} />
                        </RequireAuth>
                    } />
                    <Route path="/orders" element={
                        <RequireAuth>
                            <OrderHistory userId={userId} />
                        </RequireAuth>
                    } />
                    <Route path="/admin/products" element={
                        isAdmin ? <AdminProductManager /> : <Navigate to="/" />
                    } />
                    <Route path="/admin/users" element={
                        isAdmin ? <AdminUserViewer /> : <Navigate to="/" />
                    } />
                </Routes>
            </div>
        </>
    );
}

export default App;