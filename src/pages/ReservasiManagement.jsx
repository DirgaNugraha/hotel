import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ReservasiManagement() {
  const [reservasi, setReservasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchReservasi = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/admin/reservasi", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal mengambil data reservasi.");
      const data = await res.json();
      setReservasi(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/admin/reservasi/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Gagal memperbarui reservasi.");
      alert("Reservasi berhasil diperbarui.");
      setEditingId(null);
      setEditForm({});
      fetchReservasi();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus reservasi ini?")) return;
    try {
      const res = await fetch(`http://localhost:8000/admin/reservasi/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal menghapus reservasi.");
      alert("Reservasi berhasil dihapus.");
      fetchReservasi();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    if (!token) {
      alert("Anda belum login.");
      navigate("/login-ui");
      return;
    }
    fetchReservasi();
  }, [token]);

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-primary">Kelola Reservasi</h1>
          <p className="lead text-muted">Manajemen data reservasi kamar hotel</p>
          <hr className="w-25 mx-auto" style={{ height: "3px", backgroundColor: "#0d6efd" }} />
        </div>

        {/* Tabel */}
        <div className="card shadow border-0">
          <div className="card-header bg-dark text-white">
            <h5 className="mb-0"><i className="bi bi-calendar-check me-2"></i>Daftar Reservasi</h5>
          </div>
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-2">Memuat data reservasi...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Kamar</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Status</th>
                      <th className="text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservasi.map((r) => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.id_user}</td>
                        <td>{r.id_kamar}</td>
                        {editingId === r.id ? (
                          <>
                            <td>
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                value={editForm.tanggal_checkin || ""}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, tanggal_checkin: e.target.value })
                                }
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                value={editForm.tanggal_checkout || ""}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, tanggal_checkout: e.target.value })
                                }
                                required
                              />
                            </td>
                            <td>
                              <span className="badge bg-secondary">{r.status}</span>
                            </td>
                            <td className="text-center">
                              <div className="d-flex justify-content-center gap-2">
                                <button
                                  className="btn btn-sm btn-success"
                                  title="Simpan"
                                  onClick={() => handleUpdateSubmit(r.id)}
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  title="Batal"
                                  onClick={() => {
                                    setEditingId(null);
                                    setEditForm({});
                                  }}
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{r.tanggal_checkin}</td>
                            <td>{r.tanggal_checkout}</td>
                            <td>{r.status}</td>
                            <td className="text-center">
                              <div className="d-flex justify-content-center gap-2">
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => {
                                    setEditingId(r.id);
                                    setEditForm({
                                      tanggal_checkin: r.tanggal_checkin,
                                      tanggal_checkout: r.tanggal_checkout,
                                      status: r.status,
                                    });
                                  }}
                                  title="Edit Reservasi"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDelete(r.id)}
                                  title="Hapus Reservasi"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                    {reservasi.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-muted">
                          Belum ada reservasi.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 mb-4">
          <Link to="/admin/dashboard" className="btn btn-secondary">
            &larr; Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
