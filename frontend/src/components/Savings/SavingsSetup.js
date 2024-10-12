import React, { useState, useEffect } from 'react';
import { Card, Collapse, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useGlobalContext } from "../../App";

function SavingsSetup() {
  const [isOpen, setIsOpen] = useState(false);
  const [savingsTarget, setSavingsTarget] = useState(0);
  const { setSavingTarget } = useGlobalContext();

  useEffect(() => {
    // Load saved target from local storage when component mounts
    const savedTarget = localStorage.getItem('savingsTarget');
    if (savedTarget) {
      setSavingsTarget(parseFloat(savedTarget));
      setSavingTarget(parseFloat(savedTarget)); // Update global context
    }
  }, [setSavingTarget]);

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('savingsTarget', savingsTarget.toString());
    setSavingTarget(savingsTarget); // Update global context
    console.log('Savings Target saved:', savingsTarget);
    // Here you would typically also send this data to your backend
  };

  return (
    <Card className="mb-3">
      <Card.Header
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: "pointer" }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <span>Set Savings Target</span>
          <FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown} />
        </div>
      </Card.Header>
      <Collapse in={isOpen}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Enter your savings target:</Form.Label>
              <Form.Control
                type="number"
                placeholder="Savings Target"
                value={savingsTarget}
                onChange={(e) => setSavingsTarget(parseFloat(e.target.value) || 0)}
              />
            </Form.Group>
            <Button type="submit" className="mt-3 primary-button">
              Save Target
            </Button>
          </Form>
        </Card.Body>
      </Collapse>
    </Card>
  );
}

export default SavingsSetup;
