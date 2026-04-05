import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Confirmation = () => {
  const { id } = useParams(); // booking id
  const [booking, setBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:3000/api/bookings/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBooking(res.data.booking);
      } catch (err) {
        toast.error("Unable to fetch booking details");
        navigate("/listings");
      }
    };

    fetchBooking();
  }, [id, navigate]);

  if (!booking) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h2 className="text-success">Booking Confirmed</h2>
        <hr />

        {booking.listing && (
          <>
            <p>
              <strong>Property:</strong> {booking.listing.title}
            </p>
            <p>
              <strong>Location:</strong> {booking.listing.location}
            </p>
          </>
        )}

        {booking.user && (
          <p>
            <strong>Booked By:</strong> {booking.user.username} (
            {booking.user.email})
          </p>
        )}

        <p>
          <strong>Amount Paid:</strong> ₹ {booking.amount}
        </p>

        <p>
          <strong>Payment ID:</strong> {booking.paymentId}
        </p>

        <p>
          <strong>Booking Date:</strong>{" "}
          {booking.bookedAt
            ? new Date(booking.bookedAt).toDateString()
            : "N/A"}
        </p>

        <Link to="/listings" className="btn btn-primary mt-3">
          Go to Listings
        </Link>
      </div>
    </div>
  );
};

export default Confirmation;
