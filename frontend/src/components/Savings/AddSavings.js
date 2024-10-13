import React, { useState } from "react";
import {
  Button,
  Form,
  Card,
  InputGroup,
  FormControl,
  Collapse
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faChevronUp,
  faChevronDown,
  faCaretUp,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";

const categories = ["Groceries", "Utilities", "Transportation", "Housing", "Entertainment", "Clothing", "Dining out", "Insurance", "Healthcare", "Education", "Travel", "Personal care", "Subscriptions", "Electronics", "Home maintenance", "Debt payments", "Gifts", "Hobbies", "Fitness", "Childcare"];

function AddSavings({ onAddSaving }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [amount, setAmount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleAddSaving = (e) => {
    e.preventDefault();
    const newSaving = {
      id: Date.now(),
      name,
      category,
      amount,
      date: new Date(),
    };
    onAddSaving(newSaving);
    setName("");
    setCategory(categories[0]);
    setAmount(0);
    setIsOpen(false); // Close the form after adding
  };

  const handleAmountChange = (increment) => {
    setAmount((prevAmount) => Math.max(0, prevAmount + increment));
  };

  return (
    <Card className="mb-3">
      <Card.Header 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ cursor: 'pointer' }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <span>Add New Saving</span>
          <FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown} />
        </div>
      </Card.Header>
      <Collapse in={isOpen}>
        <div>
          <Card.Body>
            <Form onSubmit={handleAddSaving}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Amount (CHF)</Form.Label>
                <InputGroup>
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleAmountChange(-0.1)}
                  >
                    <FontAwesomeIcon icon={faChevronDown} />
                  </Button>
                  <FormControl
                    type="number"
                    value={amount.toFixed(2)}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    step="0.01"
                    min="0"
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleAmountChange(0.1)}
                  >
                    <FontAwesomeIcon icon={faChevronUp} />
                  </Button>
                </InputGroup>
              </Form.Group>
              <Button type="submit" className="mt-3 primary-button">
                Add Savings
                <FontAwesomeIcon icon={faPlusCircle} className="icon-right" />
              </Button>
            </Form>
          </Card.Body>
        </div>
      </Collapse>
    </Card>
  );
}

export default AddSavings;
