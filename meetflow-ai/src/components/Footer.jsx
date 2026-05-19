import { Zap, Share2, Link, X } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#" className="footer__logo">
              <Zap size={18} className="footer__logo-icon" />
              MeetFlow AI
            </a>
            <p className="footer__tagline">Automate your meeting workflows today.</p>
            <div className="footer__newsletter">
              <span className="footer__nl-label">Join our newsletter</span>
              <div className="footer__nl-form">
                <input type="email" placeholder="Enter your email" className="footer__nl-input" />
                <button className="btn-primary footer__nl-btn">Subscribe</button>
              </div>
            </div>
          </div>

          <div className="footer__col">
            <div className="footer__col-title">Product</div>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <div className="footer__col-title">Company</div>
            <ul>
              <li><a href="#about">Product</a></li>
              <li><a href="#testimonial">Testimonial</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <div className="footer__col-title">Social</div>
            <ul className="footer__social">
              <li>
                <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
                  <Share2 size={16} /> Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                  <Link size={16} /> Instagram
                </a>
              </li>
              <li>
                <a href="https://www.twitter.com" target="_blank" rel="noreferrer">
                  <X size={16} /> Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__bottom-links">
            <a href="#">Privacy Policy</a>
            <span>·</span>
            <a href="#">Terms of Conditions</a>
          </div>
          <div className="footer__copy">MeetFlow AI. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
