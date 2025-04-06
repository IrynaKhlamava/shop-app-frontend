import api from "./api";

export const addToCart = (userId, productId, quantity) => {
    return api.post(`/cart/${userId}/add`, null, {
        params: {
            productId,
            quantity
        }
    });
};

export const getCart = (userId) => {
    return api.get(`/cart/${userId}`);
};

export const updateItemQuantity = (userId, productId, quantity) => {
    return api.post(`/cart/${userId}/update`, null, {
        params: {
            productId,
            quantity
        }
    });
};

export const removeFromCart = (userId, productId) => {
    return api.delete(`/cart/${userId}/remove`, {
        params: { productId }
    });
};