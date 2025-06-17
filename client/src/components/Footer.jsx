import '../styles/footer.css';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="meta-footer">
      <div className="footer-content">
        <div className="footer-left">
          <h2>KiranaKart</h2>
          <p>&copy; {new Date().getFullYear()} KiranaKart. All rights reserved.</p>
        </div>

        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
