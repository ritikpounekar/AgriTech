import React, { useState, useEffect } from 'react';
import { Table, Badge, Alert, Spinner, Button } from 'react-bootstrap';
import { FaUsers, FaUserShield, FaUser } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import { adminService } from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    adminService.getUsers()
      .then(res => setUsers(res.data))
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await adminService.updateUserRole(user._id, newRole);
      setSuccess(`${user.name} is now ${newRole}.`);
      fetchUsers();
    } catch { setError('Failed to update role.'); }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header mb-4">
          <h1><FaUsers className="me-2" />User Management</h1>
        </div>

        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

        {loading ? (
          <div className="spinner-agri"><Spinner animation="border" variant="success" /></div>
        ) : (
          <div className="agri-table">
            <Table responsive hover className="mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Enrollment Number</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id}>
                    <td>{i + 1}</td>
                    <td>{u.name}</td>
                    <td>{u.enrollmentNumber || '-'}</td>
                    <td>{u.email}</td>
                    <td>
                      <Badge bg={u.role === 'admin' ? 'danger' : 'success'}>
                        {u.role === 'admin' ? <FaUserShield className="me-1" /> : <FaUser className="me-1" />}
                        {u.role}
                      </Badge>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant={u.role === 'admin' ? 'outline-secondary' : 'outline-danger'}
                        onClick={() => toggleRole(u)}
                      >
                        {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
