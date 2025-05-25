import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import './Homepage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const role = localStorage.getItem('role');

    if (isAuthenticated) {
      if (role === 'admin') {
        navigate('/Admin/AdminDashboard');
      } else if (role === 'artisan') {
        navigate('/artisan/dashboard');
      }
    }
  }, [navigate]);
      

  useEffect(() => {
    axios.get('http://localhost:5000/api/products/approved-products')
      .then(res => {
        setProducts(res.data.products);
      })
      .catch(err => {
        console.error("Failed to fetch approved products:", err);
      });
  }, []);

  return (
    <>
      <Header />
      <main className="home-main">
        <section className="hero-banner">
          <div className="hero-overlay">
            <h1>Welcome to DesiEtzy</h1>
            <p>Discover handmade treasures by local artisans</p>
          </div>
        </section>

        <section className="featured-products">
          <h2>Featured Products</h2>
          <div className="product-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Homepage;
