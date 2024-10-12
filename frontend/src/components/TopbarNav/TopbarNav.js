import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faWallet, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import './TopbarNav.css';

function TopNavbar() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="top-navbar">
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard" className="brand-text">CacheMoney</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/dashboard">
              <FontAwesomeIcon icon={faHome} className="nav-icon" /> Dash
            </Nav.Link>
            <Nav.Link as={Link} to="/incomes">
              <FontAwesomeIcon icon={faDollarSign} className="nav-icon" /> Income
            </Nav.Link>
            <Nav.Link as={Link} to="/expenses">
              <FontAwesomeIcon icon={faWallet} className="nav-icon" /> Expenses
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;
