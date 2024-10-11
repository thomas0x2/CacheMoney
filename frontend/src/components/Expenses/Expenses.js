import React, { useState, useEffect } from 'react';
import { Button, Form, ListGroup, Container, Row, Col, Card, InputGroup, FormControl } from 'react-bootstrap';
import SidebarNav from '../SidebarNav/SidebarNav';
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile';
import * as XLSX from 'xlsx';
import { Chart as ChartJS } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faArrowCircleLeft, faArrowCircleRight, faPlusCircle, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

function Expenses() {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expensesPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [addOption, setAddOption] = useState(null);

  const categories = ['Utility', 'Rent', 'Groceries', 'Entertainment', 'Other'];

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(expenses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(wb, "Expenses.xlsx");
  };

  const handleOptionClick = (option) => {
    setAddOption(option);
  };

  const handleEdit = (expense) => {
    setEditing(true);
    setCurrentExpense(expense);
    setName(expense.name);
    setAmount(expense.amount);
    setDate(expense.date);
    setDescription(expense.description);
    setIsPaid(expense.status === "PAID");
    setCategory(expense.category || '');
    setAddOption('manual'); // Automatically open manual form when editing
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount || !date || !description || !category) {
      alert("All fields are required, including the category.");
      return;
    }
    const isConfirmed = window.confirm(editing ? "Are you sure you want to update this expense?" : "Are you sure you want to add this expense?");
    if (!isConfirmed) {
      return;
    }

    const expenseData = {
      id: editing ? currentExpense.id : Date.now(),
      name,
      amount,
      date,
      description,
      status: isPaid ? "PAID" : "DUE",
      category,
    };

    if (editing) {
      setExpenses(expenses.map(expense => expense.id === currentExpense.id ? expenseData : expense));
    } else {
      setExpenses([...expenses, expenseData]);
    }

    resetForm();
  };

  const resetForm = () => {
    setName('');
    setAmount('');
    setDate('');
    setDescription('');
    setIsPaid(false);
    setEditing(false);
    setCurrentExpense(null);
    setCategory('');
    setAddOption(null);
  };

  const handleRemove = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to remove this expense?");
    if (isConfirmed) {
      setExpenses(expenses.filter(expense => expense.id !== id));
    }
  };

  const totalExpense = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);

  const chartData = {
    labels: expenses.map(expense => new Date(expense.date)),
    datasets: [
      {
        label: 'Total Expenses',
        data: expenses.map(expense => expense.amount),
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
      <Row>
        <Col md={2} className="sidebar">
          <SidebarNav />
        </Col>
        <Col md={10} className="main">
          <BreadcrumbAndProfile 
            username="Mr. French Pitbull" 
            role="Freelancer React Developer" 
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
          <div className="d-flex justify-content-between mt-4 mb-3">
            <Button variant="secondary" onClick={() => handleOptionClick('google-wallet')}>Add through Google Wallet</Button>
            <Button variant="secondary" onClick={() => handleOptionClick('camera')}>Add through Camera</Button>
            <Button variant="secondary" onClick={() => handleOptionClick('picture')}>Add through Picture</Button>
            <Button variant="primary" onClick={() => handleOptionClick('manual')}>Add Manually</Button>
          </div>

          {/* Conditional rendering based on the selected option */}
          {addOption === 'manual' && (
            <Form onSubmit={handleSubmit}>
              {/* Manual Form Fields */}
              {/* Your existing form code goes here */}
            </Form>
          )}

          {addOption === 'google-wallet' && <p>Google Wallet integration will be added here.</p>}
          {addOption === 'camera' && <p>Camera functionality will be added here.</p>}
          {addOption === 'picture' && <p>Picture upload functionality will be added here.</p>}
        </Col>
      </Row>
    </Container>
  );
}

export default Expenses;
