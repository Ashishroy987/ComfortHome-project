import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateListing = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    country: "",
    location: "",
    lat: "",
    lng: "",
  });

  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ==========================
  // Check if user logged in (frontend check only)
  // ==========================
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      toast.error("Please login first to create a listing");
      setTimeout(() => navigate("/login"), 1500);
    }
  }, [navigate]);

  // ==========================
  // HANDLE INPUT CHANGE
  // ==========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================
  // HANDLE IMAGE
  // ==========================
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setImage(null);
      return;
    }

    // optional basic validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      e.target.value = "";
      setImage(null);
      return;
    }

    setImage(file);
  };

  // ==========================
  // HANDLE SUBMIT
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!API_URL) {
      toast.error("VITE_API_URL is missing in frontend .env");
      return;
    }

    if (submitting) return;

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("description", formData.description.trim());
      data.append("price", Number(formData.price));
      data.append("country", formData.country.trim());
      data.append("location", formData.location.trim());
      data.append("lat", Number(formData.lat));
      data.append("lng", Number(formData.lng));

      if (image) {
        data.append("image", image);
      }

      const res = await axios.post(`${API_URL}/listings`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data?.success || res.status === 200 || res.status === 201) {
        toast.success("Listing created successfully! 🎉", { autoClose: 2000 });

        setTimeout(() => {
          navigate("/listings");
        }, 2100);
      } else {
        toast.error(res.data?.message || "Failed to create listing.");
      }
    } catch (err) {
      console.error("Create listing error:", err.response?.data || err);

      const errorMessage =
        err.response?.data?.message || "Error creating listing";

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h3>Create a New Listing</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                name="title"
                type="text"
                className="form-control"
                required
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                required
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Upload Listing Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="row">
              <div className="mb-3 col-md-4">
                <label className="form-label">Price</label>
                <input
                  name="price"
                  type="number"
                  className="form-control"
                  required
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3 col-md-8">
                <label className="form-label">Country</label>
                <input
                  name="country"
                  type="text"
                  className="form-control"
                  required
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Location</label>
              <input
                name="location"
                type="text"
                className="form-control"
                required
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Latitude</label>
              <input
                type="number"
                name="lat"
                className="form-control"
                step="any"
                required
                value={formData.lat}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Longitude</label>
              <input
                type="number"
                name="lng"
                className="form-control"
                step="any"
                required
                value={formData.lng}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-dark" disabled={submitting}>
              {submitting ? "Adding..." : "Add Listing"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;