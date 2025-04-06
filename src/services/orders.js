import api from "./api";

export const placeOrder = (userId, shippingAddress) => {
    return api.post(`/orders/${userId}/place`, null, {
        params: {
            shippingAddress
        }
    });
};

export const getOrderHistory = (userId) => {
    return api.get(`/orders/${userId}/history`);
};