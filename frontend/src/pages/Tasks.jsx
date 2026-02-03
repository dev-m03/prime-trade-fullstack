import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask, TASK_STATUSES } from '../api/tasks';
import './Tasks.css';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', status: 'pending' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await getTasks();
            setTasks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingTask(null);
        setFormData({ title: '', description: '', status: 'pending' });
        setShowModal(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setFormData({
            title: task.title,
            description: task.description || '',
            status: task.status,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTask(null);
        setFormData({ title: '', description: '', status: 'pending' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            if (editingTask) {
                await updateTask(editingTask.id, formData);
            } else {
                await createTask(formData.title, formData.description || null, formData.status);
            }
            closeModal();
            fetchTasks();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (taskId) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            await deleteTask(taskId);
            setTasks(tasks.filter(t => t.id !== taskId));
        } catch (err) {
            setError(err.message);
        }
    };

    const getStatusBadgeClass = (status) => {
        const statusMap = {
            pending: 'badge-pending',
            in_progress: 'badge-in-progress',
            completed: 'badge-completed',
        };
        return statusMap[status] || 'badge-pending';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="tasks-page">
                <div className="loading-overlay">
                    <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
                </div>
            </div>
        );
    }

    return (
        <div className="tasks-page">
            <div className="container">
                <header className="tasks-header">
                    <div>
                        <h1 className="tasks-title">My Tasks</h1>
                        <p className="tasks-subtitle">{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
                    </div>
                    <button onClick={openCreateModal} className="btn btn-primary">
                        <span>+</span> New Task
                    </button>
                </header>

                {error && <div className="error-message">{error}</div>}

                {tasks.length === 0 ? (
                    <div className="tasks-empty">
                        <div className="empty-icon">📝</div>
                        <h2>No tasks yet</h2>
                        <p>Create your first task to get started</p>
                        <button onClick={openCreateModal} className="btn btn-primary">
                            Create Task
                        </button>
                    </div>
                ) : (
                    <div className="tasks-grid">
                        {tasks.map((task) => (
                            <div key={task.id} className="task-card">
                                <div className="task-header">
                                    <h3 className="task-title">{task.title}</h3>
                                    <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                </div>
                                {task.description && (
                                    <p className="task-description">{task.description}</p>
                                )}
                                <div className="task-meta">
                                    <span className="task-date">Created: {formatDate(task.created_at)}</span>
                                </div>
                                <div className="task-actions">
                                    <button
                                        onClick={() => openEditModal(task)}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(task.id)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
                                <button className="modal-close" onClick={closeModal}>&times;</button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="title" className="form-label">Title *</label>
                                        <input
                                            id="title"
                                            type="text"
                                            className="form-input"
                                            placeholder="Task title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            maxLength={255}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea
                                            id="description"
                                            className="form-input"
                                            placeholder="Optional description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="status" className="form-label">Status</label>
                                        <select
                                            id="status"
                                            className="form-input"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            {TASK_STATUSES.map((s) => (
                                                <option key={s.value} value={s.value}>{s.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" onClick={closeModal} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                                        {submitting ? (
                                            <>
                                                <span className="spinner"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            editingTask ? 'Update Task' : 'Create Task'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tasks;
