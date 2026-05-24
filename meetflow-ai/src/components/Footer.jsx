import { Share2, Link, X } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#" className="footer__logo">
              <div className="footer__logo-mark">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="white" fillOpacity="0.6"/>
                </svg>
              </div>
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
              <li><a href="https://www.facebook.com" target="_blank" rel="noreferrer"><Share2 size={15} />Facebook</a></li>
              <li><a href="https://www.instagram.com" target="_blank" rel="noreferrer"><Link size={15} />Instagram</a></li>
              <li><a href="https://www.twitter.com" target="_blank" rel="noreferrer"><X size={15} />Twitter</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__bottom-links">
            <a href="#">Privacy Policy</a>
            <span>·</span>
            <a href="#">Terms of Service</a>
          </div>
          <div className="footer__copy">© 2025 MeetFlow AI. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
