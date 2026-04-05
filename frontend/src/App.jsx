import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// Pages
import Listings from "./Pages/Listings";
import ListingDetails from "./Pages/ListingDetails";
import CreateListing from "./Pages/CreateListing";
import EditListing from "./Pages/EditListing";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Checkout from "./Pages/Checkout";
import Confirmation from "./Pages/Confirmation";
import ErrorPage from "./Pages/ErrorPage";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Styles
import "./Styles/style.css";
import "./Styles/rating.css";
import "./App.css";
import "./index.css";
import "./components/Navbar.css";
import "./components/Footer.css";

function App() {
  const [currUser, setCurrUser] = useState(null);

  // Load user from localStorage on app load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser._id) {
      setCurrUser(storedUser);
    } else {
      setCurrUser(null);
    }
  }, []);

  return (
    <BrowserRouter>
      {/* Navbar */}
      <Navbar user={currUser} setUser={setCurrUser} />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Listings />} />

        {/* Listings */}
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<ListingDetails currUser={currUser} />} />

        {/* Create Listing */}
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateListing />
            </ProtectedRoute>
          }
        />

        {/* Edit Listing */}
        <Route
          path="/listings/:id/edit"
          element={
            <ProtectedRoute>
              <EditListing />
            </ProtectedRoute>
          }
        />

        {/* Authentication */}
        <Route path="/login" element={<Login setUser={setCurrUser} />} />
        <Route path="/signup" element={<Signup />} />

        {/* Booking */}
        <Route path="/checkout/:id" element={<Checkout currUser={currUser} />} />
        <Route path="/confirmation/:id" element={<Confirmation currUser={currUser} />} />

        {/* Error Page */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>

      {/* Footer */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;