import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [currentAdminId, setCurrentAdminId] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    no_telepon: '',
    email: '',
    password: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error('Gagal ambil data user:', error);
    }
  };

  const fetchCurrentAdmin = async () => {
    try {
      const res = await axios.get('http://localhost:8000/login-user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentAdminId(res.data.id);
    } catch (error) {
      console.error('Gagal ambil data admin:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCurrentAdmin();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus user ini?')) {
      try {
        await axios.delete(`http://localhost:8000/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Hapus user dari state lokal
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));
      } catch (error) {
        console.error('Gagal hapus user:', error);
      }
    }
  };


  const handleChangeRole = async (id, newRole) => {
    try {
      await axios.put(
        `http://localhost:8000/admin/users/${id}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      alert('Gagal ubah role');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/users', formData);
      setFormData({ nama: '', no_telepon: '', email: '', password: '' });
      fetchUsers();
    } catch (err) {
      alert('Gagal tambah user');
    }
  };

  const handleEditClick = (user) => {
    setEditMode(true);
    setEditId(user.id);
    setFormData({
      nama: user.nama,
      no_telepon: user.no_telepon,
      email: user.email,
      password: '',
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/admin/users/${editId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditMode(false);
      setEditId(null);
      setFormData({ nama: '', no_telepon: '', email: '', password: '' });
      fetchUsers();
    } catch (err) {
      alert('Gagal update user');
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container py-5">

        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-primary">Kelola Pengguna</h1>
          <p className="lead text-muted">Manajemen pengguna dan hak akses sistem</p>
          <hr className="w-25 mx-auto" style={{ height: '3px', backgroundColor: '#0d6efd' }} />
        </div>

        {/* Form */}
        <div className="card shadow border-0 mb-5">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              <i className={`bi ${editMode ? 'bi-pencil-square' : 'bi-person-plus'} me-2`}></i>
              {editMode ? 'Edit User' : 'Tambah User Baru'}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={editMode ? handleUpdateUser : handleCreateUser}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nama</label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">No Telepon</label>
                  <input
                    type="text"
                    name="no_telepon"
                    value={formData.no_telepon}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder={editMode ? "Kosongkan jika tidak diubah" : "Masukkan password"}
                    required={!editMode}
                  />
                </div>
              </div>
              <div className="mt-4 d-flex justify-content-end gap-2">
                {editMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setEditId(null);
                      setFormData({ nama: '', no_telepon: '', email: '', password: '' });
                    }}
                    className="btn btn-secondary"
                  >
                    Batal
                  </button>
                )}
                <button type="submit" className="btn btn-primary">
                  {editMode ? 'Update' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Table */}
        <div className="card shadow border-0">
          <div className="card-header bg-dark text-white">
            <h5 className="mb-0"><i className="bi bi-people me-2"></i>Daftar Pengguna</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>No Telepon</th>
                    <th>Role</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      {editId === u.id ? (
                        <>
                          {/* Editable row */}
                          <td>
                            <input
                              type="text"
                              name="nama"
                              className="form-control form-control-sm"
                              value={formData.nama}
                              onChange={handleInputChange}
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="email"
                              name="email"
                              className="form-control form-control-sm"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="no_telepon"
                              className="form-control form-control-sm"
                              value={formData.no_telepon}
                              onChange={handleInputChange}
                              required
                            />
                          </td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              name="role"
                              value={u.role}
                              onChange={(e) => handleChangeRole(u.id, e.target.value)}
                              style={{ maxWidth: "120px" }}
                            >
                              <option value="admin">Admin</option>
                              <option value="tamu">Tamu</option>
                            </select>
                          </td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <button
                                className="btn btn-sm btn-success"
                                title="Simpan"
                                onClick={handleUpdateUser}
                              >
                                <i className="fas fa-check"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                title="Batal"
                                onClick={() => {
                                  setEditId(null);
                                  setEditMode(false);
                                  setFormData({ nama: '', no_telepon: '', email: '', password: '' });
                                }}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          {/* Static row */}
                          <td>{u.nama}</td>
                          <td>{u.email}</td>
                          <td>{u.no_telepon}</td>
                          <td>
                            {currentAdminId === u.id ? (
                              <span className="badge bg-success">Admin (Anda)</span>
                            ) : (
                              <select
                                className="form-select form-select-sm"
                                style={{ maxWidth: "120px" }}
                                value={u.role}
                                onChange={(e) => handleChangeRole(u.id, e.target.value)}
                              >
                                <option value="admin">Admin</option>
                                <option value="tamu">Tamu</option>
                              </select>
                            )}
                          </td>
                          <td className="text-center">
                            {currentAdminId !== u.id && (
                              <div className="d-flex justify-content-center gap-2">
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => handleEditClick(u)}
                                  title="Edit User"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDelete(u.id)}
                                  title="Hapus User"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        Belum ada pengguna.
                      </td>
                    </tr>
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
};

export default UserManagement;
