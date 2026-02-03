import { apiRequest } from './config';

// Get all tasks
export const getTasks = async (skip = 0, limit = 100) => {
    return apiRequest(`/tasks?skip=${skip}&limit=${limit}`);
};

// Get single task
export const getTask = async (taskId) => {
    return apiRequest(`/tasks/${taskId}`);
};

// Create new task
export const createTask = async (title, description = null, status = 'pending') => {
    return apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify({ title, description, status }),
    });
};

// Update task
export const updateTask = async (taskId, updates) => {
    return apiRequest(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
};

// Delete task
export const deleteTask = async (taskId) => {
    return apiRequest(`/tasks/${taskId}`, {
        method: 'DELETE',
    });
};

// Task status options
export const TASK_STATUSES = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
];
