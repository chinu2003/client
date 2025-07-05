import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Card } from "react-bootstrap";
import {
  FaUsers,
  FaBoxOpen,
  FaReceipt,
  FaMoneyBillWave,
  FaGlasses,
} from "react-icons/fa";
import "./Dashboard.css"; // CSS for animations

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "User",
    shop: "Shop",
    id: "user_id",
  };
  const userId = user.id;

  const [counts, setCounts] = useState({
    customers: 0,
    products: 0,
    bills: 0,
    totalSell: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, prodRes, billRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/customers/${userId}`),
          axios.get(`http://localhost:5000/api/products?userId=${userId}`),
          axios.get(`http://localhost:5000/api/bills?userId=${userId}`),
        ]);

        const totalSell = billRes.data.reduce(
          (sum, b) => sum + b.totalAmount,
          0
        );

        setCounts({
          customers: custRes.data.length,
          products: prodRes.data.length,
          bills: billRes.data.length,
          totalSell,
        });
      } catch (err) {
        console.error("Dashboard data error:", err);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="p-4">
      <h2 className="text-primary">
           Welcome, <b>{user.name}</b>
      </h2>
      <p className="text-muted">
        Shop: <strong>{user.shop}</strong>
      </p>

      <Row className="mt-4 g-4">
        <Col md={6} lg={3}>
          <Card className="dashboard-card shadow animate-card">
            <Card.Body>
              <FaUsers size={32} className="text-primary mb-2" />
              <Card.Title>Total Customers</Card.Title>
              <h2>{counts.customers}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="dashboard-card shadow animate-card">
            <Card.Body>
              <FaBoxOpen size={32} className="text-success mb-2" />
              <Card.Title>Total Products</Card.Title>
              <h2>{counts.products}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="dashboard-card shadow animate-card">
            <Card.Body>
              <FaReceipt size={32} className="text-warning mb-2" />
              <Card.Title>Total Bills</Card.Title>
              <h2>{counts.bills}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="dashboard-card shadow animate-card">
            <Card.Body>
              <FaMoneyBillWave size={32} className="text-danger mb-2" />
              <Card.Title>Total Sales</Card.Title>
              <h2>₹{counts.totalSell}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
