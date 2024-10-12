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
  faChevronUp,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const categories = ["Utility", "Rent", "Groceries", "Entertainment", "Other"];

function Savings() {
  const [savings, setSavings] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [amount, setAmount] = useState(0);

  const handleAddSaving = (e) => {
    e.preventDefault();
    const newSaving = {
      id: Date.now(),
      name,
      category,
      amount,
      date: new Date(),
    };
    setSavings([newSaving, ...savings]);
    setName("");
    setCategory(categories[0]);
    setAmount(0);
  };

  const handleAmountChange = (increment) => {
    setAmount((prevAmount) => Math.max(0, prevAmount + increment));
  };

  const chartData = {
    labels: savings.map((saving) => saving.date.toLocaleDateString()),
    datasets: [
      {
        label: "Savings Over Time",
        data: savings.map((saving, index) => ({
          x: saving.date,
          y: savings.slice(0, index + 1).reduce((sum, s) => sum + s.amount, 0),
        })),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
      },
      y: {
        beginAtZero: true,
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
            username="Nerit Küneşko"
            role="Entrepreneur"
            pageTitle="Savings"
            breadcrumbItems={[
              { name: "Dashboard", path: "/dashboard", active: false },
              { name: "Savings", path: "/savings", active: true },
            ]}
          />
          <Row className="mt-4">
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Add New Saving</Card.Title>
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
                          onChange={(e) =>
                            setAmount(parseFloat(e.target.value))
                          }
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
                      {"Add Savings"}
                      <FontAwesomeIcon
                        icon={faPlusCircle}
                        className="icon-right"
                      />
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Recent Savings</Card.Title>
                  <ListGroup>
                    {savings.slice(0, 5).map((saving) => (
                      <ListGroup.Item key={saving.id}>
                        <strong>{saving.name}</strong> ({saving.category}) - CHF{" "}
                        {saving.amount.toFixed(2)}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Savings Trend</Card.Title>
                  <Line data={chartData} options={chartOptions} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Savings;
