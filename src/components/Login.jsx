import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import opticsLogo from "../assets/optic.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // React Router hook

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      if (res.data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: res.data.id,
            name: res.data.name,
            shop: res.data.shop,
          })
        );
        navigate("/dashboard");
      }
      // if (res.data.success) {
      //   alert("Login successful!");
      //   navigate("/dashboard");
      // }
      else {
        alert(res.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed. Server error.");
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card shadow-lg p-4 animate__animated animate__fadeInDown"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#f0f8ff",
          border: "2px solid #ED0779",
          borderRadius: "20px",
        }}
      >
        <div className="text-center mb-4">
          <img src={opticsLogo} alt="Optics Logo" width="80" />
          <h2 className="mt-3" style={{ color: "#308EFF" }}>
            Optics Login
          </h2>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label text-dark">
              <i className="bi bi-envelope-fill me-2 text-primary"></i>Email
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-dark">
              <i className="bi bi-lock-fill me-2 text-primary"></i>Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: "#308EFF",
              color: "#fff",
              fontWeight: "600",
            }}
          >
            Login
          </button>

          <p className="text-center mt-3" style={{ color: "#444" }}>
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{ color: "#ED0779", fontWeight: "600" }}
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
