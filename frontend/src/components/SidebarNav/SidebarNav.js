// SidebarNav.js
import React from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faHome,
  faWallet,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import "./SidebarNav.css";

import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

function SidebarNav() {
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
    <Nav className="flex-column fixed">
      <Link to="/dashboard">
        <img
          src={`${process.env.PUBLIC_URL}/images/Logo/cachemoney-high-resolution-logo-white-transparent.png`}
          alt="Logo"
          className="logo-img"
        />
      </Link>
      <Nav.Link as={Link} to="/dashboard">
        <FontAwesomeIcon icon={faHome} className="nav-icon" /> Dashboard
      </Nav.Link>
      <Nav.Link as={Link} to="/incomes">
        <FontAwesomeIcon icon={faDollarSign} className="nav-icon" /> Incomes
      </Nav.Link>
      <Nav.Link as={Link} to="/expenses">
        <FontAwesomeIcon icon={faWallet} className="nav-icon" /> Expenses
      </Nav.Link>
      {/* Exit Link */}
      <Nav.Link onClick={handleLogout} className="exit-link">
        Sign Out
      </Nav.Link>
      <a
        href="https://github.com/igordinuzzi"
        className="github-link"
        target="_blank"
        rel="noopener noreferrer"
      ></a>
    </Nav>
  );
}

export default SidebarNav;
