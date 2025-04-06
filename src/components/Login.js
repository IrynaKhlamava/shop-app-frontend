import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        if (!email || !password) {
            alert("Please enter both email and password");
            return;
        }

        api.post('/auth/login', { email, password })
            .then(res => {
                const { accessToken, refreshToken, userId } = res.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem("userId", userId);
                navigate('/');
            })
            .catch(err => {
                console.error('Login failed:', err);
                const message = err.response?.data?.message || "Login failed";
                alert(message);
                console.error(err);
            });
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4">Login</h2>
            <input
                type="email"
                className="form-control mb-2"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <input
                type="password"
                className="form-control mb-3"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button className="btn btn-primary w-100" onClick={handleLogin}>
                Login
            </button>
        </div>
    );
}

export default Login;