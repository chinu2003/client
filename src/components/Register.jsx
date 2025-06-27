import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import opticsLogo from '../assets/optic.png';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    shop: '',
    location: '',
    password: ''
  });

  const navigate = useNavigate(); // for redirecting to login

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/register', formData);
      alert(res.data.message || 'Registration successful!');
      navigate('/login'); // redirect to login after success
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message); // e.g., "User already exists"
      } else {
        alert('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="card shadow-lg p-4 animate__animated animate__fadeInDown" style={{
      width: '100%',
      maxWidth: '500px',
      margin: 'auto',
      backgroundColor: '#f4f9ff',
      border: '2px solid #ED0779',
      borderRadius: '20px'
    }}>
      <div className="text-center mb-4">
        <img src={opticsLogo} alt="Optics Logo" width="60" />
        <h2 className="mt-2" style={{ color: '#308EFF' }}>Optics Register</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label text-dark"><i className="bi bi-person-fill me-2 text-primary"></i>Name</label>
          <input type="text" name="name" className="form-control" placeholder="Your full name" required onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label text-dark"><i className="bi bi-envelope-fill me-2 text-primary"></i>Mobile Number</label>
          <input type="text" name="mobile" className="form-control" placeholder="Your Mobile No" required onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label text-dark"><i className="bi bi-envelope-fill me-2 text-primary"></i>Email</label>
          <input type="email" name="email" className="form-control" placeholder="Your email" required onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label text-dark"><i className="bi bi-shop-window me-2 text-primary"></i>Shop Name</label>
          <input type="text" name="shop" className="form-control" placeholder="Shop name" required onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label text-dark"><i className="bi bi-geo-alt-fill me-2 text-primary"></i>Location</label>
          <input type="text" name="location" className="form-control" placeholder="Location" required onChange={handleChange} />
        </div>

        <div className="mb-4">
          <label className="form-label text-dark"><i className="bi bi-lock-fill me-2 text-primary"></i>Password</label>
          <input type="password" name="password" className="form-control" placeholder="Choose a password" required onChange={handleChange} />
        </div>

        <button type="submit" className="btn w-100" style={{ backgroundColor: '#308EFF', color: 'white' }}>
          Register
        </button>

        <p className="text-center mt-3 text-secondary">
          Already have an account? <Link to="/login" style={{ color: '#ED0779', fontWeight: '600' }}>Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
