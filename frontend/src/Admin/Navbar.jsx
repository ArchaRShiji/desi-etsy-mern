// src/admin/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { logout } from '../adminSlice';
import '../style/navbar.css';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get isAuthenticated from redux state
  //const isAuthenticated = useSelector(state => state.admin.isAuthenticated);

  const handleLogout = () => {
    console.log("Logging out...");
    console.log("Logging out...");
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
    };

  return (
    <nav className="admin-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/AdminDashboard" className="brand-title">Admin Panel</Link>
        </div>
        <ul className="navbar-links">
          <li><Link to="/Admin/AdminDashboard">Dashboard</Link></li>
          <li><Link to="/Admin/PendingArtisans">Pending Artisans</Link></li>
          <li><Link to="/Admin/PendingProducts">Pending Products</Link></li>
          <li>
            <button 
            onClick={handleLogout}  
            >Logout
            </button>
            </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
