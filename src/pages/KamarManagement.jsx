import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function KamarManagement() {
  const [kamar, setKamar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newForm, setNewForm] = useState({
    nomor_kamar: "",
    tipe_kamar: "",
    gambar_kamar: "",
    deskripsi: "",
    harga: "",
    status: "tersedia",
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchKamar = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/admin/kamar", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Gagal mengambil data kamar.");
      const data = await res.json();
      setKamar(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/admin/kamar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newForm),
      });
      if (!res.ok) throw new Error("Gagal menambah kamar.");
      alert("Kamar berhasil ditambahkan.");
      setNewForm({
        nomor_kamar: "",
        tipe_kamar: "",
        gambar_kamar: "",
        deskripsi: "",
        harga: "",
        status: "tersedia",
      });
      fetchKamar();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleUpdateSubmit = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/admin/kamar/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Gagal memperbarui kamar.");
      alert("Kamar berhasil diperbarui.");
      setEditingId(null);
      setEditForm({});
      fetchKamar();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus kamar ini?")) return;
    try {
      const res = await fetch(`http://localhost:8000/admin/kamar/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Gagal menghapus kamar.");
      alert("Kamar berhasil dihapus.");
      fetchKamar();
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
    fetchKamar();
  }, [token]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Memuat...</span>
        </div>
        <p className="mt-2">Memuat data kamar...</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-primary">Kelola Kamar</h1>
          <p className="lead text-muted">Manajemen data kamar dan status</p>
          <hr className="w-25 mx-auto" style={{ height: '3px', backgroundColor: '#0d6efd' }} />
        </div>

        {/* Form Tambah */}
        <div className="card shadow border-0 mb-5">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              <i className="bi bi-door-closed me-2"></i>Tambah Kamar Baru
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddSubmit} className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Nomor Kamar</label>
                <input type="text" className="form-control" value={newForm.nomor_kamar} onChange={(e) => setNewForm({ ...newForm, nomor_kamar: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Tipe Kamar</label>
                <input type="text" className="form-control" value={newForm.tipe_kamar} onChange={(e) => setNewForm({ ...newForm, tipe_kamar: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Harga</label>
                <input type="number" className="form-control" value={newForm.harga} onChange={(e) => setNewForm({ ...newForm, harga: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Gambar (nama file)</label>
                <input type="text" className="form-control" value={newForm.gambar_kamar} onChange={(e) => setNewForm({ ...newForm, gambar_kamar: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select className="form-select" value={newForm.status} onChange={(e) => setNewForm({ ...newForm, status: e.target.value })}>
                  <option value="tersedia">Tersedia</option>
                  <option value="terisi">Terisi</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Deskripsi</label>
                <textarea className="form-control" value={newForm.deskripsi} onChange={(e) => setNewForm({ ...newForm, deskripsi: e.target.value })} required />
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-primary">
                  Tambah
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tabel Kamar */}
        <div className="card shadow border-0">
          <div className="card-header bg-dark text-white">
            <h5 className="mb-0">
              <i className="bi bi-building me-2"></i>Daftar Kamar
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nomor</th>
                    <th>Tipe</th>
                    <th>Harga</th>
                    <th>Status</th>
                    <th>Gambar</th>
                    <th>Deskripsi</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {kamar.map((k) => (
                    <tr key={k.id}>
                      <td>{k.id}</td>
                      {editingId === k.id ? (
                        <>
                          <td><input className="form-control form-control-sm" value={editForm.nomor_kamar} onChange={(e) => setEditForm({ ...editForm, nomor_kamar: e.target.value })} /></td>
                          <td><input className="form-control form-control-sm" value={editForm.tipe_kamar} onChange={(e) => setEditForm({ ...editForm, tipe_kamar: e.target.value })} /></td>
                          <td><input type="number" className="form-control form-control-sm" value={editForm.harga} onChange={(e) => setEditForm({ ...editForm, harga: e.target.value })} /></td>
                          <td><select className="form-select form-select-sm" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}><option value="tersedia">Tersedia</option><option value="terisi">Terisi</option></select></td>
                          <td><input className="form-control form-control-sm" value={editForm.gambar_kamar} onChange={(e) => setEditForm({ ...editForm, gambar_kamar: e.target.value })} /></td>
                          <td><textarea className="form-control form-control-sm" value={editForm.deskripsi} onChange={(e) => setEditForm({ ...editForm, deskripsi: e.target.value })} /></td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <button className="btn btn-sm btn-success" onClick={() => handleUpdateSubmit(k.id)}><i className="fas fa-check"></i></button>
                              <button className="btn btn-sm btn-secondary" onClick={() => { setEditingId(null); setEditForm({}); }}><i className="fas fa-times"></i></button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{k.nomor_kamar}</td>
                          <td>{k.tipe_kamar}</td>
                          <td>{k.harga}</td>
                          <td>{k.status}</td>
                          <td><img src={`/images/${k.gambar_kamar}`} alt={k.tipe_kamar} style={{ width: "80px", objectFit: "cover" }} /></td>
                          <td>{k.deskripsi}</td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <button className="btn btn-outline-primary btn-sm" onClick={() => { setEditingId(k.id); setEditForm({ nomor_kamar: k.nomor_kamar, tipe_kamar: k.tipe_kamar, gambar_kamar: k.gambar_kamar, deskripsi: k.deskripsi, harga: k.harga, status: k.status }); }}>
                                <i className="fas fa-edit"></i>
                              </button>
                              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(k.id)}>
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                  {kamar.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">
                        Belum ada kamar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Link to="/admin/dashboard" className="btn btn-secondary">
            &larr; Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}