import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaWarehouse, FaSeedling, FaShoppingCart, FaCloudSun,
  FaBoxOpen, FaArrowRight
} from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { farmService, cropService, orderService } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ farms: 0, crops: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([farmService.getAll(), cropService.getAll(), orderService.getMyOrders()])
      .then(([farmsRes, cropsRes, ordersRes]) => {
        setStats({
          farms: farmsRes.data.length,
          crops: cropsRes.data.length,
          orders: ordersRes.data.length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const quickLinks = [
    { to: '/farms', icon: <FaWarehouse />, label: 'Manage Farms', color: '#2d6a4f' },
    { to: '/crops', icon: <FaSeedling />, label: 'View Crops', color: '#52b788' },
    { to: '/products', icon: <FaBoxOpen />, label: 'Shop Products', color: '#95d5b2' },
    { to: '/weather', icon: <FaCloudSun />, label: 'Check Weather', color: '#0096c7' },
    { to: '/my-orders', icon: <FaShoppingCart />, label: 'My Orders', color: '#f4a261' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header mb-4">
          <h1>👋 Welcome back, {user?.name}!</h1>
          <p className="mb-0" style={{ opacity: 0.85 }}>Here's an overview of your farming activities.</p>
          {user?.enrollmentNumber && (
            <p className="mb-0 mt-2" style={{ opacity: 0.85 }}>
              Enrollment Number: {user.enrollmentNumber}
            </p>
          )}
        </div>

        {loading ? (
          <div className="spinner-agri"><Spinner animation="border" variant="success" /></div>
        ) : (
          <>
            <Row className="g-4 mb-4">
              {[
                { label: 'Total Farms', value: stats.farms, icon: <FaWarehouse />, color: '#2d6a4f' },
                { label: 'Active Crops', value: stats.crops, icon: <FaSeedling />, color: '#52b788' },
                { label: 'My Orders', value: stats.orders, icon: <FaShoppingCart />, color: '#f4a261' },
              ].map((s, i) => (
                <Col key={i} sm={6} lg={4}>
                  <div className="stat-card">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                      </div>
                      <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}>
                        {s.icon}
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            <h5 className="fw-700 mb-3" style={{ color: 'var(--primary-dark)' }}>Quick Actions</h5>
            <Row className="g-3">
              {quickLinks.map((link, i) => (
                <Col key={i} sm={6} md={4}>
                  <Link to={link.to} className="text-decoration-none">
                    <div className="agri-card p-3 d-flex align-items-center gap-3">
                      <div style={{
                        width: 44, height: 44, borderRadius: 10,
                        background: `${link.color}20`, color: link.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                      }}>
                        {link.icon}
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{link.label}</span>
                      <FaArrowRight className="ms-auto" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }} />
                    </div>
                  </Link>
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>
    </div>
  );
}
