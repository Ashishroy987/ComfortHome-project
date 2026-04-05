import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  // =============================
  // Fetch Listing
  // =============================
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${API_URL}/listings/${id}`, {
          withCredentials: true,
        });

        if (res.data?.listing) {
          setListing(res.data.listing);
        } else {
          toast.error("Listing not found.");
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
        toast.error("Failed to load listing.");
      } finally {
        setLoading(false);
      }
    };

    if (API_URL) {
      fetchListing();
    } else {
      toast.error("VITE_API_URL is missing in frontend .env");
      setLoading(false);
    }
  }, [id, API_URL]);

  // =============================
  // Load Razorpay Script
  // =============================
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // =============================
  // Handle Payment
  // =============================
  const handlePayment = async () => {
    if (!listing) {
      toast.warning("Listing not loaded yet.");
      return;
    }

    if (!API_URL) {
      toast.error("API URL is missing in frontend .env");
      return;
    }

    if (!RAZORPAY_KEY_ID) {
      toast.error("Razorpay key is missing in frontend .env");
      return;
    }

    if (paying) return;

    setPaying(true);

    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      toast.error("Razorpay SDK failed to load.");
      setPaying(false);
      return;
    }

    try {
      // =============================
      // Create order on backend
      // =============================
      const orderRes = await axios.post(
        `${API_URL}/payment/checkout/${id}`,
        { listingId: id },
        {
          withCredentials: true,
        }
      );

      const order = orderRes.data?.order;

      if (!order) {
        toast.error("Order creation failed.");
        setPaying(false);
        return;
      }

      // =============================
      // Razorpay options
      // =============================
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "ComfortHome",
        description: listing.title,
        order_id: order.id,

        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${API_URL}/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                listingId: id,
              },
              {
                withCredentials: true,
              }
            );

            if (verifyRes.data?.success) {
              toast.success("Payment Successful 🎉", { autoClose: 2000 });

              setTimeout(() => {
                navigate(`/confirmation/${verifyRes.data.bookingId}`);
              }, 2000);
            } else {
              toast.error(verifyRes.data?.message || "Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);

            const errorMessage =
              err.response?.data?.message || "Payment verification failed.";

            toast.error(errorMessage);
          } finally {
            setPaying(false);
          }
        },

        modal: {
          ondismiss: function () {
            setPaying(false);
            toast.info("Payment popup closed.");
          },
        },

        prefill: {
          name: "Guest User",
          email: "guest@example.com",
        },

        theme: {
          color: "#000000",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Razorpay payment failed:", response.error);
        setPaying(false);
        toast.error(response.error?.description || "Payment failed. Please try again.");
      });

      rzp.open();
    } catch (err) {
      console.error("Payment Error:", err);

      const errorMessage =
        err.response?.data?.message || "Payment failed. Please try again.";

      toast.error(errorMessage);
      setPaying(false);
    }
  };

  // =============================
  // UI
  // =============================
  if (loading) return <h3 className="text-center mt-5">Loading...</h3>;
  if (!listing) return <h3 className="text-center mt-5">Listing not found</h3>;

  return (
    <div className="container mt-5 text-center">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <h2>Checkout</h2>

      <div
        className="card p-4 mt-4 shadow-sm"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <h4 className="mb-3">{listing.title}</h4>
        <h5>₹ {listing.price?.toLocaleString("en-IN")}</h5>

        <button
          className="btn btn-success btn-lg mt-3"
          onClick={handlePayment}
          disabled={paying}
        >
          {paying ? "Processing..." : "Pay with Razorpay"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;