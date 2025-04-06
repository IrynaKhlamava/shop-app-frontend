import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const navigate = useNavigate();

    const handleRegister = () => {
        if (!firstName || !lastName || !email || !password) {
            alert("All fields are required.");
            return;
        }

        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        api.post('/auth/register', {
            email,
            password,
            firstName,
            lastName
        })
            .then(res => {
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('refreshToken', res.data.refreshToken);
                navigate('/');
            })
            .catch(err => {
                const message = err.response?.data?.message || "Registration failed.";
                alert(message);
                console.error(err);
            });
    };

    return (
        <div className="container mt-4">
            <h2>Register</h2>
            <input className="form-control my-2" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
            <input className="form-control my-2" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
            <input className="form-control my-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="form-control my-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="btn btn-primary" onClick={handleRegister}>Register</button>
        </div>
    );
}

export default Register;