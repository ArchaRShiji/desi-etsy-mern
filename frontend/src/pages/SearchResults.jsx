import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard'; // Adjust the path as necessary
import Navbar from '../components/Navbar';
const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const query = new URLSearchParams(useLocation().search).get('q');

  useEffect(() => {
    if (query) {
      axios.get(`http://localhost:5000/api/products/search?q=${query}`)
        .then(res => setProducts(res.data.products))
        .catch(err => console.error("Search error:", err));
    }
  }, [query]);

  return (
    <div>
        <Navbar />
    <div style={{ padding: '20px' }}>
      <h2>Search Results for "{query}"</h2>
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p>No matching products found.</p>
      )}
    </div>
    </div>
  );
};

export default SearchResults;
