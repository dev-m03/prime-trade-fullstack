import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
    const { user } = useAuth();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="profile-info">
                            <h1>{user?.full_name || 'No name set'}</h1>
                            <p className="profile-email">{user?.email}</p>
                        </div>
                    </div>

                    <div className="profile-details">
                        <div className="detail-row">
                            <span className="detail-label">User ID</span>
                            <span className="detail-value">{user?.id}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Role</span>
                            <span className={`detail-value role-badge role-${user?.role}`}>
                                {user?.role}
                            </span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Status</span>
                            <span className={`detail-value status-badge ${user?.is_active ? 'status-active' : 'status-inactive'}`}>
                                {user?.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Member Since</span>
                            <span className="detail-value">{formatDate(user?.created_at)}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Last Updated</span>
                            <span className="detail-value">{formatDate(user?.updated_at)}</span>
                        </div>
                    </div>

                    <div className="profile-api-info">
                        <h3>API Endpoint</h3>
                        <code>GET /api/v1/users/me</code>
                        <p>This endpoint returns the current authenticated user's profile.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
