import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from './pages/UserManagement';
import KamarManagement from "./pages/KamarManagement";
import FasilitasManagement from "./pages/FasilitasManagement";
import ReservasiManagement from "./pages/ReservasiManagement";
import UserKamarList from "./pages/UserKamarList";
import UserReservasiManagement from "./pages/UserReservasiManagement";

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

  const scrollLeft = () => {
    document.getElementById('facilities-container').scrollBy({
      left: -300,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    document.getElementById('facilities-container').scrollBy({
      left: 300,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="hero text-center py-5"
        style={{
          backgroundImage:'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("/images/hotel.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          padding: '80px 0',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textShadow: '1px 1px 6px rgba(134, 134, 134, 0.62)'
        }}
      >
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-3 fw-bold mb-4 animate__animated animate__fadeInDown">
                <i className="fas fa-hotel me-3"></i>Bumi Keluarga Hotel
              </h1>
              <p className="lead fs-2 mb-4 animate__animated animate__fadeInUp">Tempat Terbaik untuk Keluarga</p>
              <div className="hero-description mb-5 fs-5 animate__animated animate__fadeInUp">
                Selamat datang di Bumi Keluarga Hotel, hotel bintang lima yang
                mengutamakan kenyamanan keluarga Indonesia.
              </div>
              <div className="d-flex justify-content-center gap-3 flex-wrap animate__animated animate__fadeInUp">
                <a href="#about" className="btn btn-light btn-lg px-4 py-3 rounded-pill shadow-lg">
                  <i className="fas fa-info-circle me-2"></i> Tentang Kami
                </a>
                <a href="#facilities" className="btn btn-success btn-lg px-4 py-3 rounded-pill shadow-lg">
                  <i className="fas fa-swimming-pool me-2"></i> Fasilitas
                </a>
                <a href="/login-ui" className="btn btn-warning btn-lg px-4 py-3 rounded-pill shadow-lg">
                  <i className="fas fa-bed me-2"></i> Reservasi
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section about-section py-5" id="about">
        <div className="container-fluid px-4">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="text-center mb-5">
                <h2 className="display-4 fw-bold text-primary mb-4">Tentang Kami</h2>
                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100 text-center p-4">
                      <div className="card-body">
                        <i className="fas fa-star text-warning fs-1 mb-3"></i>
                        <h5 className="card-title text-primary">Hotel Bintang 5</h5>
                        <p className="card-text">Fasilitas premium dengan standar internasional</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100 text-center p-4">
                      <div className="card-body">
                        <i className="fas fa-users text-success fs-1 mb-3"></i>
                        <h5 className="card-title text-primary">Ramah Keluarga</h5>
                        <p className="card-text">Dirancang khusus untuk kenyamanan seluruh keluarga</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100 text-center p-4">
                      <div className="card-body">
                        <i className="fas fa-map-marker-alt text-danger fs-1 mb-3"></i>
                        <h5 className="card-title text-primary">Lokasi Strategis</h5>
                        <p className="card-text">Berada di pusat kota dengan akses mudah kemana-mana</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fasilitas Section */}
      <section className="section facilities-section py-5 bg-light" id="facilities">
        <div className="container-fluid px-4">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold text-primary mb-3">Fasilitas Unggulan</h2>
            <p className="lead text-muted">Nikmati berbagai fasilitas premium yang kami sediakan</p>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="fs-5">Memuat fasilitas...</p>
            </div>
          ) : (
            <div className="position-relative">
              {/* Navigation Buttons */}
              <button 
                className="btn btn-primary rounded-circle position-absolute start-0 top-50 translate-middle-y shadow-lg"
                style={{zIndex: 10, width: '50px', height: '50px'}}
                onClick={scrollLeft}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              <button 
                className="btn btn-primary rounded-circle position-absolute end-0 top-50 translate-middle-y shadow-lg"
                style={{zIndex: 10, width: '50px', height: '50px'}}
                onClick={scrollRight}
              >
                <i className="fas fa-chevron-right"></i>
              </button>

              {/* Facilities Container */}
              <div 
                id="facilities-container"
                className="d-flex gap-4 overflow-hidden px-5"
                style={{
                  scrollBehavior: 'smooth',
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none'
                }}
              >
                {fasilitas.length > 0 ? (
                  fasilitas.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex-shrink-0"
                      style={{width: '300px'}}
                    >
                      <div className="card h-80 shadow-lg border-0 rounded-4 overflow-hidden">
                        <div className="position-relative overflow-hidden">
                          <img
                            src={`/images/${item.gambar_fasilitas}`}
                            className="card-img-top"
                            alt={item.nama_fasilitas}
                            style={{ 
                              objectFit: "cover", 
                              height: "200px",
                              transition: 'transform 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                          />
                          <div className="position-absolute top-0 end-0 m-3">
                            <span className="badge bg-primary px-3 py-2 rounded-pill">
                              <i className="fas fa-star me-1"></i>Premium
                            </span>
                          </div>
                        </div>
                        <div className="card-body p-4">
                          <h5 className="card-title text-primary fw-bold mb-3">{item.nama_fasilitas}</h5>
                          <p className="card-text text-muted">{item.deskripsi}</p>
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <small className="text-muted">
                              <i className="fas fa-check-circle text-success me-1"></i>
                              Tersedia 24/7
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-100 text-center py-5">
                    <i className="fas fa-exclamation-circle text-muted fs-1 mb-3"></i>
                    <p className="fs-5 text-muted">Tidak ada fasilitas tersedia.</p>
                  </div>
                )}
              </div>
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

      <div className="d-flex flex-column min-vh-100">
        <Navbar />

        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login-ui" element={<LoginPage />} />
            <Route path="/register-ui" element={<RegisterPage />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/kamar" element={<KamarManagement />} />
            <Route path="/admin/fasilitas" element={<FasilitasManagement />} />
            <Route path="/admin/reservasi" element={<ReservasiManagement />} />
            <Route path="/user/kamar" element={<UserKamarList />} />
            <Route path="/user/reservasi" element={<UserReservasiManagement />} />
          </Routes>
        </main>

        <Footer />
      </div>

      <style jsx>{`
        #facilities-container::-webkit-scrollbar {
          display: none;
        }
        
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
        }
        
        .btn {
          transition: all 0.3s ease;
        }
        
        .btn:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </Router>
  );
}

export default App;