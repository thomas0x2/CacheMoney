import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./TopbarNav.css";

function TopNavbar({ username, role }) {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="top-navbar">
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard" className="brand-text me-4">
          <div className="brand-text">
            CACHE MONEY
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard" className="me-3">
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/incomes" className="me-3">
              Income
            </Nav.Link>
            <Nav.Link as={Link} to="/expenses" className="me-3">
              Expenses
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>

        <div className="profile">
          <img
            src={`${process.env.PUBLIC_URL}/images/User/User.png`}
            alt={username}
            className="user-image"
          />
          <div>
            <strong>{username}</strong>
            {role}
          </div>
        </div>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;
