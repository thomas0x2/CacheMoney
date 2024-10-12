import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Form,
  ListGroup,
  Container,
  Row,
  Col,
  Card,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { useGlobalContext } from "../../App"
import TopbarNav from "../TopbarNav/TopbarNav";
import SidebarNav from "../SidebarNav/SidebarNav";
import BreadcrumbAndProfile from "../BreadcrumbAndProfile/BreadcrumbAndProfile";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function TargetSettingMenu() {
  const context = useGlobalContext();

  if (!context) {
    return <div>Error: Global context is not available</div>;
  }

  const { savingTarget, setSavingTarget } = context;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update the global context directly
    setSavingTarget(parseFloat(savingTarget) || 0);
  };

  const handleChange = (e) => {
    setSavingTarget(e.target.value);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Set your monthly savings target</Form.Label>
        <Form.Control
          type="number"
          value={savingTarget}
          onChange={handleChange}
          placeholder="Enter amount"
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-3 primary-button">
        Save Target
      </Button>
    </Form>
  );
}

function Target() {
  const [currentTarget, setCurrentTarget] = useState(null);

  const handleSaveTarget = (amount) => {
    setCurrentTarget(amount);
    // Here you would typically also save this to your backend or state management system
  };
  return (
    <Container fluid>
      <Row className="topbar">
          <TopbarNav username="Nerit Küneşko" role="Entrepreneur"/>
      </Row>
      <Row>
        <Col md={10} className="main">
          <BreadcrumbAndProfile
            username="Nerit Küneşko"
            role="Entrepreneur"
            pageTitle="Set Target"
            breadcrumbItems={[
              { name: "Dashboard", path: "/dashboard", active: false },
              { name: "Target", path: "/target", active: true },
            ]}target
          />
          <Row className="mt-4">
            <Col md={6}>
              <TargetSettingMenu onSaveTarget={handleSaveTarget} />
            </Col>
            <Col md={6}>
              {currentTarget !== null && (
                <div>
                  <h4>Current Monthly Savings Target</h4>
                  <p>${currentTarget.toFixed(2)}</p>
                </div>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Target;
