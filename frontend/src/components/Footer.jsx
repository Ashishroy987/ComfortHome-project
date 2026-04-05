import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-auto py-3">
      <div className="container text-center">
        <p className="mb-1">
          © {new Date().getFullYear()} ComfortHome Pvt. Ltd. All rights reserved.
        </p>
        <p className="mb-0">
        Privacy Policy
|
Terms of Service
        </p>
      </div>
    </footer>
  );
};

export default Footer;
