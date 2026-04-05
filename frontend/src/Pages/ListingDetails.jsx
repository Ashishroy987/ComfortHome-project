import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Map from "../components/Map";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListingDetails = ({ currUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // FETCH LISTING
  const fetchListing = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/listings/${id}`,
        { withCredentials: true }
      );
      setListing(res.data.listing);
    } catch (err) {
      toast.error("Failed to load listing");
      console.log(err);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  // CHECK OWNER
  const isOwner =
    currUser &&
    listing?.owner &&
    String(listing.owner._id) === String(currUser._id);

  const isLoggedIn = currUser && currUser._id;

  // DELETE LISTING
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this listing?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/listings/${id}`,
        { withCredentials: true }
      );
      toast.success("Listing deleted successfully");
      navigate("/listings");
    } catch (err) {
      toast.error("Delete failed");
      console.log(err);
    }
  };

  // RESERVE BUTTON
  const handleReserve = () => {
    navigate(`/checkout/${listing._id}`);
  };

  // SUBMIT REVIEW
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/listings/${id}/reviews`,
        { rating: Number(rating), comment },
        { withCredentials: true }
      );
      toast.success("Review added successfully");
      setRating(5);
      setComment("");
      fetchListing();
    } catch (err) {
      toast.error("Failed to add review");
      console.log(err);
    }
  };

  // DELETE REVIEW
  const handleReviewDelete = async (reviewId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/listings/${id}/reviews/${reviewId}`,
        { withCredentials: true }
      );
      toast.success("Review deleted");
      fetchListing();
    } catch (err) {
      toast.error("Failed to delete review");
      console.log(err);
    }
  };

  if (!listing) return <h2 className="text-center mt-5">Loading...</h2>;

  return (
    <div className="container mt-4 text-white">

      {/* TITLE */}
      <h3 className="text-center mb-4">{listing.title}</h3>

      {/* MAIN CARD */}
      <div className="d-flex justify-content-center">
        <div className="card w-75">

          <img
            src={listing?.image?.url || "https://via.placeholder.com/400"}
            className="card-img-top"
            alt="listing"
            style={{ height: "400px", objectFit: "cover" }}
          />

          <div className="card-body text-center bg-dark bg-opacity-50">
            <p>
              Hosted by <b>{listing?.owner?.username}</b>
            </p>
            <p>{listing.description}</p>
            <p>₹{listing.price?.toLocaleString("en-IN")}</p>
            <p>{listing.location}</p>
            <p className="text-muted">{listing.country}</p>
          </div>

        </div>
      </div>

      {/* BUTTONS */}
      {isLoggedIn && !isOwner && (
        <div className="d-flex justify-content-center mt-3">
          <button className="btn btn-success" onClick={handleReserve}>
            Reserve
          </button>
        </div>
      )}

      {isLoggedIn && isOwner && (
        <div className="d-flex justify-content-center mt-3 gap-2">
          <Link to={`/listings/${id}/edit`} className="btn btn-dark">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      )}

      {/* MAP */}
      {listing.coordinates && (
        <div className="d-flex justify-content-center mt-5">
          <div className="w-75">
            <h4 className="text-center">Location on Map</h4>
            <Map
              lat={listing.coordinates.lat}
              lng={listing.coordinates.lng}
              title={listing.title}
            />
          </div>
        </div>
      )}

      {/* REVIEWS */}
      <div className="d-flex justify-content-center mt-5">
        <div className="card w-75 p-3">

          {isLoggedIn && !isOwner && (
            <>
              <h4 className="text-center">Leave a Review</h4>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-3">
                  <label>Rating</label>
                  <select
                    className="form-control"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {r} Star
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label>Comments</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-outline-light">
                  Submit
                </button>
              </form>
              <hr />
            </>
          )}

          <h5 className="text-center">All Reviews</h5>

          <div className="row justify-content-center">
            {listing?.reviews?.length === 0 && <p>No reviews yet</p>}

            {listing?.reviews?.map((review) => {
              const isReviewOwner =
                currUser &&
                review.author &&
                String(review.author._id) === String(currUser._id);

              return (
                <div key={review._id} className="card col-md-5 m-2">
                  <div className="card-body text-center">
                    <h6>@{review?.author?.username}</h6>
                    <p>⭐ {review?.rating}</p>
                    <p>{review?.comment}</p>
                  </div>

                  {isReviewOwner && (
                    <button
                      className="btn btn-sm btn-dark"
                      onClick={() => handleReviewDelete(review._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default ListingDetails;