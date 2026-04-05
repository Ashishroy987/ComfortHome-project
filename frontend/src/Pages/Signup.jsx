import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [signingUp, setSigningUp] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!API_URL) {
      setError("VITE_API_URL is missing in frontend .env");
      return;
    }

    if (signingUp) return;

    setSigningUp(true);
    setError("");

    try {
      const res = await axios.post(`${API_URL}/users/signup`, formData, {
        withCredentials: true,
      });

      if (res.status === 200 || res.status === 201 || res.data?.success) {
        navigate("/login");
      } else {
        setError(res.data?.message || "Signup failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setSigningUp(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Signup on ComfortHome</h2>

      <div className="row">
        <div className="col-md-6 offset-md-3">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                name="username"
                type="text"
                className="form-control"
                required
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                name="password"
                type="password"
                className="form-control"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button className="btn btn-success w-100" disabled={signingUp}>
              {signingUp ? "Signing up..." : "Signup"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;