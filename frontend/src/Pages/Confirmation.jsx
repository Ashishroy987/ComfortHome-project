import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Confirmation = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/bookings/${id}`, {
          withCredentials: true,
        });

        setBooking(res.data.booking);

        // Show toast notification for successful booking
        toast.success("Booking confirmed successfully!");

      } catch (err) {
        console.error("Error fetching booking:", err);
        toast.error("Failed to fetch booking details.");
      }
    };

    fetchBooking();
  }, [id]);

  if (!booking) {
    return (
      <h3 className="text-center mt-5">
        Loading booking details...
      </h3>
    );
  }

  return (
    <div className="container mt-5 text-center">

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <h2 className="mb-4">Booking Confirmed</h2>

      <div className="card p-4 mt-3 shadow-sm" style={{ maxWidth: "500px", margin: "0 auto" }}>
        <h4 className="mb-3">{booking.listing.title}</h4>

        <p>
          <strong>Price Paid:</strong> ₹ {booking.amount?.toLocaleString("en-IN")}
        </p>

        <p>
          <strong>Payment ID:</strong> {booking.paymentId}
        </p>

        <p>
          <strong>Status:</strong> <span className="text-success">Paid</span>
        </p>
      </div>
    </div>
  );
};

export default Confirmation;