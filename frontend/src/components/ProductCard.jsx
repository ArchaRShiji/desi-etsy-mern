import React from 'react';
import { useNavigate } from 'react-router-dom';  // or Link
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="product-card">
      <img
        src={`http://localhost:5000/uploads/${product.images[0]}`}
        alt={product.name}
        className="product-image"
        onClick={goToDetails}
        style={{ cursor: 'pointer' }}
      />
      <div className="product-details" onClick={goToDetails} style={{ cursor: 'pointer' }}>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.price}</p>
        <p className="product-artisan">by {product.artisanId?.name || 'Unknown Artisan'}</p>
      </div>

      {/* Add to Cart Button/Icon */}
    </div>
  );
};

export default ProductCard;
