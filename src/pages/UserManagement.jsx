// pages/UserManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [currentAdminId, setCurrentAdminId] = useState(null);

  const token = localStorage.getItem('token'); // pastikan token tersimpan saat login

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
      setCurrentAdminId(res.data.id); // asumsi endpoint ini mengembalikan info user saat ini
    } catch (error) {
      console.error('Gagal ambil data admin:', error);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Yakin ingin menghapus user ini?')) {
      try {
        await axios.delete(`http://localhost:8000/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers(); // refresh list
      } catch (error) {
        console.error('Gagal hapus user:', error);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCurrentAdmin();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Kelola Pengguna</h2>
      <table className="table table-bordered mt-3">
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
                    onChange={async (e) => {
                      try {
                        await axios.put(
                          `http://localhost:8000/admin/users/${u.id}`,
                          { role: e.target.value },
                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                        fetchUsers();
                      } catch (err) {
                        alert('Gagal ubah role');
                      }
                    }}
                  >
                    <option value="tamu">Tamu</option>
                    <option value="admin">Admin</option>
                  </select>
                )}
              </td>
              <td>
                {currentAdminId !== u.id && (
                  <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u.id)}>
                    Hapus
                  </button>
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
