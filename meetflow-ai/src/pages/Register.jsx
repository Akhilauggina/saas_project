import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const specialPattern = /[!@#$%^&*(),.?":{}|<>]/;

function getStrength(password) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /\d/.test(password),
    specialPattern.test(password),
  ];
  return checks.filter(Boolean).length;
}

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [toast, setToast] = useState('');

  const strengthScore = useMemo(() => getStrength(password), [password]);
  const strengthLabel = useMemo(() => {
    if (!password) return 'Weak';
    return ['Weak', 'Fair', 'Good', 'Strong'][Math.max(0, strengthScore - 1)];
  }, [password, strengthScore]);

  const strengthColor = useMemo(() => {
    if (!password) return '#f87171';
    return ['#f87171', '#f59e0b', '#60a5fa', '#34d399'][Math.max(0, strengthScore - 1)];
  }, [password, strengthScore]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Enter your full name');
      return;
    }
    if (!emailPattern.test(email)) {
      setError('Enter a valid email');
      return;
    }
    if (password.length < 8) {
      setError('Password min 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!acceptedTerms) {
      setError('Please agree to the Terms');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Unable to create account');
      }

      localStorage.setItem('meetflow_token', payload.token);
      localStorage.setItem('meetflow_user', JSON.stringify(payload.user));
      setSuccess('Account created successfully! Redirecting…');
      setToast('Welcome to MeetSync! 🎉');
      setTimeout(() => navigate('/dashboard'), 1200);
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
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Start turning meetings into results — free forever</p>
        </div>

        {error && <div className="auth-banner auth-banner--error">{error}</div>}
        {success && <div className="auth-banner auth-banner--success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="name">Full Name</label>
            <input
              id="name"
              className="auth-input"
              type="text"
              placeholder="Rahul Sharma"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
            />
          </div>

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
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="auth-input"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
            />
            <div className="auth-strength">
              <div className="strength-track">
                <div
                  className="strength-fill"
                  style={{ width: `${(Math.max(0, strengthScore) / 4) * 100}%`, background: strengthColor }}
                />
              </div>
              <span className="strength-label">{strengthLabel}</span>
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              className="auth-input"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
            />
          </div>

          <label className="auth-terms">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
            />
            I agree to the <a href="#" className="auth-link">Terms</a> and <a href="#" className="auth-link">Privacy Policy</a>
          </label>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </section>
  );
}
