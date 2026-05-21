import { useState, useEffect } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem('meetflow_token')));
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const publicLinks = [
    { label: 'Home', href: '#' },
    { label: 'About', href: '#about' },
    { label: 'Testimonial', href: '#testimonial' },
    { label: 'Contact', href: '#contact' },
  ];

  const showDashboardNav = isAuthenticated && location.pathname.startsWith('/dashboard');

  const handleLogout = () => {
    localStorage.removeItem('meetflow_token');
    localStorage.removeItem('meetflow_user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <Zap size={20} className="navbar__logo-icon" />
          MeetFlow AI
        </Link>

        <ul className="navbar__links">
          {publicLinks.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="navbar__link">{l.label}</a>
            </li>
          ))}
        </ul>

        <div className="navbar__actions">
          {!showDashboardNav ? (
            <>
              <Link to="/login" className="navbar__link navbar__login-link">Sign In</Link>
              <Link to="/register" className="btn-primary navbar__cta">Get Started Free</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="navbar__link navbar__login-link">Profile</Link>
              <button type="button" className="btn-primary navbar__cta" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>

        <button
          className="navbar__hamburger"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className={`navbar__mobile ${open ? 'navbar__mobile--open' : ''}`}>
        <ul className="navbar__mobile-links">
          {publicLinks.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="navbar__mobile-link" onClick={() => setOpen(false)}>{l.label}</a>
            </li>
          ))}
          {!showDashboardNav ? (
            <>
              <li>
                <Link to="/login" className="navbar__mobile-link" onClick={() => setOpen(false)}>Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="btn-primary navbar__mobile-cta" onClick={() => setOpen(false)}>Get Started Free</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/dashboard" className="navbar__mobile-link" onClick={() => setOpen(false)}>Profile</Link>
              </li>
              <li>
                <button type="button" className="btn-primary navbar__mobile-cta" onClick={() => { setOpen(false); handleLogout(); }}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
