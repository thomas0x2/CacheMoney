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
import SidebarNav from "../SidebarNav/SidebarNav";
import BreadcrumbAndProfile from "../BreadcrumbAndProfile/BreadcrumbAndProfile";
import IncomeForm from "./IncomeForm";
import IncomeTable from "./IncomeTable";
import * as XLSX from "xlsx";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExcel,
  faArrowCircleLeft,
  faArrowCircleRight,
  faPlusCircle,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

function Incomes() {
  const [incomes, setIncomes] = useState(() => {
    const savedIncomes = localStorage.getItem("incomes");
    return savedIncomes ? JSON.parse(savedIncomes) : [];
  });
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentIncome, setCurrentIncome] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [incomesPerPage] = useState(5);
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["Salary", "Pension", "Freelance", "Investment", "Other"];

  useEffect(() => {
    localStorage.setItem("incomes", JSON.stringify(incomes));
  }, [incomes]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(incomes);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Incomes");
    XLSX.writeFile(wb, "Incomes.xlsx");
  };

  const handleEdit = (income) => {
    setEditing(true);
    setCurrentIncome(income);
    setName(income.name);
    setAmount(income.amount);
    setDate(income.date);
    setDescription(income.description);
    setIsPaid(income.status === "PAID");
    setCategory(income.category);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount || !date || !description || !category) {
      alert("All fields are required, including the category.");
      return;
    }
    const isConfirmed = window.confirm(
      editing
        ? "Are you sure you want to update this income?"
        : "Are you sure you want to add this income?",
    );
    if (!isConfirmed) {
      return;
    }

    const incomeData = {
      id: editing ? currentIncome.id : Date.now(),
      name,
      amount,
      date,
      description,
      status: isPaid ? "PAID" : "DUE",
      category,
    };

    if (editing) {
      setIncomes(
        incomes.map((income) =>
          income.id === currentIncome.id ? incomeData : income,
        ),
      );
    } else {
      setIncomes([...incomes, incomeData]);
    }

    resetForm();
  };

  const resetForm = () => {
    setName("");
    setAmount("");
    setDate("");
    setDescription("");
    setIsPaid(false);
    setEditing(false);
    setCurrentIncome(null);
    setCategory("");
  };

  const handleRemove = (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to remove this income?",
    );
    if (isConfirmed) {
      setIncomes(incomes.filter((income) => income.id !== id));
    }
  };

  const handleAddIncome = (newIncome) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to add this income?",
    );
    if (isConfirmed) {
      setIncomes([...incomes, newIncome]);
    }
  };

  const totalIncome = incomes.reduce(
    (total, income) => total + parseFloat(income.amount),
    0,
  );

  const filteredIncomes =
    searchQuery.length > 0
      ? incomes.filter(
        (income) =>
          income.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (income.category?.toLowerCase() || "").includes(
            searchQuery.toLowerCase(),
          ),
      )
      : incomes;

  // Pagination logic
  const indexOfLastIncome = currentPage * incomesPerPage;
  const indexOfFirstIncome = indexOfLastIncome - incomesPerPage;
  const currentIncomes = filteredIncomes.slice(
    indexOfFirstIncome,
    indexOfLastIncome,
  );

  // Change page function
  const handlePreviousPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) =>
      prev * incomesPerPage < filteredIncomes.length ? prev + 1 : prev,
    );
  };

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="sidebar">
          <SidebarNav />
        </Col>
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
            <Col md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }} // Initial state: transparent and slightly below its final position
                animate={{ opacity: 1, y: 0 }} // Animate to: fully opaque and in its final position
                transition={{ duration: 0.5, delay: 0.2 }} // Customize the duration and add a delay if desired
              >
                <Card className="mt-3 total">
                  <Card.Body>
                    <Card.Title>Total Income</Card.Title>
                    <Card.Text>Total: {totalIncome.toFixed(2)} CHF</Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
              <IncomeForm
                onAddIncome={handleAddIncome}
                categories={categories}
              />
            </Col>

            <Col md={6}>
              <h2>Recurring Income </h2>
              <ListGroup className="mt-3">
                {filteredIncomes.map((income) => (
                  <ListGroup.Item key={income.id} className="list-group-item">
                    <div className="expense-details">
                      {`${income.name} - Amount: CHF${income.amount} - Frequency: ${income.frequency} - Category: ${income.category || "Not specified"}`}
                    </div>
                    <div className="button-group">
                      <Button
                        className="edit"
                        size="sm"
                        onClick={() => handleEdit(income)}
                        style={{ marginRight: "5px" }}
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className="icon-left"
                        />
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemove(income.id)}
                      >
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          className="icon-left"
                        />
                        Remove
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
          <Row className="mt-4">
            <h3>Income Overview</h3>
            <Col className="p4">
              <IncomeTable incomes={incomes} />
            </Col>
          </Row>
          {/* Pagination Controls */}
          <div className="d-flex justify-content-between mt-3">
            <Button
              onClick={handlePreviousPage}
              className="page"
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faArrowCircleLeft} />
            </Button>
            <Button
              onClick={handleNextPage}
              className="page"
              disabled={currentPage * incomesPerPage >= incomes.length}
            >
              <FontAwesomeIcon icon={faArrowCircleRight} />
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Incomes;
