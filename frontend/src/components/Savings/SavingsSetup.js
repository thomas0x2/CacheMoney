import React, { useState, useRef, useEffect } from 'react';
import { Card, Collapse, Form, Button, Row, Col, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown, faCheck } from "@fortawesome/free-solid-svg-icons";

function MultiSelect({ selected, setSelected, categories }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCategory = (category) => {
    if (selected.some(item => item.name === category)) {
      setSelected(selected.filter(item => item.name !== category));
    } else {
      setSelected([...selected, { name: category, savingsTarget: 0, spendingTarget: 0 }]);
    }
  };

  return (
    <div ref={dropdownRef} className="position-relative">
      <Dropdown show={isOpen} onToggle={(isOpen) => setIsOpen(isOpen)}>
        <Dropdown.Toggle variant="success" id="dropdown-basic" className="mt-3 primary-button">
          Select Categories
        </Dropdown.Toggle>

        <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {categories.map(category => (
            <Dropdown.Item 
              key={category} 
              onClick={() => toggleCategory(category)}
              active={selected.some(item => item.name === category)}
            >
              <Form.Check 
                type="checkbox"
                label={category}
                checked={selected.some(item => item.name === category)}
                onChange={() => {}}
                onClick={(e) => e.stopPropagation()}
              />
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}


function SavingsSetup({categories}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [totalSavingsTarget, setTotalSavingsTarget] = useState(0);

  useEffect(() => {
    // Load saved plan from local storage when component mounts
    const savedPlan = localStorage.getItem('savingsPlan');
    if (savedPlan) {
      const parsedPlan = JSON.parse(savedPlan);
      setSelectedCategories(parsedPlan);
      // Calculate initial total savings target
      const initialTotal = parsedPlan.reduce((sum, category) => sum + (category.savingsTarget || 0), 0);
      setTotalSavingsTarget(initialTotal);
    }
  }, []);

  useEffect(() => {
    // Update total savings target whenever selectedCategories changes
    const newTotal = selectedCategories.reduce((sum, category) => sum + (category.savingsTarget || 0), 0);
    setTotalSavingsTarget(newTotal);
  }, [selectedCategories]);

  const handleTargetChange = (index, field, value) => {
    const updatedCategories = [...selectedCategories];
    updatedCategories[index][field] = parseFloat(value) || 0;
    setSelectedCategories(updatedCategories);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('savingsPlan', JSON.stringify(selectedCategories));
    console.log('Savings Plan saved:', selectedCategories);
    console.log('Total Savings Target:', totalSavingsTarget);
    // Here you would typically also send this data to your backend
  };

  return (
    <Card className="mb-3">
      <Card.Header
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: "pointer" }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <span>Change Savings Plan</span>
          <FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown} />
        </div>
      </Card.Header>
      <Collapse in={isOpen}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Select categories to save money on:</Form.Label>
              <MultiSelect selected={selectedCategories} setSelected={setSelectedCategories} categories={categories} />
            </Form.Group>

            {selectedCategories.length > 0 && (
              <Row className="mb-3">
                <Col>
                  <Form.Label>Category</Form.Label>
                </Col>
                <Col>
                  <Form.Label>Savings Target</Form.Label>
                </Col>
                <Col>
                  <Form.Label>Spending Target</Form.Label>
                </Col>
              </Row>
            )}

            {selectedCategories.map((category, index) => (
              <Row key={category.name} className="mb-3">
                <Col>
                  <Form.Label>{category.name}</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Savings Target"
                    value={category.savingsTarget}
                    onChange={(e) => handleTargetChange(index, 'savingsTarget', e.target.value)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Spending Target"
                    value={category.spendingTarget}
                    onChange={(e) => handleTargetChange(index, 'spendingTarget', e.target.value)}
                  />
                </Col>
              </Row>
            ))}

            <Row className="mb-3">
              <Col>
                <strong>Total Savings Target: {totalSavingsTarget.toFixed(2)}</strong>
              </Col>
            </Row>

            <Button type="submit" className="mt-3 primary-button">
              Save Plan
            </Button>
          </Form>
        </Card.Body>
      </Collapse>
    </Card>
  );
}

export default SavingsSetup;
