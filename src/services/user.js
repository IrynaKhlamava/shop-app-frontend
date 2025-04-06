import api from "./api";

export const getUserProfile = (userId) => {
    return api.get(`/users/${userId}/profile`);
};

export const updateShippingAddress = (userId, newAddress) => {
    return api.put(`/users/${userId}/shipping-address`, null, {
        params: { address: newAddress }
    });
};
