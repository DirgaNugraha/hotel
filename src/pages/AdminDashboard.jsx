import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Validasi token dengan salah satu endpoint admin
        const res = await fetch("http://localhost:8000/admin/users", { headers });

        if (!res.ok) {
          throw new Error("Gagal mengambil data. Pastikan Anda login sebagai admin.");
        }

        // Jika berhasil, tidak perlu simpan data di state (atau bisa simpan kalau mau)
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
    <div className="container py-5">
      <h2 className="mb-4 text-center">Dashboard Admin</h2>

      <div className="d-flex flex-wrap justify-content-center gap-4 mb-5">
        <Link to="/admin/users" className="btn btn-outline-primary btn-lg">
          Kelola Users
        </Link>
        <Link to="/admin/kamar" className="btn btn-outline-success btn-lg">
          Kelola Kamar
        </Link>
        <Link to="/admin/fasilitas" className="btn btn-outline-warning btn-lg">
          Kelola Fasilitas
        </Link>
        <Link to="/admin/reservasi" className="btn btn-outline-danger btn-lg">
          Kelola Reservasi
        </Link>
      </div>
    </div>
  );
}
