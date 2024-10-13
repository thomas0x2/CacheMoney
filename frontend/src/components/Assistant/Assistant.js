import React, { useContext } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TopbarNav from "../TopbarNav/TopbarNav";
import BreadcrumbAndProfile from "../BreadcrumbAndProfile/BreadcrumbAndProfile";
import { UserContext } from "../Auth/UserContext";
import { motion } from "framer-motion";
import "./Assistant.css";

function Assistant() {
  const user = useContext(UserContext);

  // Function to fetch expenses and download as JSON
  const handleDownloadExpenses = async () => {
    try {
      const response = await fetch(`/api/expense/last30days?userid=${user.uid}`);
      const data = await response.json();

      // Create a blob from the JSON data
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });

      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expenses.json");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error fetching or downloading expenses:", error);
    }
  };

  return (
    <Container fluid className="assistant-container">
      <Row className="topbar">
        <TopbarNav username={user?.displayName || "User"} role="Entrepreneur" />
      </Row>
      <Row>
        <Col md={10} className="main-content main">
          <Row className="my-4">
            <Col md={12} className="mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <iframe
                  src="https://chachemoney-16228.chipp.ai"
                  height="800px"
                  width="100%"
                  frameborder="0"
                  title="CacheMoney"
                ></iframe>
              </motion.div>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={12} className="d-flex justify-content-center">
              <Button variant="primary" onClick={handleDownloadExpenses}>
                Download Last 30 Days Expenses
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Assistant;
