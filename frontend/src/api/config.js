// API Configuration
export const API_BASE_URL = 'http://localhost:8000';
export const API_V1_URL = `${API_BASE_URL}/api/v1`;

// Helper function to get auth headers
export const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Generic API request handler
export const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_V1_URL}${endpoint}`;

    const config = {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options.headers,
        },
    };

    // Add Content-Type for JSON payloads (not for FormData)
    if (options.body && !(options.body instanceof FormData) && !(options.body instanceof URLSearchParams)) {
        config.headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, config);

    if (response.status === 204) {
        return null;
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || 'An error occurred');
    }

    return data;
};
