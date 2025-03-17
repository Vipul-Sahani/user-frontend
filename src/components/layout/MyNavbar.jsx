

// import { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Navbar, Nav, Container, Button } from "react-bootstrap";
// import { useCookies } from "react-cookie";

// const MyNavbar = () => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [cookies, , removeCookie] = useCookies(["jwtToken", "role"]);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isAuthenticated = !!cookies.jwtToken;

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 50);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleLogout = () => {
//     removeCookie("jwtToken", { path: "/" });
//     removeCookie("role", { path: "/" });

//     localStorage.removeItem("jwtToken");
//     localStorage.removeItem("role");

//     navigate("/");
//   };

//   return (
//     <Navbar
//       expand="lg"
//       fixed="top"
//       className={`navbar-dark transition ${isScrolled ? "bg-dark shadow" : "bg-transparent"}`}
//     >
//       <Container>
//         <Navbar.Brand
//           as={Link}
//           to={isAuthenticated ? "/home" : "/"}
//           className={location.pathname === "/profile" ? "text-primary fw-semibold" : "text-light"}
//         >
//           RentPro
//         </Navbar.Brand>
//         <Navbar.Toggle aria-controls="navbar-nav" />
//         <Navbar.Collapse id="navbar-nav">
//           <Nav className="me-auto">
//             {isAuthenticated && (
//               <>
//                 <Nav.Link
//                   as={Link}
//                   to="/profile"
//                   className={location.pathname === "/profile" ? "text-primary fw-semibold" : "text-light"}
//                 >
//                   Profile
//                 </Nav.Link>
//                 <Nav.Link
//                   as={Link}
//                   to="/orders"
//                   className={location.pathname === "/orders" ? "text-primary fw-semibold" : "text-light"}
//                 >
//                   My Orders
//                 </Nav.Link>
//               </>
//             )}
//           </Nav>
//           <Nav>
//             {isAuthenticated ? (
//               <Button variant="danger" onClick={handleLogout}>
//                 Log Out
//               </Button>
//             ) : (
//               <>
//                 <Button variant="outline-light" as={Link} to="/login" className="me-2">
//                   Sign In
//                 </Button>
//                 <Button variant="primary" as={Link} to="/signup">
//                   Sign Up
//                 </Button>
//               </>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default MyNavbar;

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useCookies } from "react-cookie";

const MyNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWhiteBg, setIsWhiteBg] = useState(false);
  const [cookies, , removeCookie] = useCookies(["jwtToken", "role"]);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = !!cookies.jwtToken;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    const checkBackground = () => {
      const bodyBg = getComputedStyle(document.body).backgroundColor;
      setIsWhiteBg(bodyBg === "rgb(255, 255, 255)" || bodyBg === "#ffffff");
    };

    checkBackground();
    window.addEventListener("resize", checkBackground);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkBackground);
    };
  }, []);

  const handleLogout = () => {
    removeCookie("jwtToken", { path: "/" });
    removeCookie("role", { path: "/" });

    localStorage.removeItem("jwtToken");
    localStorage.removeItem("role");

    navigate("/");
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`transition ${isScrolled ? "bg-dark shadow" : isWhiteBg ? "bg-dark text-light" : "bg-transparent"}`}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to={isAuthenticated ? "/home" : "/"}
          className={location.pathname === "/profile" ? "text-primary fw-semibold" : "text-light"}
        >
          RentPro
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated && (
              <>
                <Nav.Link
                  as={Link}
                  to="/profile"
                  className={location.pathname === "/profile" ? "text-primary fw-semibold" : "text-light"}
                >
                  Profile
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/orders"
                  className={location.pathname === "/orders" ? "text-primary fw-semibold" : "text-light"}
                >
                  My Orders
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <Button variant="danger" onClick={handleLogout}>
                Log Out
              </Button>
            ) : (
              <>
                <Button variant="outline-light" as={Link} to="/login" className="me-2">
                  Sign In
                </Button>
                <Button variant="primary" as={Link} to="/signup">
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
