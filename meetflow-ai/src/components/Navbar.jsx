import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    { label: 'Home', href: '/', isRouter: true },
    { label: 'Features', href: '#features' },
    { label: 'Demo', href: '#demo' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonial' },
  ];

  const handleNavClick = (link) => {
    if (link.isRouter) {
      navigate(link.href);
    } else if (window.location.pathname === '/') {
      const element = document.querySelector(link.href);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: link.href } });
    }
  };

  // Handle scroll-to after navigation
  useEffect(() => {
    const scrollTo = window.location.state?.scrollTo || new URLSearchParams(window.location.search).get('scrollTo');
    if (scrollTo) {
      setTimeout(() => {
        const element = document.querySelector(scrollTo);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  const showDashboardNav = isAuthenticated && location.pathname.startsWith('/dashboard');

  const handleLogout = () => {
    localStorage.removeItem('meetflow_token');
    localStorage.removeItem('meetflow_user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const linkVariants = {
    initial: { opacity: 0 },
    animate: (i) => ({
      opacity: 1,
      transition: { delay: 0.1 + i * 0.05, duration: 0.3 },
    }),
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`navbar ${scrolled ? 'navbar--scrolled' : 'navbar--top'}`}
    >
      {/* Glassmorphism background */}
      <div className="navbar__glass-bg" />

      {/* Content */}
      <div className="navbar__content">
        <div className="navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <div className="navbar__logo-icon-wrapper">
              <Sparkles
                size={20}
                className="navbar__logo-icon"
              />
              <div className="navbar__logo-glow" />
            </div>
            <span className="navbar__logo-text">MeetFlow AI</span>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="navbar__links">
            {publicLinks.map((link, i) => (
              <motion.li
                key={link.label}
                custom={i}
                variants={linkVariants}
                initial="initial"
                animate="animate"
              >
                <button
                  onClick={() => handleNavClick(link)}
                  className="navbar__link"
                >
                  {link.label}
                  <span className="navbar__link-underline" />
                </button>
              </motion.li>
            ))}
          </ul>

          {/* Right side buttons - Desktop */}
          <div className="navbar__actions">
            {!showDashboardNav ? (
              <>
                <Link
                  to="/login"
                  className="navbar__btn navbar__btn--ghost"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="navbar__btn navbar__btn--gradient"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="navbar__btn navbar__btn--ghost"
                >
                  Profile
                </Link>
                <button
                  type="button"
                  className="navbar__btn navbar__btn--danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <button
            className="navbar__hamburger"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={`navbar__mobile ${open ? 'navbar__mobile--open' : ''}`}
      >
        <div className="navbar__mobile-content">
          {publicLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => {
                handleNavClick(link);
                setOpen(false);
              }}
              className="navbar__mobile-link"
            >
              {link.label}
            </button>
          ))}

          <div className="navbar__mobile-divider" />

          {!showDashboardNav ? (
            <>
              <Link
                to="/login"
                className="navbar__mobile-btn navbar__mobile-btn--ghost"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="navbar__mobile-btn navbar__mobile-btn--gradient"
                onClick={() => setOpen(false)}
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="navbar__mobile-btn navbar__mobile-btn--ghost"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
              <button
                type="button"
                className="navbar__mobile-btn navbar__mobile-btn--danger"
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
}
