import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "./TopbarNav.css";

import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

function TopNavbar({ username, role }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
        console.error("Error signing out:", error);
      });
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="top-navbar">
      <Container fluid className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Navbar.Brand as={Link} to="/dashboard" className="brand-text me-4">
            CACHE MONEY
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/incomes">Income</Nav.Link>
            <Nav.Link as={Link} to="/expenses">Expenses</Nav.Link>
          </Nav>
        </div>
        <div className="d-flex align-items-center">
          <div className="profile d-flex align-items-center me-3">
            <img
              src={`${process.env.PUBLIC_URL}/images/User/User.png`}
              alt={username}
              className="user-image me-2"
            />
            <div className="user-info text-light">
              <div>{username}</div>
              <small>{role}</small>
            </div>
          </div>
          <Button variant="outline-light" size="sm" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;
