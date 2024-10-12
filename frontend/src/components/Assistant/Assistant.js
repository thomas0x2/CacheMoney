// Assistant.js
import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TopbarNav from "../TopbarNav/TopbarNav";
import BreadcrumbAndProfile from "../BreadcrumbAndProfile/BreadcrumbAndProfile";
import { UserContext } from "../Auth/UserContext";
import { motion } from "framer-motion";
// import "./Assistant.css";

function Assistant() {
  // Get user data
  const user = useContext(UserContext);

  return (
    <Container fluid>
      <Row className="topbar">
        <TopbarNav username={user?.displayName || "User"} role="Entrepreneur" />
      </Row>
      <Row>
        <Col md={10} className="main-content main">
          {/* <BreadcrumbAndProfile
            username={user?.displayName || "User"}
            role="Entrepreneur"
            pageTitle="Assistant"
            breadcrumbItems={[
              { name: "Dashboard", path: "/dashboard", active: false },
              { name: "Assistant", path: "/assistant", active: true },
            ]}
          /> */}

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
        </Col>
      </Row>
    </Container>
  );
}

export default Assistant;
