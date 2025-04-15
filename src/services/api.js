import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    window.location.href = '/login';
}

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
    refreshSubscribers.push(callback);
}

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(undefined, async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.includes('/auth/refresh')) {
        handleLogout();
        return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            handleLogout();
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve) => {
                addRefreshSubscriber((newToken) => {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    resolve(api(originalRequest));
                });
            });
        }

        isRefreshing = true;

        try {
            const response = await axios.post(
                'http://localhost:8080/api/auth/refresh',
                { refreshToken }
            );

            const newAccessToken = response.data.accessToken;
            localStorage.setItem('accessToken', newAccessToken);

            onRefreshed(newAccessToken);
            isRefreshing = false;

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            isRefreshing = false;
            handleLogout();
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});

export default api;