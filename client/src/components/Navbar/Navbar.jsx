import "./Navbar.css";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function Navbar() {
  const { cartCount } = useCart()

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">AURA</Link>
      </div>

      <div className="nav-links">
        <Link to="/collections">Collections</Link>
        <Link to="/studio">Virtual Studio</Link>
        <Link to="/journal">The Journal</Link>
        <Link to="/about">About</Link>
      </div>

      <div className="nav-right">
        <Link to="/account" className="nav-account">Account</Link>
        <Link to="/bag" className="nav-bag">Bag ({cartCount})</Link>
      </div>
    </nav>
  );
}

export default Navbar;