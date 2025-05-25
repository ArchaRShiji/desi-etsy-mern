import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
    businessName: "",
    address: "",
    phone: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const { confirmPassword, ...payload } = formData;

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.msg || "Registration failed");
        return;
      }

      alert("Registration successful! Please sign in.");
      navigate("/signin");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="register-container">
      <div className="register-topbar">
        <h2>DesiEtzy</h2>
        <button onClick={() => navigate("/signin")} className="signin-btn">
          Sign In
        </button>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        <h3>Register</h3>

        <label>Name:</label>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password:</label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>Confirm Password:</label>
        <input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <label>Role:</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="customer">Customer</option>
          <option value="artisan">Artisan</option>
        </select>

        {/* Show only for artisans */}
        {formData.role === "artisan" && (
          <>
            <label>Business Name:</label>
            <input
              name="businessName"
              type="text"
              value={formData.businessName}
              onChange={handleChange}
              required
            />

            <label>Phone:</label>
            <input
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <label>Address:</label>
            <input
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
