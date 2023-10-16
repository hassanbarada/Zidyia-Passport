import React from "react";
import "./Footer.css";
import logo from "../../images/logo1.png";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  const location = useLocation();
  const isHomeRoute = location.pathname === "/";
  const isCredentialRoute = location.pathname.startsWith("/CredentialUrl");
  const footerClassName = isHomeRoute ? "footer-home" : isCredentialRoute ? "footer-credential" : "";
  const textClass = isCredentialRoute ? "credential-url-text" : "";

  
  return (
    <footer className={footerClassName}>
      {/*First section*/}
    <div className={`footer-container ${textClass}`}>
        <div className="footer-container-logo">
          <img src={logo} alt="" />
          <h1 className={`${textClass}`}>Zidyia Passport</h1>
        </div>
        <p className={`${textClass}`}>
          ZIDYIA PASSPORT is a next gen learning management system design
          <br /> to personalize learning, empower teaching and
          <br /> transform education.
        </p>
      </div>
      {/*Second section*/}
      <div className={`footer-container ${textClass}`}>
        <h2>ZIDYIA</h2>
        <p className={`${textClass}`}>Services</p>
        <p className={`${textClass}`}>About Us</p>
        <p className={`${textClass}`}>Our Story</p>
        <p className={`${textClass}`}>Partnerships</p>
      </div>
      {/*Third section*/}
      <div className={`footer-container ${textClass}`}>
        <h2 className={`${textClass}`}>LMS</h2>
        <p className={`${textClass}`}>Features</p>
        <p className={`${textClass}`}>Products</p>
        <p className={`${textClass}`}>Security</p>
        <p className={`${textClass}`}>Request Demo</p>
      </div>
      {/*Forth section*/}
      <div className={`footer-container ${textClass}`}>
        <div className={`footer-container-sub ${textClass}`}>
            <h2 className={`${textClass}`}>Support</h2>
            <p className={`${textClass}`}>Contact Us</p>
        </div>
        <div className="footer-container-sub">
        
        <h2>Follow Us</h2>
        <div className={`footer-container-social ${textClass}`}>
          <a
            href="https://www.facebook.com/your-facebook-page"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faFacebook} className="facebook-icon" />
          </a>
          <a
            href="https://twitter.com/your-twitter-page"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faTwitter} className="twitter-icon" />
          </a>
          <a
            href="https://www.linkedin.com/company/your-linkedin-page"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faLinkedin} className="linkedin-icon" />
          </a>
        </div>
        </div>

        
      </div>
      <div className={`footer-bottom ${textClass}`}>
        <p>© All rights reserved by Zidyia 2023</p>
      </div>
    </footer>
  );
};

export default Footer;
