import React, { useState, useEffect } from "react";
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
import SidebarNav from "../SidebarNav/SidebarNav";
import BreadcrumbAndProfile from "../BreadcrumbAndProfile/BreadcrumbAndProfile";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function TargetSettingMenu({ onSaveTarget }) {
  const [targetAmount, setTargetAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveTarget(parseFloat(targetAmount));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Set your monthly savings target</Form.Label>
        <Form.Control
          type="number"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </Form.Group>
      <Button variant="primary" type="submit">
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
      <Row>
        <Col md={2} className="sidebar">
          <SidebarNav />
        </Col>
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
