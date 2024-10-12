import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Card, InputGroup, FormControl } from 'react-bootstrap';
import TopbarNav from '../TopbarNav/TopbarNav';
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile';
import * as XLSX from 'xlsx';
import { Chart as ChartJS } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faPlusCircle, faCamera, faImage } from "@fortawesome/free-solid-svg-icons";
import { motion } from 'framer-motion';

function Expenses() {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });
  const [expense, setExpense] = useState({
    name: '',
    amount: '',
    date: '',
    description: '',
    isPaid: false,
    category: ''
  });
  const [editing, setEditing] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [addOption, setAddOption] = useState(null);
  const [dateOption, setDateOption] = useState('today');
  const [file, setFile] = useState(null);
  const categories = ['Utility', 'Rent', 'Groceries', 'Entertainment', 'Other'];

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(expenses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");gereectBNDHE6Jqz4pO6CmwiPH9Hna1
    XLSX.writeFile(wb, "Expenses.xlsx");
  };

  const handleOptionClick = (option) => {
    setAddOption(option);
  };

  const handleEdit = (expense) => {
    setEditing(true);
    setCurrentExpense(expense);
    setExpense(expense);
    setDateOption('custom');
    setAddOption('manual'); // Automatically open manual form when editing
  };

  const resetForm = () => {
    setExpense({
      name: '',
      amount: '',
      date: '',
      description: '',
      isPaid: false,
      category: ''
    });
    setEditing(false);
    setCurrentExpense(null);
    setDateOption('today');
    setAddOption(null);
  };

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
    if (!expense.name || !expense.amount || !expense.date || !expense.category) {
      alert("All fields are required, including the category.");
      return;
    }

    const newExpense = {
      ...expense,
      amount: parseFloat(expense.amount),
      status: expense.isPaid ? "PAID" : "DUE",
      id: editing ? currentExpense.id : Date.now()
    };

    if (editing) {
      setExpenses(expenses.map(exp => exp.id === currentExpense.id ? newExpense : exp));
    } else {
      setExpenses([...expenses, newExpense]);
    }

    resetForm();
  };

  const handleRemove = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to remove this expense?");
    if (isConfirmed) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
  };

  // Add missing handleFileChange function
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile); // Set the selected file in state
    console.log('File selected:', selectedFile);
  };

  // Add handleFileSubmit for submitting the image
  const handleFileSubmit = () => {
    if (!file) {
      alert('Please select a file before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert('Error: ' + data.error);
      } else {
        console.log('File successfully submitted. Extracted data:', data);

        // Add the returned data to expenses
        const newExpense = {
          id: Date.now(), // You can replace this with a proper unique ID if needed
          name: data.name,
          amount: data.amount,
          date: data.date,
          description: data.description,
          status: "DUE", // Assuming "DUE" for newly added expenses
          category: 'Other' // You can assign a default or a dynamic category
        };

        setExpenses(prevExpenses => [...prevExpenses, newExpense]);
      }
    })
    .catch(error => {
      console.error('Error during file submission:', error);
    });
  };

  const totalExpense = expenses.reduce((total, exp) => total + parseFloat(exp.amount), 0);

  const chartData = {
    labels: expenses.map(exp => new Date(exp.date)),
    datasets: [
      {
        label: 'Total Expenses',
        data: expenses.map(exp => exp.amount),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Expenses (CHF)',
        },
      },
    },
  };

  return (
    <Container fluid>
      <Row className="topbar">
        <TopbarNav username="Nerit Küneşko" role="Entrepreneur" />
      </Row>
      <Row>
        <Col md={10} className="main">
          <BreadcrumbAndProfile
            username="Nerit Küneşko"
            role="Entrepreneur"
            pageTitle="Expenses"
            breadcrumbItems={[
              { name: 'Dashboard', path: '/dashboard', active: false },
              { name: 'Expenses', path: '/expenses', active: true }
            ]}
          />
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search expenses..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          {/* Display Total Expenses and Graph */}
          <Row>
            <Col md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="mt-3 total">
                  <Card.Body>
                    <Card.Title>Total Expense</Card.Title>
                    <Card.Text>
                      Total: {totalExpense.toFixed(2)} CHF
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={6}>
              <div className="chart-container">
                <Line data={chartData} options={chartOptions} />
              </div>
            </Col>
          </Row>

          {/* Buttons for different add expense options */}
          <div className="d-flex justify-content-between mt-4 mb-3 button-group">
            <Button variant="secondary" className="mt-3 primary-button" onClick={() => handleOptionClick('google-wallet')}>
              Add through Google Wallet
              <FontAwesomeIcon icon={faPlusCircle} className="icon-right" />
            </Button>

            <Button variant="secondary" className="mt-3 primary-button" onClick={() => handleOptionClick('camera')}>
              Add through Camera
              <FontAwesomeIcon icon={faCamera} className="icon-right" />
            </Button>

            <Button variant="secondary" className="mt-3 primary-button" onClick={() => handleOptionClick('picture')}>
              Add through Picture
              <FontAwesomeIcon icon={faImage} className="icon-right" />
            </Button>

            <Button variant="primary" className="mt-3 primary-button" onClick={() => handleOptionClick('manual')}>
              Add Manually
              <FontAwesomeIcon icon={faPlusCircle} className="icon-right" />
            </Button>
          </div>

          {/* Conditional rendering based on the selected option */}
          {addOption === 'manual' && (
            <Form onSubmit={handleSubmit}>
              <Row className="grid-row">
                <Col md={6}>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Expense Name"
                      name="name"
                      value={expense.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Control
                      type="number"
                      placeholder="Amount (CHF)"
                      name="amount"
                      value={expense.amount}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

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
                {editing ? "Update Expense" : "Add Expense"}
              </Button>
            </Form>
          )}

          {addOption === 'picture' && (
            <div>
              <input type="file" onChange={handleFileChange} accept="image/*" />
              <Button onClick={handleFileSubmit} className="mt-3 primary-button">Submit Picture</Button>
            </div>
          )}

        </Col>
      </Row>
    </Container>
  );
}

export default Expenses;