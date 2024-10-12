// ExpenseForm.js
import React, { useState } from 'react';
import { Form, Col, Button, Row } from 'react-bootstrap';

function ExpenseForm({ onAddExpense, categories, editingExpense }) {
  const [expense, setExpense] = useState(() => editingExpense || {
    name: '',
    amount: '',
    date: '',
    description: '',
    isPaid: false,
    category: ''
  });

  const [dateOption, setDateOption] = useState('today');

  useEffect(() => {
    if (editingExpense) {
      setExpense(editingExpense);
      setDateOption('custom');
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExpense(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDateChange = (option) => {
    setDateOption(option);
    if (option === 'today') {
      setExpense(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
    } else if (option === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      setExpense(prev => ({ ...prev, date: yesterday.toISOString().split('T')[0] }));
    } else {
      setExpense(prev => ({ ...prev, date: '' })); // Custom date requires user input
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (expense.name && expense.amount && expense.date) {
      onAddExpense({
        ...expense,
        amount: parseFloat(expense.amount),
        status: expense.isPaid ? "PAID" : "DUE",
        id: editingExpense ? editingExpense.id : Date.now() // Keep same ID if editing
      });
      setExpense({
        name: '',
        amount: '',
        date: '',
        description: '',
        isPaid: false,
        category: ''
      });
      setDateOption('today');
    } else {
      alert("Name, amount, and date are required.");
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
      
      <Form.Group>
        <Form.Label>Select Date</Form.Label>
        <Row className="mb-3">
          <Col>
            <Button
              variant={dateOption === 'today' ? 'primary' : 'outline-primary'}
              onClick={() => handleDateChange('today')}
            >
              Today
            </Button>
          </Col>
          <Col>
            <Button
              variant={dateOption === 'yesterday' ? 'primary' : 'outline-primary'}
              onClick={() => handleDateChange('yesterday')}
            >
              Yesterday
            </Button>
          </Col>
          <Col>
            <Button
              variant={dateOption === 'custom' ? 'primary' : 'outline-primary'}
              onClick={() => handleDateChange('custom')}
            >
              Custom
            </Button>
          </Col>
        </Row>
        
        {dateOption === 'custom' && (
          <Form.Control
            type="date"
            name="date"
            value={expense.date}
            onChange={handleChange}
            required
          />
        )}
      </Form.Group>

      <Form.Group>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Description (optional)"
          name="description"
          value={expense.description}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Control
          as="select"
          name="category"
          value={expense.category}
          onChange={handleChange}
        >
          <option value="">Select Category (optional)</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </Form.Control>
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