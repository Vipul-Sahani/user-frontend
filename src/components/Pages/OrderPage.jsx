// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useCookies } from "react-cookie";
// import { jwtDecode } from "jwt-decode";
// import { Container, Card, Spinner, Alert, Tabs, Tab, Button, Modal } from "react-bootstrap";
// import MyNavbar from "../layout/MyNavbar";
// import MyFooter from "../layout/MyFooter";

// const OrderPage = () => {
//   const [cookies] = useCookies(["jwtToken"]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeTab, setActiveTab] = useState("ALL");
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBookingId, setSelectedBookingId] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//   }, [cookies]);

//   const fetchOrders = async () => {
//     try {
//       const token = cookies.jwtToken;
//       if (!token) {
//         setError("Authentication token is missing.");
//         setLoading(false);
//         return;
//       }

//       const decodedToken = jwtDecode(token);
//       const userId = decodedToken.user_id;

//       const response = await axios.get(
//         `http://localhost:8080/api/user/getBookingDetails/${userId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );
//       setOrders(response.data);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       setError("Failed to fetch orders. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const confirmCancelOrder = (bookingId) => {
//     setSelectedBookingId(bookingId);
//     setShowModal(true);
//   };

//   const handleCancelOrder = async () => {
//     if (!selectedBookingId) return;

//     try {
//       const token = cookies.jwtToken;
//       await axios.put(
//         `http://localhost:8080/api/user/cancelBooking/${selectedBookingId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );

//       // Update state to reflect cancellation
//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order.bookingId === selectedBookingId ? { ...order, status: "CANCELLED" } : order
//         )
//       );

//       // Close the modal
//       setShowModal(false);
//       setSelectedBookingId(null);
//     } catch (error) {
//       console.error("Error canceling order:", error);
//       alert("Failed to cancel order. Please try again.");
//     }
//   };

//   const bookingStatuses = ["PENDING", "APPROVED", "REJECTED", "CANCELLED", "COMPLETED"];

//   const filteredOrders = activeTab === "ALL" ? orders : orders.filter((order) => order.status === activeTab);

//   return (
//     <div className="min-vh-100 d-flex flex-column">
//       <MyNavbar />

//       <Container className="py-5 flex-grow-1">
//         <h2 className="text-center mb-4">My Orders</h2>

//         {error && <Alert variant="danger">{error}</Alert>}

//         {loading ? (
//           <div className="text-center">
//             <Spinner animation="border" />
//           </div>
//         ) : (
//           <>
//             <Tabs
//               id="order-tabs"
//               activeKey={activeTab}
//               onSelect={(k) => setActiveTab(k)}
//               className="mb-3"
//             >
//               <Tab eventKey="ALL" title="All Orders">
//                 {filteredOrders.length > 0 ? (
//                   filteredOrders.map((order) => (
//                     <OrderCard key={order.bookingId} order={order} onConfirmCancel={confirmCancelOrder} />
//                   ))
//                 ) : (
//                   <p className="text-center">No orders found.</p>
//                 )}
//               </Tab>

//               {bookingStatuses.map((status) => (
//                 <Tab key={status} eventKey={status} title={status.charAt(0) + status.slice(1).toLowerCase()}>
//                   {filteredOrders.length > 0 ? (
//                     filteredOrders.map((order) => (
//                       <OrderCard key={order.bookingId} order={order} onConfirmCancel={confirmCancelOrder} />
//                     ))
//                   ) : (
//                     <p className="text-center">No {status.toLowerCase()} orders found.</p>
//                   )}
//                 </Tab>
//               ))}
//             </Tabs>
//           </>
//         )}
//       </Container>

//       {/* Confirmation Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Cancel Order</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to cancel this order?
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             No
//           </Button>
//           <Button variant="danger" onClick={handleCancelOrder}>
//             Yes, Cancel
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <MyFooter />
//     </div>
//   );
// };

// const OrderCard = ({ order, onConfirmCancel }) => {
//   return (
//     <Card className="mb-3 shadow-sm">
//       <Card.Body>
//         <Card.Title className="fw-bold text-primary">
//           {order.equipment.name}
//         </Card.Title>
//         <Card.Text>
//           <strong>Start Date:</strong> {order.startDate}
//         </Card.Text>
//         <Card.Text>
//           <strong>End Date:</strong> {order.endDate}
//         </Card.Text>
//         <Card.Text>
//           <strong>Total Price:</strong> ₹{order.totalPrice}
//         </Card.Text>
//         <Card.Text>
//           <strong>Status:</strong>{" "}
//           <span
//             className={`badge px-3 py-2 ${
//               order.status === "APPROVED"
//                 ? "bg-success"
//                 : order.status === "PENDING"
//                 ? "bg-warning"
//                 : order.status === "REJECTED"
//                 ? "bg-danger"
//                 : order.status === "CANCELLED"
//                 ? "bg-secondary"
//                 : "bg-info"
//             }`}
//           >
//             {order.status}
//           </span>
//         </Card.Text>

//         {/* Show Cancel Button for PENDING orders */}
//         {order.status === "PENDING" && (
//           <Button variant="danger" onClick={() => onConfirmCancel(order.bookingId)}>
//             Cancel Order
//           </Button>
//         )}
//       </Card.Body>
//     </Card>
//   );
// };

// export default OrderPage;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { Container, Card, Spinner, Alert, Tabs, Tab, Button, Modal } from "react-bootstrap";
import MyNavbar from "../layout/MyNavbar";
import MyFooter from "../layout/MyFooter";

const OrderPage = () => {
  const [cookies] = useCookies(["jwtToken"]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3; // Display 4 orders per page

  useEffect(() => {
    fetchOrders();
  }, [cookies]);

  const fetchOrders = async () => {
    try {
      const token = cookies.jwtToken;
      if (!token) {
        setError("Authentication token is missing.");
        setLoading(false);
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.user_id;

      const response = await axios.get(
        `http://localhost:8080/api/user/getBookingDetails/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const confirmCancelOrder = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowModal(true);
  };

  const handleCancelOrder = async () => {
    if (!selectedBookingId) return;

    try {
      const token = cookies.jwtToken;
      await axios.put(
        `http://localhost:8080/api/user/cancelBooking/${selectedBookingId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // Update state to reflect cancellation
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.bookingId === selectedBookingId ? { ...order, status: "CANCELLED" } : order
        )
      );

      // Close the modal
      setShowModal(false);
      setSelectedBookingId(null);
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Failed to cancel order. Please try again.");
    }
  };

  const bookingStatuses = ["PENDING", "APPROVED", "REJECTED", "CANCELLED", "COMPLETED"];

  // Filter orders based on the selected tab
  const filteredOrders = activeTab === "ALL" ? orders : orders.filter((order) => order.status === activeTab);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div className="min-vh-100 d-flex flex-column">
      <MyNavbar />

      <Container className="py-5 flex-grow-1">
        <h2 className="text-center mb-4">My Orders</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            <Tabs
              id="order-tabs"
              activeKey={activeTab}
              onSelect={(k) => {
                setActiveTab(k);
                setCurrentPage(1); // Reset to first page when switching tabs
              }}
              className="mb-3"
            >
              <Tab eventKey="ALL" title="All Orders">
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <OrderCard key={order.bookingId} order={order} onConfirmCancel={confirmCancelOrder} />
                  ))
                ) : (
                  <p className="text-center">No orders found.</p>
                )}
              </Tab>

              {bookingStatuses.map((status) => (
                <Tab key={status} eventKey={status} title={status.charAt(0) + status.slice(1).toLowerCase()}>
                  {currentOrders.length > 0 ? (
                    currentOrders.map((order) => (
                      <OrderCard key={order.bookingId} order={order} onConfirmCancel={confirmCancelOrder} />
                    ))
                  ) : (
                    <p className="text-center">No {status.toLowerCase()} orders found.</p>
                  )}
                </Tab>
              ))}
            </Tabs>

            {/* Pagination Controls */}
            {filteredOrders.length > ordersPerPage && (
              <div className="d-flex justify-content-center mt-3">
                <Button
                  variant="primary"
                  className="me-2"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="align-self-center">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="primary"
                  className="ms-2"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </Container>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel this order?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={handleCancelOrder}>
            Yes, Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <MyFooter />
    </div>
  );
};

const OrderCard = ({ order, onConfirmCancel }) => {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title className="fw-bold text-primary">
          {order.equipment.name}
        </Card.Title>
        <Card.Text>
          <strong>Start Date:</strong> {order.startDate}
        </Card.Text>
        <Card.Text>
          <strong>End Date:</strong> {order.endDate}
        </Card.Text>
        <Card.Text>
          <strong>Total Price:</strong> ₹{order.totalPrice}
        </Card.Text>
        <Card.Text>
          <strong>Status:</strong>{" "}
          <span
            className={`badge px-3 py-2 ${
              order.status === "APPROVED"
                ? "bg-success"
                : order.status === "PENDING"
                ? "bg-warning"
                : order.status === "REJECTED"
                ? "bg-danger"
                : order.status === "CANCELLED"
                ? "bg-secondary"
                : "bg-info"
            }`}
          >
            {order.status}
          </span>
        </Card.Text>

        {order.status === "PENDING" && (
          <Button variant="danger" onClick={() => onConfirmCancel(order.bookingId)}>
            Cancel Order
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default OrderPage;
