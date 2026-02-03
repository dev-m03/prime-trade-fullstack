import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="home-page">
            <div className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Task Management
                        <span className="gradient-text"> Made Simple</span>
                    </h1>
                    <p className="hero-subtitle">
                        A powerful, production-ready task management system with JWT authentication
                        and role-based access control.
                    </p>
                    <div className="hero-actions">
                        {isAuthenticated ? (
                            <Link to="/tasks" className="btn btn-primary btn-lg">
                                Go to Tasks →
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary btn-lg">
                                    Get Started Free
                                </Link>
                                <Link to="/login" className="btn btn-secondary btn-lg">
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="features">
                <div className="container">
                    <h2 className="section-title">API Features</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🔐</div>
                            <h3>OAuth2 Authentication</h3>
                            <p>Secure login with OAuth2 password grant flow and JWT tokens.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">👥</div>
                            <h3>Role-Based Access</h3>
                            <p>Admin and User roles with different permission levels.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📋</div>
                            <h3>Task CRUD</h3>
                            <p>Full create, read, update, delete operations for tasks.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🚀</div>
                            <h3>FastAPI Backend</h3>
                            <p>High-performance async Python backend with automatic docs.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
