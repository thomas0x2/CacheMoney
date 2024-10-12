// src/components/AuthenticatedRoute.js

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase"; // Ensure correct import path based on your project structure

const AuthenticatedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // If the user is not authenticated, redirect to the login page
        navigate("/");
      }
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [navigate]);

  return <>{children}</>; // Render the children (protected components) if user is authenticated
};

export default AuthenticatedRoute;
