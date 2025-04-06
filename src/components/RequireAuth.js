import React from "react";

function RequireAuth({ children }) {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning">
                    Please log in to access this page.
                </div>
                <p>
                    <a href="/login" className="btn btn-primary mt-2">Go to Login</a>
                </p>
            </div>
        );
    }

    return children;
}

export default RequireAuth;
