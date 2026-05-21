import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialEmail = location.state?.email || '';
  const initialResetToken = location.state?.resetToken || '';
  const [email, setEmail] = useState(initialEmail);
  const [resetToken] = useState(initialResetToken);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Enter your email');
      return;
    }
    if (!resetToken) {
      setError('OTP verification is required to reset your password');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, resetToken }),
      });
      const text = await response.text();
      let payload = {};
      try {
        payload = text ? JSON.parse(text) : {};
      } catch {
        payload = { message: text };
      }

      if (!response.ok) {
        throw new Error(payload.message || text || 'Unable to reset password');
      }

      setSuccess('Password reset successfully. Redirecting to sign in…');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-top">
          <Link to="/" className="auth-logo">
            MeetFlow AI
          </Link>
          <h1 className="auth-title">Reset password</h1>
          <p className="auth-subtitle">Choose a strong new password to secure your account.</p>
        </div>

        {error && <div className="auth-banner auth-banner--error">{error}</div>}
        {success && <div className="auth-banner auth-banner--success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">New Password</label>
            <input
              id="password"
              className="auth-input"
              type="password"
              placeholder="Create a new password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>

        <p className="auth-switch">
          Back to <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  );
}
