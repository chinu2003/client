import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './TopNavbar.css';

function TopNavbarLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', shop: 'Shop' };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div>
      {/* Responsive Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <span className="navbar-brand" style={{ color: '#ED0779', fontWeight: 'bold' }}>
          Optics
        </span>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/customers" className="nav-link">Customers</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/billing" className="nav-link">Billing</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/inventory" className="nav-link">Inventory</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/history" className="nav-link">History</NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <div className="text-white me-3 text-end">
              <strong>{user.shop}</strong><br />
              <small>{user.name}</small>
            </div>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content below navbar */}
      <div className="p-4 bg-light" style={{ minHeight: '100vh' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default TopNavbarLayout;
