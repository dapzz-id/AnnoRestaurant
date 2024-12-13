import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img  className='footer-logo-img' src={assets.logo2} alt="" />
          <p className="footer-logo-img-p">
          Jangan lewatkan update terbaru, penawaran spesial, dan berita menarik dari AnoRestaurant. Ikuti kami di media sosial dan jadi bagian dari komunitas kami!
          </p>
          <div className="footer-social-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <img src={assets.facebook_icon} alt="Facebook" />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <img src={assets.twitter_icon} alt="Twitter" />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <img src={assets.linkedin_icon} alt="LinkedIn" />
            </a>
          </div>
        </div>
        <div className="footer-content-center">
          <h2>Company</h2>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <Link to='/sejarah'><li>Sejarah</li></Link>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li className="telpon">+62 895-1816-1539</li>
            <li><a href="mailto:keyzondol@gmail.com">keyzondol@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 - All right reserved.</p>
    </div>
  )
}

export default Footer
