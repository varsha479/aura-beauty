import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <h2>AURA</h2>
        <p>
          Defining the intersection of dermatological science and artistic
          expression. Crafted for the conscious skin.
        </p>
      </div>

      <div className="footer-links">
        <div>
          <h4>Support</h4>
          <Link to="/bag">Shipping</Link>
          <Link to="/bag">Returns</Link>
          <Link to="/account">Contact</Link>
        </div>

        <div>
          <h4>Brand</h4>
          <Link to="/about">Our Story</Link>
          <Link to="/about">Sustainability</Link>
          <Link to="/journal">Journal</Link>
        </div>

        <div>
          <h4>Newsletter</h4>
          <div className="footer-newsletter">
            <span>Email address</span>
            <button type="button">Join</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;