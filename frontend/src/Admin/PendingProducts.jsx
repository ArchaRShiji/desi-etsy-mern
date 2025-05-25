import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './PendingProduct.css'; // Import the CSS

const PendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/admin/products/pending')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAction = (id, action) => {
    const endpoint =
      action === 'approve'
        ? `http://localhost:5000/api/admin/products/approve/${id}`
        : `http://localhost:5000/api/admin/products/reject/${id}`;

    axios
      .post(endpoint)
      .then(() => setProducts(prev => prev.filter(p => p._id !== id)))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Pending Product Listings</h2>

        {products.length === 0 ? (
          <p>No pending products</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price (₹)</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>
                    <img
                      src={`http://localhost:5000/uploads/${product.images}`}
                      alt={product.name}
                      width="80"
                      height="80"
                    />
                  </td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => setSelectedProduct(product)}
                    >
                      View
                    </button>
                    <button
                      className="approve-btn"
                      onClick={() => handleAction(product._id, 'approve')}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleAction(product._id, 'reject')}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selectedProduct && (
          <>
            <div
              className="modal-overlay"
              onClick={() => setSelectedProduct(null)}
            />
            <div className="modal-content">
              <h3>Product Details</h3>
              <p>
                <strong>Name:</strong> {selectedProduct.name}
              </p>
              <p>
                <strong>Price:</strong> ₹{selectedProduct.price}
              </p>
              <p>
                <strong>Description:</strong> {selectedProduct.description}
              </p>
              <p>
                <strong>Artisan ID:</strong> {selectedProduct.artisanId}
              </p>
              <img
                src={`http://localhost:5000/uploads/${selectedProduct.images}`}
                alt={selectedProduct.name}
              />
              <button
                className="modal-close-btn"
                onClick={() => setSelectedProduct(null)}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PendingProducts;
