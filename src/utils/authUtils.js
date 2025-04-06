export function getRoleFromToken() {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const authorities = payload.authorities || [];
        if (authorities.includes("ROLE_ADMIN")) return "ROLE_ADMIN";
        if (authorities.includes("ROLE_CUSTOMER")) return "ROLE_CUSTOMER";
        return null;
    } catch (e) {
        return null;
    }
}

export function isLoggedIn() {
    return !!localStorage.getItem('accessToken');
}