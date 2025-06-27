import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function UserDashboard() {
  return (
      <div className="container py-5">
        <h2 className="mb-4 text-center">Menu Pengguna</h2>
        <div className="row g-4">
          <div className="col-md-6">
            <Link to="/user/kamar" className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center">
                  <span className="display-4">🏨</span>
                  <h3 className="mt-3">Lihat Daftar Kamar</h3>
                  <p className="text-muted">
                    Jelajahi berbagai pilihan kamar yang tersedia dengan fasilitas lengkap dan harga terjangkau
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-6">
            <Link to="/user/reservasi" className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center">
                  <span className="display-4">📋</span>
                  <h3 className="mt-3">Kelola Reservasi Saya</h3>
                  <p className="text-muted">
                    Pantau, ubah, atau batalkan reservasi Anda dengan mudah dan cepat
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
  );
}
