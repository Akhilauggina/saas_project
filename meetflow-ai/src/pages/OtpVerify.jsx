import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function OtpVerify() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialEmail = location.state?.email || '';
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
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
    if (!otp.trim()) {
      setError('Enter the OTP code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const text = await response.text();
      let payload = {};
      try {
        payload = text ? JSON.parse(text) : {};
      } catch {
        payload = { message: text };
      }

      if (!response.ok) {
        throw new Error(payload.message || text || 'Unable to verify OTP');
      }

      setSuccess('OTP verified successfully. Redirecting…');
      navigate('/reset-password', { state: { email, resetToken: payload.resetToken } });
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
          <h1 className="auth-title">Verify OTP</h1>
          <p className="auth-subtitle">
            {initialEmail
              ? 'Enter the code we sent to your email.'
              : 'Enter your email and the OTP code to continue.'}
          </p>
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
            <label className="auth-label" htmlFor="otp">OTP Code</label>
            <input
              id="otp"
              className="auth-input"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
            />
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Verify OTP'}
          </button>
        </form>

        <p className="auth-switch">
          Need a different email? <Link to="/forgot-password">Send OTP again</Link>
        </p>
      </div>
    </section>
  );
}
