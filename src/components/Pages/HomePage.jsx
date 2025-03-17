
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import MyFooter from "../layout/MyFooter";
import MyNavbar from "../layout/MyNavbar";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";

export default function HomePage() {
  const [cookie] = useCookies(["jwtToken"]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Rental State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [totalDays, setTotalDays] = useState(1);
  const [totalCost, setTotalCost] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Default 6 items per page

  useEffect(() => {
    async function fetchEquipmentData() {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/user/getAllEquipment`,
          { headers: { Authorization: `Bearer ${cookie.jwtToken}` }, withCredentials: true }
        );
        setEquipmentData(response.data);
        fetchImages(response.data);
      } catch (err) {
        console.error("Error fetching equipment:", err);
      }
    }

    async function fetchImages(data) {
      const imageMap = {};
      await Promise.all(
        data.map(async (item) => {
          try {
            const imageResponse = await axios.get(
              `http://localhost:8080/api/user/${item.imageUrl}`,
              { headers: { Authorization: `Bearer ${cookie.jwtToken}` }, responseType: "blob", withCredentials: true }
            );
            imageMap[item.imageUrl] = URL.createObjectURL(imageResponse.data);
          } catch {
            imageMap[item.imageUrl] = "/defaultImage.png";
          }
        })
      );
      setImageUrls(imageMap);
    }

    fetchEquipmentData();
  }, [cookie.jwtToken]);

  // ** Pagination Logic **
  const totalPages = Math.ceil(equipmentData.length / itemsPerPage);
  const paginatedData = equipmentData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleShowDetails = (item) => {
    setSelectedProduct(item);
    setStartDate("");
    setEndDate("");
    setQuantity(1);
    setTotalDays(1);
    setTotalCost(item.pricePerDay);
    setShowModal(true);
  };

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.max((end - start) / (1000 * 60 * 60 * 24), 1); // At least 1 day
      setTotalDays(days);
      setTotalCost(days * (selectedProduct ? selectedProduct.pricePerDay : 0) * quantity);
    }
  }, [startDate, endDate, quantity, selectedProduct]);

  // Handle Renting Equipment
  const handleRentNow = async () => {
    if (!startDate || !endDate) {
      alert("Please select start and end dates.");
      return;
    }

    try {
      const userId = jwtDecode(cookie.jwtToken).user_id; // Extract user ID from token

      const bookingData = {
        user: { id: userId },
        equipment: { equipmentId: selectedProduct.equipmentId },
        startDate,
        endDate,
        totalPrice: totalCost,
        status: "PENDING"
      };

      await axios.post(
        "http://localhost:8080/api/user/equipmentBooking",
        bookingData,
        {
          headers: { Authorization: `Bearer ${cookie.jwtToken}` },
          withCredentials: true
        }
      );

      alert("Booking successful!");
      setShowModal(false);
    } catch (error) {
      console.error("Error booking equipment:", error);
      alert("Failed to book equipment. Please try again.");
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Navbar */}
      <MyNavbar />

      {/* Hero Section */}
      <section className="text-center py-5 bg-primary text-white">
        <h1 className="fw-bold">Rent Equipment with Ease</h1>
        <p className="lead">Find, rent, and manage equipment for any project in just a few clicks.</p>
      </section>

      {/* Equipment Section */}
      <Container className="py-5">
        <h2 className="text-center fw-bold text-dark mb-4">Available Equipment</h2>
        <Row className="g-4 row-cols-1 row-cols-sm-2 row-cols-lg-3">
          {paginatedData.map((item) => (
            <Col key={item.equipmentId}>
              <Card
                className="shadow-sm border-0 h-100"
                style={{ cursor: "pointer" }}
                onClick={() => handleShowDetails(item)}
              >
                <Card.Img
                  variant="top"
                  src={imageUrls[item.imageUrl] || "/loadingImage.png"}
                  alt="Equipment"
                  className="object-fit-cover"
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={(e) => (e.target.src = "/defaultImage.png")}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fw-bold text-dark">{item.name}</Card.Title>
                  <Card.Text className="text-muted">
                    <span className="fw-semibold">Price Per Day:</span> ₹{item.pricePerDay} <br />
                    <span className="fw-semibold">Quantity:</span> {item.quantity}
                  </Card.Text>
                  <Button variant="primary" className="mt-auto">View Details</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Product Details Modal */}
      {/* Product Details Modal */}
{selectedProduct && (
  <Modal show={showModal} onHide={() => setShowModal(false)} centered>
    <Modal.Header closeButton>
      <Modal.Title>{selectedProduct.name}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="text-center">
        {/* Equipment Image (Smaller Size) */}
        <img
          src={imageUrls[selectedProduct.imageUrl] || "/defaultImage.png"}
          alt="Equipment"
          className="img-fluid rounded"
          style={{ maxWidth: "250px", height: "auto" }}
        />
      </div>
      <p className="mt-3"><strong>Description:</strong> {selectedProduct.description}</p>
      <p><strong>Price Per Day:</strong> ₹{selectedProduct.pricePerDay}</p>

      {/* Rental Form */}
      <Form.Group>
        <Form.Label>Start Date</Form.Label>
        <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </Form.Group>
      <Form.Group>
        <Form.Label>End Date</Form.Label>
        <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </Form.Group>

      <p><strong>Total Days:</strong> {totalDays}</p>
      <p><strong>Total Cost:</strong> ₹{totalCost}</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
      <Button variant="primary" onClick={handleRentNow}>Rent Now</Button>
    </Modal.Footer>
  </Modal>
)}


      {/* Footer */}
      <MyFooter />
    </div>
  );
}
