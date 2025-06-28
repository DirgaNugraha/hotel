import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function FasilitasManagement() {
  const [fasilitas, setFasilitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newForm, setNewForm] = useState({
    nama_fasilitas: "",
    deskripsi: "",
    gambar_fasilitas: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchFasilitas = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/admin/fasilitas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal mengambil data fasilitas.");
      const data = await res.json();
      setFasilitas(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/admin/fasilitas", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newForm),
      });
      if (!res.ok) throw new Error("Gagal menambah fasilitas.");
      alert("Fasilitas berhasil ditambahkan.");
      setNewForm({ nama_fasilitas: "", deskripsi: "", gambar_fasilitas: "" });
      fetchFasilitas();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateSubmit = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/admin/fasilitas/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Gagal memperbarui fasilitas.");
      alert("Berhasil diperbarui.");
      setEditingId(null);
      setEditForm({});
      fetchFasilitas();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus fasilitas ini?")) return;
    try {
      const res = await fetch(`http://localhost:8000/admin/fasilitas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal menghapus fasilitas.");
      alert("Fasilitas dihapus.");
      fetchFasilitas();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (!token) {
      alert("Silakan login terlebih dahulu.");
      navigate("/login-ui");
      return;
    }
    fetchFasilitas();
  }, [token]);

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-primary">Kelola Fasilitas</h1>
          <p className="lead text-muted">Manajemen data fasilitas hotel</p>
          <hr className="w-25 mx-auto" style={{ height: "3px", backgroundColor: "#0d6efd" }} />
        </div>

        {/* Form Tambah */}
        <div className="card shadow border-0 mb-5">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Tambah Fasilitas Baru</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Nama Fasilitas</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newForm.nama_fasilitas}
                    onChange={(e) =>
                      setNewForm({ ...newForm, nama_fasilitas: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Gambar (nama file)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newForm.gambar_fasilitas}
                    onChange={(e) =>
                      setNewForm({ ...newForm, gambar_fasilitas: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Deskripsi</label>
                  <textarea
                    className="form-control"
                    value={newForm.deskripsi}
                    onChange={(e) =>
                      setNewForm({ ...newForm, deskripsi: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="mt-4 d-flex justify-content-end">
                <button type="submit" className="btn btn-primary">
                  Tambah Fasilitas
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tabel */}
        <div className="card shadow border-0">
          <div className="card-header bg-dark text-white">
            <h5 className="mb-0">Daftar Fasilitas</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nama</th>
                    <th>Gambar</th>
                    <th>Deskripsi</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {fasilitas.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        Belum ada fasilitas.
                      </td>
                    </tr>
                  ) : (
                    fasilitas.map((f) => (
                      <tr key={f.id}>
                        <td>{f.id}</td>
                        {editingId === f.id ? (
                          <>
                            <td>
                              <input
                                className="form-control form-control-sm"
                                value={editForm.nama_fasilitas}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, nama_fasilitas: e.target.value })
                                }
                              />
                            </td>
                            <td>
                              <input
                                className="form-control form-control-sm"
                                value={editForm.gambar_fasilitas}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, gambar_fasilitas: e.target.value })
                                }
                              />
                            </td>
                            <td>
                              <textarea
                                className="form-control form-control-sm"
                                value={editForm.deskripsi}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, deskripsi: e.target.value })
                                }
                              />
                            </td>
                            <td className="text-center">
                              <div className="d-flex justify-content-center gap-2">
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleUpdateSubmit(f.id)}
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary"
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
                            <td>{f.nama_fasilitas}</td>
                            <td>
                              <img
                                src={`/images/${f.gambar_fasilitas}`}
                                alt={f.nama_fasilitas}
                                style={{ width: "100px", objectFit: "cover" }}
                              />
                            </td>
                            <td>{f.deskripsi}</td>
                            <td className="text-center">
                              <div className="d-flex justify-content-center gap-2">
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => {
                                    setEditingId(f.id);
                                    setEditForm({
                                      nama_fasilitas: f.nama_fasilitas,
                                      gambar_fasilitas: f.gambar_fasilitas,
                                      deskripsi: f.deskripsi,
                                    });
                                  }}
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDelete(f.id)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
