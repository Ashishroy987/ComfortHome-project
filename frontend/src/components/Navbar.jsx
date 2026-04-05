import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Navbar.css";

const Navbar = ({ user, setUser }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // HANDLE SEARCH
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() === "") {
      toast.warning("Please enter a destination to search");
      return;
    }
    navigate(`/listings?q=${search}`);
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // PROTECTED HOST
  const handleHostClick = () => {
    if (!user) {
      toast.info("Please login first to become a host");
      navigate("/login");
    } else {
      navigate("/create");
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-md sticky-top custom-navbar">
        <div className="container-fluid">

          {/* Logo */}
          <Link className="navbar-brand" to="/listings">
            <i className="fa-brands fa-airbnb"></i>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">

            {/* Left */}
            <div className="navbar-nav">
              <Link className="nav-link" to="/listings">
                <b>Explore</b>
              </Link>
            </div>

            {/* Search */}
            <div className="navbar-nav ms-auto">
              <form className="d-flex" onSubmit={handleSearch}>
                <input
                  className="form-control me-2 search-inp"
                  type="search"
                  placeholder="Search destinations"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn search-btn" type="submit">
                  <i className="fa-solid fa-magnifying-glass"></i> Search
                </button>
              </form>
            </div>

            {/* Right */}
            <div className="navbar-nav ms-auto">

              <button
                className="nav-link btn btn-link"
                onClick={handleHostClick}
                style={{ textDecoration: "none" }}
              >
                Become a Host
              </button>

              {!user && (
                <>
                  <Link className="nav-link" to="/signup">
                    <b>Sign up</b>
                  </Link>
                  <Link className="nav-link" to="/login">
                    <b>Log in</b>
                  </Link>
                </>
              )}

              {user && (
                <>
                  <span className="nav-link">
                    Hi, {user.username}
                  </span>

                  <button
                    className="nav-link btn btn-link"
                    onClick={handleLogout}
                  >
                    <b>Log out</b>
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      </nav>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default Navbar;