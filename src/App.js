import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import TopNavbarLayout from './components/TopNavbarLayout';
import Billing from './components/Billing';
import Inventory from './components/Inventory';
import Visit from './components/Visit';



import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Top Navbar Layout after login */}
      <Route element={<TopNavbarLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/history" element={<Visit />} />
        {/* Add more pages here */}
      </Route>
    </Routes>
  );
}

export default App;
