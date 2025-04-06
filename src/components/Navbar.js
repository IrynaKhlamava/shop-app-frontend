import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';
import { getRoleFromToken, isLoggedIn } from '../utils/authUtils';

function Navbar() {
    const [loggedIn, setLoggedIn] = useState(isLoggedIn());
    const [isAdmin, setIsAdmin] = useState(getRoleFromToken() === 'ROLE_ADMIN');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            setLoggedIn(isLoggedIn());
            setIsAdmin(getRoleFromToken() === 'ROLE_ADMIN');
        };

        checkAuth();

        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    const handleLogout = () => {
        logout();
        setLoggedIn(false);
        setIsAdmin(false);
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">Lama Shop</Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Catalog</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/cart">Cart</Link>
                        </li>

                        {isAdmin && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin/products">Admin Panel</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin/users">Admin Users</Link>
                                </li>
                            </>
                        )}

                        <li className="nav-item">
                            <Link className="nav-link" to="/profile">Profile</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/orders">My Orders</Link>
                        </li>

                        {!loggedIn ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;