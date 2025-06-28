import React from "react";

export default function Footer() {
  return (
    <footer className="footer bg-dark text-white py-4 mt-auto">
      <div className="container-fluid px-4">
        <div className="row">
          <div className="col-12 text-center">
            <h5>
              <i className="fas fa-hotel me-2"></i>Bumi Keluarga Hotel
            </h5>
            <p className="mt-3 mb-0">
              &copy; {new Date().getFullYear()} Bumi Keluarga Hotel. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}