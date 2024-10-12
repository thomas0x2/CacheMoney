import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "./TopbarNav.css";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import logoImage from "../../New_Logo.png";

function TopNavbar({ username, role }) {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };
  
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="top-navbar">
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard" className="brand-logo d-flex align-items-center">
          <img
            src={logoImage}
            alt="Cache Money Logo"
            height="30"
            className="d-inline-block align-top me-2"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto align-items-center">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/savings">Savings</Nav.Link>
            <Nav.Link as={Link} to="/incomes">Income</Nav.Link>
            <Nav.Link as={Link} to="/expenses">Expenses</Nav.Link>
            <Nav.Link as={Link} to="/assistant">Assistant</Nav.Link>
          </Nav>
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;
