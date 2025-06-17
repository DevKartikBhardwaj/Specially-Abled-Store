import  { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/header.css';

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const closeDrawer = () => {setDrawerOpen(false);}

  const handleLogout=()=>{
    localStorage.removeItem("authToken");
    closeDrawer();
  }

  return (
    <>
      <header className="meta-header">
        <Link to="/" className="meta-logo-link">
          <img src={logo} alt="Logo" className="meta-logo" />
        </Link>

        <button className="meta-menu-toggle" onClick={toggleDrawer} aria-label="Toggle menu">
          ☰
        </button>

        <nav className={`meta-drawer ${drawerOpen ? 'open' : ''}`}>
          <ul>
            <li><Link to="/login" onClick={closeDrawer}>Login</Link></li>
            <li><Link to="/signup" onClick={closeDrawer}>Register</Link></li>
            <li><Link to="/dashboard" onClick={closeDrawer}>Dashboard</Link></li>
            <li><Link to="/cart" onClick={closeDrawer}>Cart</Link></li>
            <li><Link to="/wishlist" onClick={closeDrawer}>Wishlist</Link></li>
            <li><Link  onClick={handleLogout}>Logout</Link></li>
          </ul>
        </nav>
      </header>

      {drawerOpen && <div className="meta-backdrop" onClick={closeDrawer}></div>}
    </>
  );
}
