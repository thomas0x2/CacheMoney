// src/components/AuthenticatedRoute.js

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext"; // Import the UserContext

const AuthenticatedRoute = ({ children }) => {
  const navigate = useNavigate();
  const user = useContext(UserContext); // Access the current user from context

  // Redirect to login if no user is authenticated
  if (!user) {
    navigate("/"); // Redirect to login or homepage
    return null; // Don't render children if not authenticated
  }

  return <>{children}</>; // Render protected children if authenticated
};

export default AuthenticatedRoute;
