import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Form, Table, Row, Col } from "react-bootstrap";
import html2pdf from 'html2pdf.js';



function Billing() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);
  const [bills, setBills] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchData();
    fetchBills();
  }, []);

  async function fetchData() {
    try {
      const [cRes, iRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/customers/${userId}`),
        axios.get(`http://localhost:5000/api/products?userId=${userId}`),
      ]);
      setCustomers(cRes.data);
      setInventory(iRes.data);
    } catch (e) {
      Swal.fire("Error", "Could not load customers or inventory", "error");
    }
  }

  async function fetchBills() {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/bills?userId=${userId}`
      );
      setBills(res.data);
    } catch (err) {
      /* ignore */
    }
  }

  const addToCart = () => {
    const item = inventory.find((i) => i._id === selectedItem);
    if (!item) return Swal.fire("Error", "Please select a product", "error");
    if (quantity < 1 || quantity > item.quantity) {
      return Swal.fire("Error", "Invalid quantity", "error");
    }
    const total = item.sellingPrice * quantity;
    setCart([
      ...cart,
      {
        productId: item._id,
        name: item.name,
        price: item.sellingPrice,
        quantity,
        total,
      },
    ]);
    setSelectedItem("");
    setQuantity(1);
  };

  const removeCartItem = (idx) => {
    setCart(cart.filter((_, i) => i !== idx));
  };

  const createBill = async () => {
    if (!selectedCustomer || cart.length === 0) {
      return Swal.fire("Error", "Select customer and add items", "error");
    }

    const payload = {
      userId,
      customerId: selectedCustomer,
      items: cart,
      totalAmount: cart.reduce((s, it) => s + it.total, 0),
    };

    const { isConfirmed } = await Swal.fire({
      title: "Create Bill?",
      text: `Total ₹${payload.totalAmount}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, create",
      cancelButtonText: "Cancel",
    });

    if (!isConfirmed) return;
    try {
      await axios.post("http://localhost:5000/api/bills", payload);
      Swal.fire("Done", "Bill created", "success");
      fetchBills();
      setCart([]);
      setSelectedCustomer("");
    } catch {
      Swal.fire("Error", "Could not create bill", "error");
    }
  };
  
  // -------------------to print bill--------------------- 
const handlePrintBill = async (selectedBill) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/bills/${selectedBill._id}`);
    const bill = res.data;

    const customer = bill.customer || {};
    const items = bill.items || [];
    const user= bill.user || {};
    const element = document.createElement('div');

    element.innerHTML = `
      <div style="font-family: Arial; padding: 20px; max-width: 800px; margin: auto;">
        <h2 style="text-align:center;">${user.shop || "Optics"}</h2>
        <p style="text-align:center;">Shop Owner:${user.name}<br>
        ${user.location}<br>
        Phone: ${user.mobile} | Email: ${user.email}</p>
        <hr>
        <p><strong>Bill ID:</strong> ${bill._id}</p>
        <p><strong>Date:</strong> ${new Date(bill.createdAt).toLocaleString()}</p>
        
        <h3>Customer Details</h3>
        <p>
          <strong>Name:</strong> ${customer.name || '-'}<br>
          <strong>Phone:</strong> ${customer.phone || '-'}<br>
          <strong>Email:</strong> ${customer.email || '-'}<br>
          <strong>Address:</strong> ${customer.address || '-'}
        </p>

        <h3>Items</h3>
        <table style="width:100%; border-collapse: collapse;" border="1">
          <thead>
            <tr>
              <th style="padding:8px;">Item</th>
              <th style="padding:8px;">Price</th>
              <th style="padding:8px;">Qty</th>
              <th style="padding:8px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td style="padding:8px;">${item.name}</td>
                <td style="padding:8px;">₹${item.price}</td>
                <td style="padding:8px;">${item.quantity}</td>
                <td style="padding:8px;">₹${item.total}</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="3" style="text-align:right; padding:8px;"><strong>Grand Total</strong></td>
              <td style="padding:8px;"><strong>₹${bill.totalAmount}</strong></td>
            </tr>
          </tbody>
        </table>

        <p style="text-align:center; margin-top: 40px;">Thank you for shopping with us!</p>
      </div>
    `;

    html2pdf().from(element).set({
      margin: 0.5,
      filename: `bill-${bill._id}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).save();

  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Could not generate bill", "error");
  }
};
  
  
  return (
    <div className="p-4">
      <h2 className="text-primary">
        <i className="bi bi-bag-fill me-2 " />
        Billing
      </h2>
      <Row className="g-2 mb-3">
        <Col>
          <Form.Select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Form.Select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
          >
            <option value="">Select Product</option>
            {inventory.map((i) => (
              <option key={i._id} value={i._id}>
                {i.name} (₹{i.sellingPrice})
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Form.Control
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(+e.target.value)}
          />
        </Col>
        <Col>
          <Button onClick={addToCart}>Add</Button>
        </Col>
      </Row>

      <Table striped bordered className="mb-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((it, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{it.name}</td>
              <td>₹{it.price}</td>
              <td>{it.quantity}</td>
              <td>₹{it.total}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeCartItem(i)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
          {cart.length > 0 && (
            <tr>
              <td colSpan={4} className="text-end">
                <strong>Total</strong>
              </td>
              <td colSpan={2}>
                <strong>₹{cart.reduce((s, it) => s + it.total, 0)}</strong>
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {cart.length > 0 && (
        <Button variant="success" onClick={createBill}>
          Create Bill
        </Button>
      )}

      <hr />

      <h3>Previous Bills</h3>
      <Table striped bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>Customer</th>
            <th>Mobile NO</th>
            <th>Address</th>
            <th>Total</th>
            <th>Date</th>
            <th>Print</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((b, idx) => {
            const cust = customers.find((c) => c._id === b.customerId);
            return (
              <tr key={b._id}>
                <td>{idx + 1}</td>
                <td>{cust?.name || "—"}</td>
                <td>{cust?.phone || "—"}</td>
                <td>{cust?.address || "—"}</td>
                <td>₹{b.totalAmount}</td>
                <td>{new Date(b.createdAt).toLocaleString()}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handlePrintBill(b)}
                  >
                    Print
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default Billing;
