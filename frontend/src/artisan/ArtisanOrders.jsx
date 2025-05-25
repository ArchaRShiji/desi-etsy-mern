import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ArtisanNavbar from "./ArtisanNavbar";
import "./ArtisanOrder.css"; // Ensure you import your CSS file here

const ArtisanOrders = () => {
  const navigate = useNavigate();
  const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useMemo(() => localStorage.getItem("token"), []);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/artisan/${user.id}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/signin");
          return;
        }
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.msg || "Failed to fetch orders");
        }
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [user?.id, token, navigate]);

  useEffect(() => {
    if (!user || user.role !== "artisan") {
      navigate("/signin");
      return;
    }
    fetchOrders();
  }, [user, navigate, fetchOrders]);

  if (!user || user.role !== "artisan") return null;

  return (
    <>
      <ArtisanNavbar />

      <div className="artisan-orders-container">
        <div className="orders-content">
          <h2 className="orders-title">Your Orders</h2>

          {loading ? (
            <p className="loading">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="no-orders">No orders found</p>
          ) : (
            <div className="table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Buyer</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.productName}</td>
                      <td>{order.quantity}</td>
                      <td>{order.buyerName}</td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ArtisanOrders;
