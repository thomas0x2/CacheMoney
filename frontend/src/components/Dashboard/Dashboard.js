// Dashboard.js
import React, { useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import TopbarNav from "../TopbarNav/TopbarNav";
import SidebarNav from "../SidebarNav/SidebarNav";
import BreadcrumbAndProfile from "../BreadcrumbAndProfile/BreadcrumbAndProfile";
import InfoCard from "../InfoCard/InfoCard";
import NewsCard from "../NewsCard/NewsCard";
import "./Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

// Add this line to get User Data
import { UserContext } from "../Auth/UserContext"; // Import UserContext

function Dashboard({
  totalIncomes,
  totalExpenses,
  monthlyTarget = 5000,
  monthlySavings = 1500,
}) {
  const [timeRange, setTimeRange] = useState("7 Days");

  // Add this line to get User Data
  const user = useContext(UserContext);

  // Get user data like the following
  console.log(user.displayName, user.uid, user.photoURL);

  // Example expenses data
  const expenses = [
    {
      date: "10/01/2024",
      category: "Groceries",
      description: "Weekly shopping",
      amount: "$50",
      daysAgo: 10,
    },
    {
      date: "10/03/2024",
      category: "Transport",
      description: "Monthly bus pass",
      amount: "$80",
      daysAgo: 8,
    },
    {
      date: "10/05/2024",
      category: "Entertainment",
      description: "Streaming service subscription",
      amount: "$15",
      daysAgo: 6,
    },
    {
      date: "10/07/2024",
      category: "Utilities",
      description: "Electricity bill",
      amount: "$120",
      daysAgo: 4,
    },
    {
      date: "10/08/2024",
      category: "Dining",
      description: "Dinner at restaurant",
      amount: "$45",
      daysAgo: 3,
    },
    {
      date: "10/09/2024",
      category: "Health",
      description: "Pharmacy purchase",
      amount: "$30",
      daysAgo: 2,
    },
    {
      date: "10/10/2024",
      category: "Entertainment",
      description: "Cinema tickets",
      amount: "$25",
      daysAgo: 1,
    },
    {
      date: "10/11/2024",
      category: "Groceries",
      description: "Organic market shopping",
      amount: "$65",
      daysAgo: 0,
    },
    {
      date: "10/11/2024",
      category: "Fitness",
      description: "Gym membership",
      amount: "$35",
      daysAgo: 0,
    },
    {
      date: "10/11/2024",
      category: "Subscriptions",
      description: "Monthly music service",
      amount: "$10",
      daysAgo: 0,
    },
    {
      date: "10/11/2024",
      category: "Transport",
      description: "Gas for car",
      amount: "$40",
      daysAgo: 0,
    },
    {
      date: "10/11/2024",
      category: "Gifts",
      description: "Birthday present",
      amount: "$70",
      daysAgo: 0,
    },
  ];

  // Filter expenses based on the selected time range
  const filteredExpenses = expenses.filter((expense) => {
    if (timeRange === "24 Hours") return expense.daysAgo <= 1;
    if (timeRange === "7 Days") return expense.daysAgo <= 7;
    return true; // default to show all expenses
  });

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
                  linkTo="/target"
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
                  value={`CHF ${monthlySavings}`}
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
                  value={`CHF ${totalIncomes}`}
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
                  value={`CHF ${totalExpenses}`}
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
                  <Dropdown.Item eventKey="24 Hours">
                    Last 24 Hours
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="7 Days">Last 7 Days</Dropdown.Item>
                </DropdownButton>
              </div>
              <Table striped bordered hover className="styled-expense-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense, index) => (
                      <tr key={index}>
                        <td>{expense.date}</td>
                        <td>{expense.category}</td>
                        <td>{expense.description}</td>
                        <td>{expense.amount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No expenses found for the selected time range.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>

          {/* Section for news cards */}
          <div className="news-section">
            <h2 className="news-section-title">Latest News</h2>
            <div className="news-cards">
              <Row>
                <Col md={4} xs={12} className="mb-3">
                  <NewsCard
                    topic="personal-finance"
                    image={`${process.env.PUBLIC_URL}/images/News/finance.jpg`}
                    alt="personal finance"
                    title="Unlocking Financial Freedom: Your Guide to Smart Money Moves"
                    description="Discover the secrets to financial success! From savvy investing strategies to practical budgeting tips, empower yourself to achieve your financial dreams and live life on your terms."
                    className="news-card news-card-small"
                  />
                </Col>
                <Col md={4} xs={12} className="mb-3">
                  <NewsCard
                    topic="freelancing"
                    image={`${process.env.PUBLIC_URL}/images/News/freelancing.jpg`}
                    alt="freelancing"
                    title="Thriving in the Gig Economy: Insider Tips for Freelancers"
                    description="Join the booming world of freelancing! Get insider insights, expert advice, and actionable tips to excel in the gig economy. From finding lucrative gigs to mastering time management, embark on your journey to freelancing success."
                    className="news-card news-card-small"
                  />
                </Col>
                <Col md={4} xs={12} className="mb-3">
                  <NewsCard
                    topic="budgeting"
                    image={`${process.env.PUBLIC_URL}/images/News/budgeting.jpg`}
                    alt="budgeting"
                    title="Mastering Your Money: The Art of Stress-Free Budgeting"
                    description="Take control of your finances and transform your life! Learn the art of stress-free budgeting, streamline your expenses, and achieve financial peace of mind. Say goodbye to money worries and hello to a brighter financial future!"
                    className="news-card news-card-small"
                  />
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
