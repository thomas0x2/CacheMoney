import React, { useState, useEffect } from "react";
import { ListGroup, Container, Row, Col, Card, Button } from "react-bootstrap";
import TopbarNav from "../TopbarNav/TopbarNav";
import SidebarNav from "../SidebarNav/SidebarNav";
import BreadcrumbAndProfile from "../BreadcrumbAndProfile/BreadcrumbAndProfile";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import AddSavings from "./AddSavings";
import SavingsSetup from "./SavingsSetup";
import { useGlobalContext } from "../../App"; 
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

const categories = [
  "Groceries",
  "Utilities",
  "Transportation",
  "Housing",
  "Entertainment",
  "Clothing",
  "Dining out",
  "Insurance",
  "Healthcare",
  "Education",
  "Travel",
  "Personal care",
  "Subscriptions",
  "Electronics",
  "Home maintenance",
  "Debt payments",
  "Gifts",
  "Hobbies",
  "Fitness",
  "Childcare",
  "Other",
];

function ProgressRing({ progress, text, currentSavings, savingsTarget }) {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const fillPercentage = Math.min(Math.max(progress, 0), 1);
  const fillOffset = circumference * (1 - fillPercentage);

  return (
    <div className="text-center">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="transparent"
          stroke="#A9A9A9"
          strokeWidth="4"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="transparent"
          stroke="#00008B"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={fillOffset}
          transform="rotate(-90 40 40)"
        />
      </svg>
      <p className="mt-2">{text}</p>
      <p className="text-muted">
        {currentSavings.toFixed(2)}/{savingsTarget.toFixed(2)} CHF
      </p>
      <p className="text-muted">{(fillPercentage * 100).toFixed(0)}%</p>
    </div>
  );
}

function Savings() {
  const [savingsEntries, setSavingsEntries] = useState([]);
  const [savingsPlan, setSavingsPlan] = useState([]);
  const [currentSavings, setCurrentSavings] = useState({});

  // Use the global context
  const { savingTarget, setSavingTarget, totalSavings, setTotalSavings } = useGlobalContext();

  useEffect(() => {
    // Load saved plan and savings entries from local storage when component mounts
    const savedPlan = localStorage.getItem("savingsPlan");
    const savedEntries = localStorage.getItem("savingsEntries");

    if (savedPlan) {
      const parsedPlan = JSON.parse(savedPlan);
      setSavingsPlan(parsedPlan);
      const initialTotal = parsedPlan.reduce(
        (sum, category) => sum + (category.savingsTarget || 0),
        0,
      );
      setSavingTarget(initialTotal); // Update global saving target
    }
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries);
      setSavingsEntries(parsedEntries);
      updateCurrentSavings(parsedEntries);
    }
  }, [setSavingTarget]);

  const updateCurrentSavings = (entries) => {
    const savingsByCategory = entries.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + entry.amount;
      return acc;
    }, {});
    setCurrentSavings(savingsByCategory);

    const newTotalSavings = Object.values(savingsByCategory).reduce((sum, value) => sum + value, 0);
    setTotalSavings(newTotalSavings); // Update global total savings
  };

  const handleAddSaving = (newSaving) => {
    setSavingsEntries((prevEntries) => {
      const updatedEntries = [newSaving, ...prevEntries];
      localStorage.setItem("savingsEntries", JSON.stringify(updatedEntries));
      updateCurrentSavings(updatedEntries);
      return updatedEntries;
    });
  };

  const handleSavingsPlanChange = (newPlan) => {
    setSavingsPlan(newPlan);
    const newTotal = newPlan.reduce(
      (sum, category) => sum + (category.savingsTarget || 0),
      0,
    );
    setSavingTarget(newTotal); // Update global saving target
    localStorage.setItem("savingsPlan", JSON.stringify(newPlan));
  };

  const handleEdit = (entry) => {
    // TODO: Implement edit functionality
    console.log("Edit entry:", entry);
  };

  const handleRemove = (entryId) => {
    setSavingsEntries((prevEntries) => {
      const updatedEntries = prevEntries.filter(
        (entry) => entry.id !== entryId,
      );
      localStorage.setItem("savingsEntries", JSON.stringify(updatedEntries));
      updateCurrentSavings(updatedEntries);
      return updatedEntries;
    });
  };

  const getRingData = () => {
    const planRings = savingsPlan.slice(0, 3).map((category) => ({
      text: category.name,
      progress: (currentSavings[category.name] || 0) / category.savingsTarget,
      currentSavings: currentSavings[category.name] || 0,
      savingsTarget: category.savingsTarget,
    }));

    const remainingRings = [
      {
        text: "Total Savings",
        progress: totalSavings / savingTarget,
        currentSavings: totalSavings,
        savingsTarget: savingTarget,
      },
    ];

    return [...planRings, ...remainingRings];
  };  return (
    <Container fluid>
      <Row className="topbar">
        <TopbarNav username="Nerit Küneşko" role="Entrepreneur" />
      </Row>
      <Row>
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
          
          {/* Rings section */}
          <Row className="mt-4 mb-4">
            {getRingData().map((ring, index) => (
              <Col key={index} xs={6} sm={3}>
                <ProgressRing 
                  progress={ring.progress} 
                  text={ring.text} 
                  currentSavings={ring.currentSavings}
                  savingsTarget={ring.savingsTarget}
                />
              </Col>
            ))}
          </Row>

          <Row className="mt-4">
            <Col md={6}>
              <AddSavings onAddSaving={handleAddSaving} categories={categories} />
              <SavingsSetup 
                categories={categories} 
                savingsPlan={savingsPlan} 
                onSavingsPlanChange={handleSavingsPlanChange}
              />
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Recent Savings</Card.Title>
                  <ListGroup>
                    {savingsEntries.slice(0, 5).map((entry) => (
                      <ListGroup.Item key={entry.id} className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{entry.name}</strong> ({entry.category}) - CHF{" "}
                          {entry.amount.toFixed(2)}
                        </div>
                        <div className="button-group">
                          <Button
                            className="edit-button"
                            size="sm"
                            onClick={() => handleEdit(entry)}
                            style={{ marginRight: "5px" }}
                          >
                            Edit
                          </Button>
                          <Button
                            className="edit-button"
                            size="sm"
                            onClick={() => handleRemove(entry.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
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
