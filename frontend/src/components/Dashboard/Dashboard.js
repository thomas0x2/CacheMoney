// Dashboard.js
import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import TopbarNav from "../TopbarNav/TopbarNav";
import BreadcrumbAndProfile from "../BreadcrumbAndProfile/BreadcrumbAndProfile";
import InfoCard from "../InfoCard/InfoCard";
import "./Dashboard.css";
import { motion } from "framer-motion";

// Add this line to get User Data
import { UserContext } from "../Auth/UserContext"; // Import UserContext

function Dashboard({
  monthlyTarget = 400,
}) {
  const [timeRange, setTimeRange] = useState("7 Days");
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [financialSummary, setFinancialSummary] = useState({
    total_expenses: 0,
    total_income: 0,
  });

  const user = useContext(UserContext);

  useEffect(() => {
    // Fetch the latest month data from the new API
    const fetchMonthlyData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Fetching data from /api/monthly-savings-last6months...");
        const response = await fetch(`/api/monthly-savings-last6months?userid=${user.uid}`);
        
        // Debug the response status
        console.log("Response status: ", response.status);

        if (!response.ok) {
          throw new Error('Failed to fetch financial summary');
        }

        const data = await response.json();
        
        // Debug the fetched data
        console.log("Fetched data: ", data);

        // Assuming the data is in the format provided in the image (sorted by month)
        const months = Object.keys(data).sort();
        console.log("Sorted months: ", months);

        const latestMonth = months.pop();  // Get the latest month key
        console.log("Latest month: ", latestMonth);

        const latestData = data[latestMonth];  // Get the income and expenses for the latest month

        // Debug the latest month data
        console.log("Latest month data: ", latestData);

        setFinancialSummary({
          total_income: latestData.income,
          total_expenses: latestData.expenses,
        });

        // Debug final financial summary state
        console.log("Updated financialSummary: ", {
          total_income: latestData.income,
          total_expenses: latestData.expenses,
        });

      } catch (err) {
        console.error("Error fetching financial summary: ", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthlyData();
  }, [user.uid]);

  useEffect(() => {
    const fetchExpenses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let endpoint;
        switch (timeRange) {
          case "24 Hours":
            endpoint = `/api/expense/last24hours?userid=${user.uid}`;
            break;
          case "7 Days":
            endpoint = `/api/expense/last7days?userid=${user.uid}`;
            break;
          default:
            endpoint = `/api/expense/last30days?userid=${user.uid}`;
        }
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch expenses');
        }
        const data = await response.json();
        setExpenses(data.expenses); // Accessing 'expenses' key from response
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [timeRange, user.uid]);

  // Calculate savings from the income and expenses
  const savings = financialSummary.total_income - financialSummary.total_expenses;

  // Helper function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Container fluid>
      <Row className="topbar">
        <TopbarNav username="Nerit Küneşko" role="Entrepreneur" />
      </Row>
      <Row>
        <Col md={10} className="main-content main">
          <BreadcrumbAndProfile
            username="Nerit Küneşko"
            role="Entrepreneur"
            pageTitle="Dashboard"
            breadcrumbItems={[
              { name: "Dashboard", path: "/dashboard", active: true },
              { name: "Welcome", path: "/welcome", active: true },
            ]}
          />

          {/* Overview section with target and savings */}
          <Row className="mb-3">
            <Col md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <InfoCard
                  title="Monthly Target"
                  value={`CHF ${monthlyTarget}`}
                  linkText="Set your target"
                  linkTo="/savings"
                />
              </motion.div>
            </Col>
            <Col md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <InfoCard
                  title="Savings This Month"
                  value={`CHF ${savings.toFixed(2)}`}
                  linkText="View savings details"
                  linkTo="/savings"
                />
              </motion.div>
            </Col>
          </Row>

          {/* Row for Incomes and Expenses */}
          <Row>
            <Col md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <InfoCard
                  title="Incomes"
                  value={`CHF ${financialSummary.total_income.toFixed(2)}`}
                  linkText="Add or manage your Income"
                  linkTo="/incomes"
                />
              </motion.div>
            </Col>
            <Col md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <InfoCard
                  title="Expenses"
                  value={`CHF ${financialSummary.total_expenses.toFixed(2)}`}
                  linkText="Add or manage your expenses"
                  linkTo="/expenses"
                />
              </motion.div>
            </Col>
          </Row>

          {/* Expense Tracker with latest expenses and filter */}
          <Row className="mb-5 mt-4">
            <Col md={12} className="expense-tracker">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="expense-tracker-title">Expense Tracker</h2>
                <DropdownButton
                  id="dropdown-time-range"
                  title={`Showing: Last ${timeRange}`}
                  variant="secondary"
                  onSelect={(e) => setTimeRange(e)}
                >
                  <Dropdown.Item eventKey="24 Hours">Last 24 Hours</Dropdown.Item>
                  <Dropdown.Item eventKey="7 Days">Last 7 Days</Dropdown.Item>
                  <Dropdown.Item eventKey="30 Days">Last 30 Days</Dropdown.Item>
                </DropdownButton>
              </div>
              <Table striped bordered hover className="styled-expense-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length > 0 ? (
                    expenses.map((expense, index) => (
                      <tr key={index}>
                        <td>{formatDate(expense.date)}</td>
                        <td>{expense.name}</td>
                        <td>{expense.category}</td>
                        <td>{expense.description}</td>
                        <td>CHF {expense.amount.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No expenses found for the selected time range.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
