import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(undefined, async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            const refreshToken = localStorage.getItem('refreshToken');

            const response = await api.post('/auth/refresh', null, {
                params: { refreshToken },
            });

            const newAccessToken = response.data.accessToken;
            localStorage.setItem('accessToken', newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userId");

            window.location.href = "/login";
        }
    }

    return Promise.reject(error);
});

export default api;