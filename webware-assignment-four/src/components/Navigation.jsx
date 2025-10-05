import { Link } from 'react-router-dom';

const Navigation = ({ user, onLogout }) => {
  const handleLogout = async(event) => {
    event.preventDefault();
    onLogout();
  };

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Create Review</Link></li>
          <li><Link to="/reviews">Your Reviews</Link></li>
          { user && (<li><a href="#" onClick={handleLogout}>Logout</a></li>) }
        </ul>
      </nav>
      <h1>Game Review Site</h1>
    </header>
  );
};

export default Navigation;