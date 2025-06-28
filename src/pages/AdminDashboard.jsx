import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await fetch("http://localhost:8000/admin/users", { headers });

        if (!res.ok) {
          throw new Error("Gagal mengambil data. Pastikan Anda login sebagai admin.");
        }

        await res.json();
      } catch (err) {
        console.error(err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Memuat...</span>
        </div>
        <p className="mt-2">Memuat data dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f0f8ff" }}>
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-primary">Dashboard Admin</h1>
          <p className="lead text-muted">Manajemen Sistem Aplikasi Hotel</p>
          <hr className="w-25 mx-auto" style={{ height: '3px', backgroundColor: '#0d6efd' }} />
        </div>

        <div className="card shadow border-0 mx-auto" style={{ maxWidth: "500px" }}>
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-grid">
              <Link to="/admin/users" className="btn btn-primary btn-lg w-100">
                Kelola Users
              </Link>
            </li>
            <li className="list-group-item d-grid">
              <Link to="/admin/kamar" className="btn btn-primary btn-lg w-100">
                Kelola Kamar
              </Link>
            </li>
            <li className="list-group-item d-grid">
              <Link to="/admin/fasilitas" className="btn btn-primary btn-lg w-100">
                Kelola Fasilitas
              </Link>
            </li>
            <li className="list-group-item d-grid">
              <Link to="/admin/reservasi" className="btn btn-primary btn-lg w-100">
                Kelola Reservasi
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
