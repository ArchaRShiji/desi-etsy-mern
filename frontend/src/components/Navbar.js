import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    setIsLoggedIn(!!token);

    if (user) {
      const userObj = JSON.parse(user);
      setUserName(userObj.name || 'User'); // Adjust if your user object has different name key
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName('');
    navigate("/signin");
  };

  const handleSignin = () => {
    navigate("/signin");
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };

   const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo" onClick={() => navigate("/")}>DesiEtzy</div>

        <div className="nav-center">
          <div className="dropdown">
            <button className="dropbtn">Categories</button>
            <div className="dropdown-content">
              <button onClick={() => handleCategoryClick("jewelry")}>Jewelry</button>
              <button onClick={() => handleCategoryClick("home-decor")}>Home Decor</button>
              <button onClick={() => handleCategoryClick("clothing")}>Clothing</button>
              <button onClick={() => handleCategoryClick("art")}>Art</button>
            </div>
          </div>

          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search products..."
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-btn" onClick={handleSearch}>Search</button>
          </div>
        </div>

        <div className="nav-right">
          {isLoggedIn ? (
            <>
              <span style={{ marginRight: '10px',color: '#d84f57'}}>
                Logged in as: {userName}
              </span>
              <button className="signin-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button className="signin-btn" onClick={handleSignin}>Sign In</button>
          )}
          <FaShoppingCart className="cart-icon" onClick={() => navigate("/cart")} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
