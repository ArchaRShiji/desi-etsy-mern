import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';  // import the CSS

const AdminDashboard = () => {
  const [pendingArtisansCount, setPendingArtisansCount] = useState(0);
  const [pendingProductsCount, setPendingProductsCount] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/artisans/pending')
      .then(res => setPendingArtisansCount(res.data.length))
      .catch(() => setPendingArtisansCount(0));

    axios.get('http://localhost:5000/api/admin/products/pending')
      .then(res => setPendingProductsCount(res.data.length))
      .catch(() => setPendingProductsCount(0));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="admin-dashboard-container">
        <h2>Admin Dashboard</h2>

        <div className="section">
          <h3>Pending Artisan Registrations: {pendingArtisansCount}</h3>
          <Link to="/Admin/PendingArtisans" className="view-button">
            View Pending Artisans
          </Link>
        </div>

        <div className="section">
          <h3>Pending Product Approvals: {pendingProductsCount}</h3>
          <Link to="/Admin/PendingProducts" className="view-button">
            View Pending Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
