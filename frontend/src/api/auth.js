import { API_V1_URL, apiRequest } from './config';

// Login with OAuth2 password grant (form data)
export const login = async (email, password) => {
    // OAuth2PasswordRequestForm expects username field (but we use email as username)
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_V1_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
    }

    // Store the access token
    localStorage.setItem('access_token', data.access_token);

    return data;
};

// Register with JSON body
export const register = async (email, password, fullName) => {
    const response = await fetch(`${API_V1_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
            full_name: fullName || null,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
    }

    return data;
};

// Get current user profile
export const getCurrentUser = async () => {
    return apiRequest('/users/me');
};

// Logout (client-side only)
export const logout = () => {
    localStorage.removeItem('access_token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
};
