import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo"><Link to="/">ArmanVarzesh</Link></div>
      <nav>
        <ul className="nav-list">
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/coaches">Coaches</Link></li>
          <li><Link to="/nutrition">Nutrition</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/login" className="btn-login">Login</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;