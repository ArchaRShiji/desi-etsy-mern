import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import '../pages/CompleteProfile.css';

const CompleteProfile = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const userId = params.get("id");
  const [role, setRole] = useState("customer");
  const [formData, setFormData] = useState({
    businessName: "",
    address: "",
    phone: "",
    description: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      role,
      ...(role === "artisan" && formData),
    };

    const res = await fetch(`http://localhost:5000/api/complete-profile/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(role === "admin" ? "/Admin/AdminDashboard" : role === "artisan" ? "/artisan/dashboard" : "/");
    } else {
      alert(data.msg || "Something went wrong");
    }
  };

  return (
    <div className="profile-complete-container">
      <h2 className="profile-title">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <label className="profile-label">Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="profile-select"
        >
          <option value="customer">Customer</option>
          <option value="artisan">Artisan</option>
        </select>

        {role === "artisan" && (
          <>
            <label className="profile-label">Business Name:</label>
            <input
              name="businessName"
              onChange={handleChange}
              className="profile-input"
              placeholder="Enter business name"
            />

            <label className="profile-label">Phone:</label>
            <input
              name="phone"
              onChange={handleChange}
              className="profile-input"
              placeholder="Enter phone number"
              type="tel"
            />

            <label className="profile-label">Address:</label>
            <input
              name="address"
              onChange={handleChange}
              className="profile-input"
              placeholder="Enter address"
            />

            <label className="profile-label">Description:</label>
            <textarea
              name="description"
              onChange={handleChange}
              className="profile-textarea"
              placeholder="Describe your business"
            ></textarea>
          </>
        )}

        <button type="submit" className="profile-submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default CompleteProfile;
