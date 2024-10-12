import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleLeft,
  faArrowCircleRight,
  faPlusCircle,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

const IncomeForm = ({ onAddIncome, categories }) => {
  const [income, setIncome] = useState({
    frequency: "onetime",
    name: "",
    category: "",
    amount: "",
    date: "",
    weekday: "0", // Sunday
    monthday: "1",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIncome((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const incomeData = {
      ...income,
      amount: parseFloat(parseFloat(income.amount).toFixed(2)),
      id: Date.now(),
    };
    onAddIncome(incomeData);
    // Reset form
    setIncome({
      frequency: "onetime",
      name: "",
      category: "",
      amount: "",
      date: "",
      weekday: "0",
      monthday: "1",
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Frequency</Form.Label>
        <Form.Control
          as="select"
          name="frequency"
          value={income.frequency}
          onChange={handleChange}
        >
          <option value="onetime">One-time</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={income.name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Category</Form.Label>
        <Form.Control
          as="select"
          name="category"
          value={income.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Amount (CHF)</Form.Label>
        <Form.Control
          type="number"
          name="amount"
          value={income.amount}
          onChange={handleChange}
          min="0 "
          step="0.01"
          required
        />
      </Form.Group>

      {income.frequency === "onetime" && (
        <Form.Group>
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={income.date}
            onChange={handleChange}
            required
          />
        </Form.Group>
      )}

      {income.frequency === "weekly" && (
        <Form.Group>
          <Form.Label>Weekday</Form.Label>
          <Form.Control
            as="select"
            name="weekday"
            value={income.weekday}
            onChange={handleChange}
            required
          >
            <option value="0">Sunday</option>
            <option value="1">Monday</option>
            <option value="2">Tuesday</option>
            <option value="3">Wednesday</option>
            <option value="4">Thursday</option>
            <option value="5">Friday</option>
            <option value="6">Saturday</option>
          </Form.Control>
        </Form.Group>

      )}

      {income.frequency === "monthly" && (
        <Form.Group>
          <Form.Label>Day of Month</Form.Label>
          <Form.Control
            as="select"
            name="monthday"
            value={income.monthday}
            onChange={handleChange}
            required
          >
            {[...Array(28)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      )}

      <Button type="submit" className="mt-3 primary-button">
        {"Add Income"}
        <FontAwesomeIcon icon={faPlusCircle} className="icon-right" />
      </Button>
    </Form>
  );
};

export default IncomeForm;
