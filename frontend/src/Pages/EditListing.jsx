import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const [currentImage, setCurrentImage] = useState("");

  // ==========================
  // FETCH LISTING
  // ==========================
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
          withCredentials: true,
        });
        const listing = res.data.listing;

        setFormData({
          title: listing.title || "",
          description: listing.description || "",
          price: listing.price || "",
          country: listing.country || "",
          location: listing.location || "",
          lat: listing.coordinates?.lat || "",
          lng: listing.coordinates?.lng || "",
        });

        setCurrentImage(listing.image?.url || "");
      } catch (err) {
        console.error("Error fetching listing:", err);
        toast.error("Failed to load listing.");
      }
    };

    fetchListing();
  }, [id]);

  // ==========================
  // HANDLE INPUT CHANGE
  // ==========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================
  // HANDLE IMAGE CHANGE
  // ==========================
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  // ==========================
  // UPDATE LISTING
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("country", formData.country);
      data.append("location", formData.location);
      data.append("lat", formData.lat);
      data.append("lng", formData.lng);

      if (image) {
        data.append("image", image);
      }

      await axios.put(`${import.meta.env.VITE_API_URL}/listings/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      toast.success("Listing updated successfully! 🎉", { autoClose: 2000 });

      setTimeout(() => {
        navigate(`/listings/${id}`);
      }, 2100); // Delay navigate to show toast
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Error updating listing.");
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h3>Edit Your Listing</h3>

          <form onSubmit={handleSubmit}>
            {/* TITLE */}
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

            {/* DESCRIPTION */}
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

            {/* CURRENT IMAGE */}
            {currentImage && (
              <div className="mb-3">
                <label className="form-label">Current Image</label>
                <br />
                <img
                  src={currentImage}
                  alt="Current Listing"
                  style={{ maxWidth: "200px", borderRadius: "8px" }}
                />
              </div>
            )}

            {/* NEW IMAGE */}
            <div className="mb-3">
              <label className="form-label">Upload New Image</label>
              <input type="file" className="form-control" onChange={handleFileChange} />
            </div>

            {/* PRICE + COUNTRY */}
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

            {/* LOCATION */}
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

            {/* LATITUDE */}
            <div className="mb-3">
              <label className="form-label">Latitude</label>
              <input
                name="lat"
                type="number"
                step="any"
                className="form-control"
                value={formData.lat}
                onChange={handleChange}
              />
            </div>

            {/* LONGITUDE */}
            <div className="mb-3">
              <label className="form-label">Longitude</label>
              <input
                name="lng"
                type="number"
                step="any"
                className="form-control"
                value={formData.lng}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-dark">
              Update Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditListing;