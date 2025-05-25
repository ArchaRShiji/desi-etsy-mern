import React from 'react';
import './Footer.css';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <p>&copy; {new Date().getFullYear()} DesiEtzy. All rights reserved.</p>
        </div>
        <div className="footer-links">
          <a href="/">About Us</a>
          <a href="/">Contact</a>
          <a href="/">Terms</a>
          <a href="/">Privacy</a>
        </div>
        <div className="footer-socials">
          <a href="/"><FaFacebook /></a>
          <a href="/"><FaInstagram /></a>
          <a href="/"><FaTwitter /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
