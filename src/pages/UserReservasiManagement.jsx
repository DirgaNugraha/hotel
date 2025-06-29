import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function UserReservasiManagement() {
  const [reservasi, setReservasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchReservasi = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/user/reservasi", {
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
    if (!editForm.tanggal_checkin || !editForm.tanggal_checkout) {
      alert("Tanggal check-in dan check-out wajib diisi.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/user/reservasi/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tanggal_checkin: editForm.tanggal_checkin,
          tanggal_checkout: editForm.tanggal_checkout,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Gagal memperbarui reservasi.");
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
    if (!window.confirm("Yakin ingin membatalkan reservasi ini?")) return;
    try {
      const res = await fetch(`http://localhost:8000/user/reservasi/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal membatalkan reservasi.");
      alert("Reservasi berhasil dibatalkan.");
      fetchReservasi();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { class: 'bg-warning text-dark', icon: 'clock', text: 'Pending' },
      'confirmed': { class: 'bg-success', icon: 'check-circle', text: 'Terkonfirmasi' },
      'cancelled': { class: 'bg-danger', icon: 'times-circle', text: 'Dibatalkan' },
      'completed': { class: 'bg-info', icon: 'check-double', text: 'Selesai' }
    };
    const config = statusConfig[status] || { class: 'bg-secondary', icon: 'question', text: status };
    return (
      <span className={`badge ${config.class} px-3 py-2 rounded-pill`}>
        <i className={`fas fa-${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    if (!token) {
      alert("Anda belum login.");
      navigate("/login-ui");
      return;
    }
    fetchReservasi();
  }, [token]);

  if (loading) {
    return (
      <div className="bg-light min-vh-100">
        <div className="container py-5">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5 className="text-muted">Memuat data reservasi Anda...</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <h1 className="display-6 fw-bold text-dark mb-2">Kelola Reservasi Saya</h1>
                <p className="text-muted mb-0">Kelola dan pantau status reservasi kamar Anda</p>
              </div>
              <Link to="/user/dashboard" className="btn btn-outline-primary btn-lg">
                <i className="fas fa-arrow-left me-2"></i>
                Kembali ke Dashboard
              </Link>
            </div>
            <div className="mx-0 mt-3" style={{ width: "100px", height: "4px", backgroundColor: "#007bff", borderRadius: "2px" }}></div>
          </div>
        </div>

        {reservasi.length === 0 ? (
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card border-0 shadow-lg text-center py-5">
                <div className="card-body">
                  <i className="fas fa-calendar-times fa-4x text-muted mb-4"></i>
                  <h3 className="fw-bold text-dark mb-3">Belum Ada Reservasi</h3>
                  <p className="text-muted mb-4">Anda belum memiliki reservasi kamar. Mulai reservasi sekarang!</p>
                  <Link to="/user/kamar" className="btn btn-primary btn-lg">
                    <i className="fas fa-plus me-2"></i>
                    Buat Reservasi Baru
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-lg">
                <div className="card-header bg-white border-0 py-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <h4 className="fw-bold text-dark mb-0">
                      <i className="fas fa-list-alt me-2 text-primary"></i>
                      Daftar Reservasi ({reservasi.length})
                    </h4>
                    <small className="text-muted">Total reservasi aktif</small>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-dark">
                        <tr>
                          <th className="py-3 px-4">ID</th>
                          <th className="py-3 px-4">Kamar</th>
                          <th className="py-3 px-4">Check-in</th>
                          <th className="py-3 px-4">Check-out</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservasi.map((r) => (
                          <tr key={r.id} className="align-middle">
                            <td className="px-4 py-3">
                              <span className="badge bg-light text-dark px-3 py-2">#{r.id}</span>
                            </td>
                            <td className="px-4 py-3">{r.nomor_kamar}</td>
                            {editingId === r.id ? (
                              <>
                                <td className="px-4 py-3">
                                  <DatePicker
                                    selected={editForm.tanggal_checkin ? new Date(editForm.tanggal_checkin) : null}
                                    onChange={(date) =>
                                      setEditForm({
                                        ...editForm,
                                        tanggal_checkin: date.toISOString().split("T")[0],
                                      })
                                    }
                                    dateFormat="yyyy-MM-dd"
                                    minDate={new Date()}
                                    className="form-control"
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <DatePicker
                                    selected={editForm.tanggal_checkout ? new Date(editForm.tanggal_checkout) : null}
                                    onChange={(date) =>
                                      setEditForm({
                                        ...editForm,
                                        tanggal_checkout: date.toISOString().split("T")[0],
                                      })
                                    }
                                    dateFormat="yyyy-MM-dd"
                                    minDate={editForm.tanggal_checkin ? new Date(editForm.tanggal_checkin) : new Date()}
                                    className="form-control"
                                  />
                                </td>
                                <td className="px-4 py-3">{getStatusBadge(r.status)}</td>
                                <td className="px-4 py-3 text-center">
                                  <div className="btn-group">
                                    <button onClick={() => handleUpdateSubmit(r.id)} className="btn btn-success btn-sm me-2">
                                      <i className="fas fa-save"></i>
                                    </button>
                                    <button onClick={() => setEditingId(null)} className="btn btn-secondary btn-sm">
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="px-4 py-3">{formatDate(r.tanggal_checkin)}</td>
                                <td className="px-4 py-3">{formatDate(r.tanggal_checkout)}</td>
                                <td className="px-4 py-3">{getStatusBadge(r.status)}</td>
                                <td className="px-4 py-3 text-center">
                                  <div className="btn-group">
                                    <button
                                      onClick={() => {
                                        setEditingId(r.id);
                                        setEditForm({
                                          tanggal_checkin: r.tanggal_checkin?.slice(0, 10),
                                          tanggal_checkout: r.tanggal_checkout?.slice(0, 10),
                                        });
                                      }}
                                      className="btn btn-outline-primary btn-sm me-2"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                      onClick={() => handleDelete(r.id)}
                                      className="btn btn-outline-danger btn-sm"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
