import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    dob: "",
    eyePrescription: {
      right: { sph: "", cyl: "", axis: "", add: "" },
      left: { sph: "", cyl: "", axis: "", add: "" },
      pd: "",
      notes: "",
    },
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/customers/${userId}`
      );
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchCustomers();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      name.startsWith("eyePrescription.right.") ||
      name.startsWith("eyePrescription.left.")
    ) {
      const [_, eye, field] = name.split(".");
      setForm((prev) => ({
        ...prev,
        eyePrescription: {
          ...prev.eyePrescription,
          [eye]: { ...prev.eyePrescription[eye], [field]: value },
        },
      }));
    } else if (name.startsWith("eyePrescription.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        eyePrescription: { ...prev.eyePrescription, [field]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      dob: "",
      eyePrescription: {
        right: { sph: "", cyl: "", axis: "", add: "" },
        left: { sph: "", cyl: "", axis: "", add: "" },
        pd: "",
        notes: "",
      },
    });
    setIsEditing(false);
    setEditId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (customer) => {
    setForm({ ...customer });
    setIsEditing(true);
    setEditId(customer._id);
    setShowModal(true);
  };

 
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the customer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/customers/${id}`);
          Swal.fire("Deleted!", "Customer has been deleted.", "success");
          fetchCustomers();
        } catch (err) {
          console.error("Delete error:", err);
          Swal.fire("Error", "Failed to delete customer.", "error");
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show confirmation dialog before submitting
    Swal.fire({
      title: isEditing ? "Confirm Update" : "Confirm Add",
      text: isEditing
        ? "Are you sure you want to update this customer?"
        : "Are you sure you want to add this new customer?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: isEditing ? "Yes, Update" : "Yes, Add",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = { ...form, userId };

          if (isEditing) {
            await axios.put(
              `http://localhost:5000/api/customers/${editId}`,
              data
            );
            Swal.fire({
              icon: "success",
              title: "Updated!",
              text: "Customer updated successfully.",
              showConfirmButton: false,
              timer: 2000,
            });
          } else {
            await axios.post(`http://localhost:5000/api/customers`, data);
            Swal.fire({
              icon: "success",
              title: "Added!",
              text: "Customer added successfully.",
              showConfirmButton: false,
              timer: 2000,
            });
          }

          fetchCustomers();
          setShowModal(false);
          resetForm();
        } catch (err) {
          console.error("Submit error:", err);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Failed to submit customer details.",
          });
        }
      }
    });
  };

  const filteredCustomers = customers.filter((c) => {
    const value = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(value) ||
      c.phone.includes(value) ||
      (c.email && c.email.toLowerCase().includes(value))
    );
  });

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between mb-4">
        <h2 className="text-primary">
          <i className="bi bi-people-fill me-2"></i>Customer List
        </h2>
        
        <Button variant="success" onClick={openAddModal}>
          <i className="bi bi-person-plus-fill me-1"></i> Add Customer
        </Button>
        
      </div>
       <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search by name, phone, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>

      {filteredCustomers.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-striped shadow-sm bg-light">
            <thead className="table-primary text-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>DOB</th>
                <th>PD</th>
                <th colSpan="4" className="text-center bg-secondary text-white">
                  Right Eye
                </th>
                <th colSpan="4" className="text-center bg-secondary text-white">
                  Left Eye
                </th>
                <th>Actions</th>
              </tr>
              <tr className="table-light text-center">
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th>Sph</th>
                <th>Cyl</th>
                <th>Axis</th>
                <th>Add</th>
                <th>Sph</th>
                <th>Cyl</th>
                <th>Axis</th>
                <th>Add</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c, idx) => (
                <tr key={c._id}>
                  <td>{idx + 1}</td>
                  <td>{c.name}</td>
                  <td>{c.phone}</td>
                  <td>{c.email || "-"}</td>
                  <td>{c.address || "-"}</td>
                  <td>{c.dob || "-"}</td>
                  <td>{c.eyePrescription?.pd || "-"}</td>
                  <td>{c.eyePrescription?.right?.sph || "-"}</td>
                  <td>{c.eyePrescription?.right?.cyl || "-"}</td>
                  <td>{c.eyePrescription?.right?.axis || "-"}</td>
                  <td>{c.eyePrescription?.right?.add || "-"}</td>
                  <td>{c.eyePrescription?.left?.sph || "-"}</td>
                  <td>{c.eyePrescription?.left?.cyl || "-"}</td>
                  <td>{c.eyePrescription?.left?.axis || "-"}</td>
                  <td>{c.eyePrescription?.left?.add || "-"}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => openEditModal(c)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(c._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted">No customers found.</p>
      )}

      {/* Modal for Add/Edit */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          resetForm();
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i
              className={`bi bi-person-${
                isEditing ? "check" : "plus"
              }-fill me-2`}
            ></i>
            {isEditing ? "Edit Customer" : "Add Customer"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
              />
            </Form.Group>

            <hr />
            <h5 className="text-primary">Eye Prescription</h5>
            <Row>
              <Col md={6}>
                <h6>Right Eye</h6>
                {["sph", "cyl", "axis", "add"].map((field) => (
                  <Form.Group className="mb-2" key={field}>
                    <Form.Label>{field.toUpperCase()}</Form.Label>
                    <Form.Control
                      name={`eyePrescription.right.${field}`}
                      value={form.eyePrescription.right[field]}
                      onChange={handleChange}
                    />
                  </Form.Group>
                ))}
              </Col>
              <Col md={6}>
                <h6>Left Eye</h6>
                {["sph", "cyl", "axis", "add"].map((field) => (
                  <Form.Group className="mb-2" key={field}>
                    <Form.Label>{field.toUpperCase()}</Form.Label>
                    <Form.Control
                      name={`eyePrescription.left.${field}`}
                      value={form.eyePrescription.left[field]}
                      onChange={handleChange}
                    />
                  </Form.Group>
                ))}
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>PD</Form.Label>
                  <Form.Control
                    name="eyePrescription.pd"
                    value={form.eyePrescription.pd}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    name="eyePrescription.notes"
                    value={form.eyePrescription.notes}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {isEditing ? "Save Changes" : "Add Customer"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Customers;
