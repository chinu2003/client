import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Form, Row, Col, Container } from 'react-bootstrap';

export default function Visit() {
  const [visits, setVisits] = useState([]);
  const [search, setSearch] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      fetchVisits();
    }
  }, [userId]);

  const fetchVisits = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/visits?userId=${userId}`);
      setVisits(res.data);
    } catch (err) {
      console.error('Error fetching visits', err);
    }
  };

  const filteredVisits = visits.filter((v) =>
    v.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.customer?.phone?.includes(search)
  );

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-primary">Visit History</h2>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search by name or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Customer Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Bill ID</th>
            <th>Visit Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredVisits.length > 0 ? (
            filteredVisits.map((visit, idx) => (
              <tr key={visit._id}>
                <td>{idx + 1}</td>
                <td>{visit.customer?.name || '-'}</td>
                <td>{visit.customer?.phone || '-'}</td>
                <td>{visit.customer?.email || '-'}</td>
                <td>{visit.customer?.address || '-'}</td>
                <td>{visit._id}</td>
                <td>{new Date(visit.createdAt).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted">
                No visit records found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}
