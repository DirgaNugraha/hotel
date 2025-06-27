import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div className="container">
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
              <Link className="nav-link text-white" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#about">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#facilities">Fasilitas</a>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/login-ui">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/register-ui">Register</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
