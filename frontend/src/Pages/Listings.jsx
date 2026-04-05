import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [showTax, setShowTax] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/listings`
        );

        setListings(res.data.listings);
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h4>Loading listings...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      {/* FILTER SECTION */}
      <div
        id="filters"
        className="d-flex flex-wrap align-items-center"
      >
        {[
          "Trending",
          "Rooms",
          "Mountain City",
          "Castles",
          "Awesome Pool",
          "Camping",
          "Tree City",
          "SnowHome",
          "Beaches",
          "Boats",
        ].map((filter, index) => (
          <div
            key={index}
            className="text-center me-4 mt-3 opacity-75"
          >
            <p>{filter}</p>
          </div>
        ))}

        <div className="ms-4 mt-3">
          <label>
            <input
              type="checkbox"
              onChange={() => setShowTax(!showTax)}
            />{" "}
            Includes service fee + GST
          </label>
        </div>
      </div>

      {/* LISTINGS GRID */}
      <div className="row row-cols-lg-3 row-cols-md-2 row-cols-sm-1 mt-4">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <div key={listing._id} className="col mb-4">
              <Link
                to={`/listings/${listing._id}`}
                className="text-decoration-none text-white"
              >
                <div className="card h-100 shadow-sm">

                  <img
                    src={
                      listing.image?.url ||
                      "https://via.placeholder.com/400x300"
                    }
                    className="card-img-top"
                    alt={listing.title}
                    style={{
                      height: "20rem",
                      objectFit: "cover",
                    }}
                  />

                  {/* ✅ CENTERED CONTENT */}
                  <div className="card-body text-center">

                    <h5 className="card-title mb-2">
                      {listing.title}
                    </h5>

                    <p className="card-text mb-1">
                      ₹
                      {listing.price?.toLocaleString("en-IN")} / Night
                      {showTax && (
                        <span className="ms-2 text-muted">
                          + 12% GST
                        </span>
                      )}
                    </p>

                    <p className="text-muted mb-0">
                      {listing.country}
                    </p>

                  </div>

                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center mt-5">
            <h5>No listings found</h5>
          </div>
        )}
      </div>

    </div>
  );
};

export default Listings;