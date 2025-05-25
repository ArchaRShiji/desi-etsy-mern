import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./ArtisanNavbar.css";

const ArtisanNavbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <nav className="artisan-navbar">
      <div className="nav-brand" onClick={() => navigate("/")}>
        DesiEtzy
      </div>

      <ul className="nav-links">
        <li>
          <NavLink
            to="/artisan/ArtisanProducts"
            activeclassname="active-link"
          >
            Manage Products
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/artisan/ArtisanOrders"
            activeclassname="active-link"
          >
            View Orders
          </NavLink>
        </li>
      </ul>

      {/* Show logged in user */}
      {user && (
        <div className="logged-in-as" style={{ marginRight: "1rem", color: "#fff" }}>
          Logged in as: <strong>{user.name || user.username || user.email}</strong>
        </div>
      )}

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default ArtisanNavbar;
