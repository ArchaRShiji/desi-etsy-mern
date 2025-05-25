import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import './ArtisanProducts.css';
import ArtisanNavbar from "./ArtisanNavbar";

const ArtisanProducts = () => {
  const navigate = useNavigate();
  const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const token = useMemo(() => localStorage.getItem("token"), []);

  const fetchProducts = useCallback(() => {
    if (!user?.id) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/artisan/${user.id}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.id, token]);

  useEffect(() => {
    if (!user || user.role !== "artisan") {
      navigate("/signin");
      return;
    }
    fetchProducts();
  }, [user, navigate, fetchProducts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const openAddNew = () => {
    setEditingProduct(null);
    setFormData({ name: "", price: "", description: "", category: "", stock: "" });
    setImageFile(null);
    setShowFormModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      stock: product.stock,
    });
    setImageFile(null);
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setEditingProduct(null);
    setImageFile(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          fetchProducts();
        } else {
          alert("Failed to delete product");
        }
      })
      .catch(() => alert("Error deleting product"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct
      ? `http://localhost:5000/api/products/${editingProduct._id}`
      : `http://localhost:5000/api/artisan/${user.id}/products`;

    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("price", parseFloat(formData.price));
    formPayload.append("description", formData.description);
    formPayload.append("category", formData.category);
    formPayload.append("stock", parseInt(formData.stock));

    if (imageFile) {
      formPayload.append("images", imageFile);
    }

    fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formPayload,
    })
      .then((res) => {
        if (res.ok) {
          fetchProducts();
          closeFormModal();
        } else {
          alert("Failed to save product");
        }
      })
      .catch(() => alert("Error saving product"));
  };

  if (!user || user.role !== "artisan") return null;

  return (
    <div>
      <ArtisanNavbar />
      <div className="artisan-products">
        <h2>Your Products</h2>
        <button className="btn-add" onClick={openAddNew}>Add New Product</button>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price (₹)</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Description</th>
                <th>Approved</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>{product.category}</td>
                  <td>{product.description}</td>
                  <td>{product.isApproved ? "Yes" : "No"}</td>
                  <td>
                    <button className="btn-edit" onClick={() => openEdit(product)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(product._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal popup for Add/Edit Form */}
        {showFormModal && (
          <div className="modal-overlay" onClick={closeFormModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>
              <form onSubmit={handleSubmit} className="product-form">
                <input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
                <input name="price" type="number" step="0.01" placeholder="Price" value={formData.price} onChange={handleInputChange} required />
                <input name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} required />
                <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleInputChange} required />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} required />
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <div className="form-buttons">
                  <button type="submit">{editingProduct ? "Update" : "Add"}</button>
                  <button type="button" onClick={closeFormModal}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanProducts;
