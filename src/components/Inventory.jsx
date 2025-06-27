import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Form, Table, Row, Col, Alert, Modal } from "react-bootstrap";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: "",
    modelCode: "",
    color: "",
    size: "",
    quantity: "",
    costPrice: "",
    sellingPrice: "",
    gstPercent: "",
    minStockAlert: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/products?userId=${userId}`
      );
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.category || !form.quantity) {
      return Swal.fire(
        "Error",
        "Name, Category & Quantity are required",
        "error"
      );
    }
   
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/products/${editId}`, {
          ...form,
          userId,
        });

        Swal.fire("Updated", "Product updated successfully", "success");
      } else {
        await axios.post(`http://localhost:5000/api/products`, {
          ...form,
          userId,
        });
        Swal.fire("Added", "Product added successfully", "success");
      }
      fetchProducts();
      setShowAddModal(false);
      resetForm();
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "Failed to save product", "error");
    }
    console.log("userId from localStorage:", userId);
    console.log("Data being sent:", { ...form, userId });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);

        Swal.fire("Deleted", "Product removed", "success");
        fetchProducts();
      } catch (e) {
        console.error(e);
        Swal.fire("Error", "Failed to delete product", "error");
      }
    }
  };

  const openEdit = (p) => {
    setForm(p);
    setIsEditing(true);
    setEditId(p._id);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      brand: "",
      modelCode: "",
      color: "",
      size: "",
      quantity: "",
      costPrice: "",
      sellingPrice: "",
      gstPercent: "",
      minStockAlert: "",
    });
    setIsEditing(false);
    setEditId(null);
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">
      <h3 className="text-primary mb-4">
        <i className="bi bi-eyeglasses me-1 "></i>Inventory
      </h3>

      {/* Search & Add Product Section */}
      <Row className="align-items-center mb-4">
        <Col md={6}>
          <Form.Group>
            {/* <Form.Label></Form.Label> */}
            <div className="input-group">
              <span className="input-group-text ">
                <i className="bi bi-search"></i>
              </span>
              <Form.Control
                placeholder="Search by Name, Brand, or Category"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </Form.Group>
        </Col>
        <Col md={6} className="text-md-end mt-3 mt-md-0">
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <i className="bi bi-plus-lg me-1"></i> Add Product
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive className="mb-4">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Qty</th>
            {/* <th>MinQty</th> */}
            <th>Cost</th>
            <th>Sell</th>
            <th>GST%</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length ? (
            filtered.map((p, i) => (
              <tr key={p._id}>
                <td>{i + 1}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.brand}</td>
                <td>{p.modelCode}</td>
                <td>{p.quantity}</td>
                {/* <td>{p.minStockAlert}</td> */}
                <td>₹{p.costPrice}</td>
                <td>₹{p.sellingPrice}</td>
                <td>{p.gstPercent}%</td>
                <td>
                  {+p.quantity <= +p.minStockAlert ? (
                    <Alert variant="danger" className="p-1 m-0 text-center">
                      Low Stock
                    </Alert>
                  ) : (
                    <span className="text-success">✔️</span>
                  )}
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => openEdit(p)}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12" className="text-center">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal
        show={showAddModal}
        onHide={() => {
          setShowAddModal(false);
          resetForm();
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit" : "Add"} Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={4} className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Select
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              >
                <option value="">--Select--</option>
                <option>RayBan Aviator</option>
                <option>Essilor Lens</option>
              </Form.Select>
            </Col>
            <Col md={4} className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">--Select--</option>
                <option>Frame</option>
                <option>Lens</option>
                <option>Sunglass</option>
                <option>Contact Lens</option>
                <option>Accessory</option>
              </Form.Select>
            </Col>
            <Col md={4} className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Select
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              >
                <option value="">--Select--</option>
                <option>RayBan</option>
                <option>Essilor</option>
                <option>Crizal</option>
              </Form.Select>
            </Col>
            {[
              ["modelCode", "Model Code"],
              ["color", "Color"],
              ["size", "Size"],
              ["quantity", "Qty"],
              ["minStockAlert", "Min Stock"],
              ["costPrice", "Cost Price"],
              ["sellingPrice", "Selling Price"],
              ["gstPercent", "GST %"],
            ].map(([key, label], i) => (
              <Col md={6} className="mb-3" key={i}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  type={
                    [
                      "quantity",
                      "minStockAlert",
                      "costPrice",
                      "sellingPrice",
                      "gstPercent",
                    ].includes(key)
                      ? "number"
                      : "text"
                  }
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAddModal(false);
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {isEditing ? "Save" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Inventory;
