import React, { useEffect, useState } from "react";
import { getUserProfile, updateShippingAddress } from "../services/user";

function UserProfile({ userId }) {
    const [profile, setProfile] = useState(null);
    const [editingAddress, setEditingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState("");

    useEffect(() => {
        getUserProfile(userId)
            .then(res => {
                setProfile(res.data);
                setNewAddress(res.data.shippingAddress || "");
            })
            .catch(err => console.error("Failed to load profile", err));
    }, [userId]);

    const handleSaveAddress = () => {
        updateShippingAddress(userId, newAddress)
            .then(() => {
                setProfile(prev => ({ ...prev, shippingAddress: newAddress }));
                setEditingAddress(false);
            })
            .catch(err => {
                alert("Failed to update address");
                console.error(err);
            });
    };

    if (!profile) return <p>Loading profile...</p>;

    return (
        <div className="container mt-4">
            <h3>User Profile</h3>

            <p><strong>First name:</strong> {profile.firstName}</p>
            <p><strong>Last name:</strong> {profile.lastName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Role:</strong> {profile.role}</p>

            {profile.shippingAddress && (
                <>
                    <hr />
                    <h5>Shipping Address</h5>

                    {!editingAddress ? (
                        <>
                            <p>{profile.shippingAddress}</p>
                            {profile.role === "ROLE_CUSTOMER" && (
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => setEditingAddress(true)}
                                >
                                    Edit Address
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control mb-2"
                                value={newAddress}
                                onChange={(e) => setNewAddress(e.target.value)}
                            />
                            <button
                                className="btn btn-sm btn-success me-2"
                                onClick={handleSaveAddress}
                            >
                                Save
                            </button>
                            <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => setEditingAddress(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default UserProfile;