import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
        fetchUsers();
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
    <div className="container mt-4">
      <h2>Kelola Pengguna</h2>

      <form onSubmit={editMode ? handleUpdateUser : handleCreateUser} className="mb-4">
        <h4>{editMode ? 'Edit User' : 'Tambah User Baru'}</h4>
        <div className="mb-2">
          <input
            type="text"
            name="nama"
            placeholder="Nama"
            className="form-control"
            value={formData.nama}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            name="no_telepon"
            placeholder="No Telepon"
            className="form-control"
            value={formData.no_telepon}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-control"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control"
            value={formData.password}
            onChange={handleInputChange}
            required={!editMode}
          />
        </div>
        <button className="btn btn-primary me-2" type="submit">
          {editMode ? 'Update User' : 'Tambah User'}
        </button>
        {editMode && (
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => {
              setEditMode(false);
              setEditId(null);
              setFormData({ nama: '', no_telepon: '', email: '', password: '' });
            }}
          >
            Batal
          </button>
        )}
      </form>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>No Telepon</th>
            <th>Role</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.nama}</td>
              <td>{u.email}</td>
              <td>{u.no_telepon}</td>
              <td>
                {currentAdminId === u.id ? (
                  <span className="text-muted">({u.role})</span>
                ) : (
                  <select
                    className="form-select"
                    value={u.role}
                    onChange={(e) => handleChangeRole(u.id, e.target.value)}
                  >
                    <option value="tamu">Tamu</option>
                    <option value="admin">Admin</option>
                  </select>
                )}
              </td>
              <td>
                {currentAdminId !== u.id && (
                  <>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(u.id)}
                    >
                      Hapus
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
