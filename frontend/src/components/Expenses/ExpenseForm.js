// ExpenseForm.js
import React, { useState } from 'react';
import { Form, Col, Button } from 'react-bootstrap';

function ExpenseForm({ onAddExpense, categories }) {
  const [expense, setExpense] = useState({
    name: '',
    amount: '',
    date: '',
    description: '',
    isPaid: false,
    category: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExpense(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (expense.name && expense.amount && expense.date && expense.description && expense.category) {
      onAddExpense({
        ...expense,
        amount: parseFloat(expense.amount),
        status: expense.isPaid ? "PAID" : "DUE",
        id: Date.now()
      });
      setExpense({
        name: '',
        amount: '',
        date: '',
        description: '',
        isPaid: false,
        category: ''
      });
    } else {
      alert("All fields are required, including the category.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Row>
        <Form.Group as={Col} md={6}>
          <Form.Control
            type="text"
            placeholder="Expense Name"
            name="name"
            value={expense.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group as={Col} md={6}>
          <Form.Control
            type="number"
            placeholder="Amount (CHF)"
            name="amount"
            value={expense.amount}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md={6}>
          <Form.Control
            type="date"
            name="date"
            value={expense.date}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group as={Col} md={6}>
          <Form.Control
            as="select"
            name="category"
            value={expense.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form.Row>
      <Form.Group>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Description"
          name="description"
          value={expense.description}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Check
          type="checkbox"
          label="Paid"
          name="isPaid"
          checked={expense.isPaid}
          onChange={handleChange}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Add Expense
      </Button>
    </Form>
  );
}

export default ExpenseForm;
