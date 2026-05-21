import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
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
    if (!emailPattern.test(email)) {
      setError('Enter a valid email');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const text = await response.text();
      let payload = {};
      try {
        payload = text ? JSON.parse(text) : {};
      } catch {
        payload = { message: text };
      }

      if (!response.ok) {
        throw new Error(payload.message || text || 'Unable to send OTP');
      }

      setSuccess('OTP sent successfully. Redirecting…');
      navigate('/otp-verify', { state: { email } });
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
          <h1 className="auth-title">Forgot password</h1>
          <p className="auth-subtitle">Enter your email to receive a one-time verification code.</p>
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

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send OTP'}
          </button>
        </form>

        <p className="auth-switch">
          Remembered your password? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  );
}
