import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar">
            <ul className="nav-left">
                <li><Link to="/" className="nav-link">Home</Link></li>
                <li><Link to="/results" className="nav-link">Results</Link></li>
            </ul>
            <ul className="nav-right">
                <li><Link to="/account" className="nav-link">Account</Link></li>
            </ul>
        </nav>
    );
}
