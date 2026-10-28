import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { GiWheat } from 'react-icons/gi';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', enrollmentNumber: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.enrollmentNumber || !form.email || !form.password) { setError('All fields are required.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const res = await authService.register({
        name: form.name,
        enrollmentNumber: form.enrollmentNumber,
        email: form.email,
        password: form.password,
      });
      login(res.data.user, res.data.token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card fade-in-up">
        <div className="auth-logo mb-1">
          <GiWheat style={{ color: 'var(--primary)' }} /> AgriTech
        </div>
        <p className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>Create your farming account</p>

        {error && <Alert variant="danger" className="alert-agri" onClose={() => setError('')} dismissible>{error}</Alert>}

        <Form onSubmit={handleSubmit} className="agri-form">
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control id="reg-name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Farmer" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Enrollment Number</Form.Label>
            <Form.Control id="reg-enrollment" type="text" name="enrollmentNumber" value={form.enrollmentNumber} onChange={handleChange} placeholder="e.g. EN24IT3010095" maxLength={50} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control id="reg-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="farmer@example.com" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control id="reg-password" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" required />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control id="reg-confirm" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" required />
          </Form.Group>
          <Button type="submit" className="btn-agri w-100 mb-3" disabled={loading}>
            {loading ? <><Spinner size="sm" className="me-2" />Creating account...</> : 'Create Account'}
          </Button>
        </Form>

        <p className="text-center mb-0" style={{ fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
