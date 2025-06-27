import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    no_telepon: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Gagal registrasi.");
      }

      // Registrasi sukses, arahkan ke halaman utama
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="border rounded p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4 text-success">Register</h3>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-3">
            <label className="form-label">Nama Lengkap</label>
            <input
              type="text"
              className="form-control"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">No. Telepon</label>
            <input
              type="text"
              className="form-control"
              name="no_telepon"
              value={formData.no_telepon}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Kata Sandi</label>
            <input
              type="password"
              className="form-control"
              name="password"
              minLength="4"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? "Mendaftarkan..." : "Register"}
          </button>
          <p className="mt-3 text-center">
            Sudah punya akun? <a href="/login-ui">Login di sini</a>
          </p>
        </form>
      </div>
    </div>
  );
}
