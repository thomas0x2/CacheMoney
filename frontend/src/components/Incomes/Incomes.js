import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  ListGroup,
  Container,
  Row,
  Col,
  Card,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import TopbarNav from "../TopbarNav/TopbarNav";
import BreadcrumbAndProfile from "../BreadcrumbAndProfile/BreadcrumbAndProfile";
import IncomeForm from "./IncomeForm";
import IncomeTable from "./IncomeTable";
import InfoCard from "../InfoCard/InfoCard";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleLeft,
  faArrowCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import moment from "moment";

function Incomes() {
  const [incomes, setIncomes] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch the income data from the last 6 months and total income from the financial summary API
    const fetchIncomesData = async () => {
      try {
        // Fetch the last 6 months of savings data (which includes income)
        const response = await fetch(
          `/api/monthly-savings-last6months?userid=YuwRGr2aNKQMu4LCN3sZcGNqg8g2`
        );
        const data = await response.json();
        console.log("Last 6 months data: ", data);

        // Extract income data from the last 6 months
        const last6Months = Object.keys(data).sort();
        const incomeEntries = last6Months.map((month) => ({
          id: month,
          name: moment(month, "YYYY-MM").format("MMMM YYYY"), // Use formatted month as the name
          amount: data[month].income,
          date: moment(month, "YYYY-MM").format("YYYY-MM"), // date in 'YYYY-MM' format
          description: "Income for the month", // You can adjust this
          category: "Recurring", // Assuming these are recurring incomes
          frequency: "monthly",
        }));
        setIncomes(incomeEntries);

        // Fetch the total income from the financial summary API
        const summaryResponse = await fetch(
          `/api/financial_summary?userid=YuwRGr2aNKQMu4LCN3sZcGNqg8g2`
        );
        const summaryData = await summaryResponse.json();
        console.log("Financial summary data: ", summaryData);

        // Set the total income from the financial summary data
        setTotalIncome(summaryData.total_income);
      } catch (error) {
        console.error("Error fetching income data:", error);
      }
    };

    fetchIncomesData();
  }, []);

  const filteredIncomes =
    searchQuery.length > 0
      ? incomes.filter(
          (income) =>
            income.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (income.category?.toLowerCase() || "").includes(
              searchQuery.toLowerCase()
            )
        )
      : incomes;

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
            pageTitle="Incomes"
            breadcrumbItems={[
              { name: "Dashboard", path: "/dashboard", active: false },
              { name: "Incomes", path: "/incomes", active: true },
            ]}
          />
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search incomes..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          <Row>
            <Col md={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }} // Initial state: transparent and slightly below its final position
                animate={{ opacity: 1, y: 0 }} // Animate to: fully opaque and in its final position
                transition={{ duration: 0.5, delay: 0.2 }} // Customize the duration and add a delay if desired
              >
                <InfoCard
                  title="Total Income"
                  value={`CHF ${totalIncome.toFixed(2)}`}
                  className="mt-3 total"
                />
              </motion.div>
              {/* You can keep the IncomeForm if needed */}
            </Col>
          </Row>
          <Row className="mt-4">
            <h3>Income Overview</h3>
            <Col className="p4">
              <IncomeTable incomes={filteredIncomes} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Incomes;
