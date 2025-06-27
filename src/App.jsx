import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from './pages/UserManagement';

import "./App.css";

function HomePage() {
  const [fasilitas, setFasilitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/fasilitas")
      .then((res) => res.json())
      .then((data) => {
        setFasilitas(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data fasilitas:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero text-center py-5 bg-light">
        <div className="container">
          <h1>
            <i className="fas fa-hotel me-3"></i>Bumi Keluarga Hotel
          </h1>
          <p className="lead">Tempat Terbaik untuk Keluarga</p>
          <div className="hero-description mb-4">
            Selamat datang di Bumi Keluarga Hotel, hotel bintang lima yang
            mengutamakan kenyamanan keluarga Indonesia.
          </div>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <a href="#about" className="btn btn-primary">
              <i className="fas fa-info-circle"></i> Tentang Kami
            </a>
            <a href="#facilities" className="btn btn-success">
              <i className="fas fa-swimming-pool"></i> Fasilitas
            </a>
            <a href="/login-ui" className="btn btn-warning">
              <i className="fas fa-bed"></i> Reservasi
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section about-section py-5" id="about">
        {/* ... (About content sama seperti sebelumnya) */}
      </section>

      {/* Fasilitas Section */}
      <section className="section facilities-section py-5 bg-light" id="facilities">
        <div className="container">
          <h2 className="text-center mb-4">Fasilitas Unggulan</h2>
          {loading ? (
            <div className="text-center">Memuat fasilitas...</div>
          ) : (
            <div className="row g-4">
              {fasilitas.length > 0 ? (
                fasilitas.map((item) => (
                  <div key={item.id} className="col-md-4">
                    <div className="card h-100 shadow-sm border-0 rounded-4">
                      <img
                        src={`/images/${item.gambar_fasilitas}`}
                        className="card-img-top rounded-top-4"
                        alt={item.nama_fasilitas}
                        style={{ objectFit: "cover", height: "200px" }}
                      />
                      <div className="card-body">
                        <h5>{item.nama_fasilitas}</h5>
                        <p>{item.deskripsi}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <p>Tidak ada fasilitas tersedia.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function App() {
  return (
    <Router>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login-ui" element={<LoginPage />} />
        <Route path="/register-ui" element={<RegisterPage />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
