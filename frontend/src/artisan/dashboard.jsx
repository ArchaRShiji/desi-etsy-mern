import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";  // import the CSS file
import  ArtisanNavbar from "./ArtisanNavbar";

const ArtisanDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    if (!user || user.role !== "artisan") {
      navigate("/signin");
      return;
    }

    fetch(`http://localhost:5000/api/artisan/${user.id}/products/count`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setProductsCount(data.count))
      .catch(() => setProductsCount(0));

    fetch(`http://localhost:5000/api/artisan/${user.id}/orders/count`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setOrdersCount(data.count))
      .catch(() => setOrdersCount(0));
  }, [user, navigate]);

  if (!user || user.role !== "artisan") {
    return null;
  }

  return (
    <div className="page-container">
      <ArtisanNavbar/>
    <div className="artisan-dashboard">
      <h2>Welcome, {user.name}!</h2>
      <p>Status: {user.isApproved ? "Approved" : "Pending Approval"}</p>

      <div className="dashboard-summary">
        <div>
          <h3>Products</h3>
          <p>{productsCount}</p>
          
        </div>
        <div>
          <h3>Orders</h3>
          <p>{ordersCount}</p>
          
        </div>
      </div>
    </div>
    </div>
  );
};

export default ArtisanDashboard;
