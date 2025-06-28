import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top w-100">
      <div className="container-fluid justify-content-between px-3">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="fas fa-hotel me-2"></i>Bumi Keluarga Hotel
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-white px-3" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white px-3" to="/login-ui">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white px-3" to="/register-ui">Register</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
