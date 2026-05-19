import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('meetflow_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await fetch('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          localStorage.removeItem('meetflow_token');
          localStorage.removeItem('meetflow_user');
          navigate('/login');
          return;
        }
        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
        localStorage.removeItem('meetflow_token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('meetflow_token');
    localStorage.removeItem('meetflow_user');
    navigate('/login');
  };

  if (loading) {
    return (
      <section className="auth-page">
        <div className="auth-card">
          <p style={{ color: '#d2d7f1' }}>Loading dashboard…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-page">
      <div className="dashboard-grid">
        <aside className="dashboard-sidebar">
          <div className="dashboard-brand">MeetFlow AI</div>
          <div className="dashboard-welcome">Workspace member</div>
          <div className="dashboard-name">{user?.name || 'Team member'}</div>
          <div className="dashboard-item">
            <strong>Email</strong>
            <p>{user?.email}</p>
          </div>
          <div className="dashboard-action">
            <button className="dashboard-button" type="button" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </aside>
        <div className="dashboard-panel">
          <div className="dashboard-brand">Dashboard</div>
          <div className="dashboard-item">
            <strong>Welcome back, {user?.name?.split(' ')[0] || 'there'}.</strong>
            <p>MeetFlow AI is ready to keep your next meeting on track. Your workspace is now connected.</p>
          </div>
          <div className="dashboard-item">
            <strong>Next step</strong>
            <p>Use the workspace sidebar to manage meetings, tasks, and team updates as soon as you connect your first session.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
