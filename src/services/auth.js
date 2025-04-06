import api from './api';

export function logout() {
    return api.post('/auth/logout')
        .finally(() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
        });
}