import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetails.css';
import Navbar from '../components/Navbar';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${productId}`)
      .then(res => setProduct(res.data.product))
      .catch(err => console.error(err));
  }, [productId]);

  if (!product) return <p className="loading">Loading...</p>;

  return (
    <div>
        <Navbar />
    <div className="product-details-container">
      <div className="product-image-section">
        <img
          src={`http://localhost:5000/uploads/${product.images[0]}`}
          alt={product.name}
          className="product-detail-image"
        />
      </div>

      <div className="product-info-section">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-price">₹{product.price}</p>
        <p className="product-description">{product.description}</p>
        <p className="product-artisan">Artisan: {product.artisanId?.name || 'Unknown'}</p>
        <button className="add-to-cart-button">🛒 Add to Cart</button>
      </div>
    </div>
    </div>
  );
};

export default ProductDetails;
