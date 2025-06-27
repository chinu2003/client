import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './Dashboard.css';

function SidebarLayout() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', shop: 'Shop' };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="d-flex">
      <div className="sidebar bg-dark text-white p-3">
        <h3 className="text-center mb-3" style={{ color: '#ED0779' }}>Optics</h3>
        <div className="text-center mb-4">
          <strong>{user.name}</strong><br />
          <small className="text-muted">{user.shop}</small>
        </div>

        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink to="/customers" className="nav-link">Customers</NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink to="/billing" className="nav-link">Billing</NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink to="/inventory" className="nav-link">Inventory</NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink to="/history" className="nav-link">Visits / History</NavLink>
          </li>
          <li className="nav-item mt-4">
            <button onClick={handleLogout} className="btn btn-outline-light w-100">
              Logout
            </button>
          </li>
        </ul>
      </div>

      <div className="main-content flex-grow-1 p-4 bg-light">
        <Outlet />
      </div>
    </div>
  );
}

export default SidebarLayout;
