import React from "react";
import { useLocation, Link } from "react-router-dom";

const ErrorPage = () => {
  const location = useLocation();
  const message =
    location.state?.message || "Something went wrong";

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="alert alert-danger col-md-6 offset-md-3">
          <h5>{message}</h5>

          <div className="mt-3">
            <Link to="/listings" className="btn btn-dark">
              Go Back to Listings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;






