import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import TopbarNav from "../TopbarNav/TopbarNav";
import BreadcrumbAndProfile from "../BreadcrumbAndProfile/BreadcrumbAndProfile";
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
  Legend
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
  const radius = 60; // Increased radius for a bigger ring
  const strokeWidth = 10; // Increased stroke width for better visibility
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const fillPercentage = Math.min(Math.max(progress, 0), 1);
  const fillOffset = circumference * (1 - fillPercentage);

  return (
    <div className="text-center ring-container">
      <svg width="150" height="150" viewBox="0 0 150 150">
        <defs>
          <linearGradient id="gradient">
            <stop offset="0%" stopColor="#00BFFF" />
            <stop offset="100%" stopColor="#1E90FF" />
          </linearGradient>
        </defs>
        <circle
          cx="75"
          cy="75"
          r={normalizedRadius}
          fill="transparent"
          stroke="#e6e6e6"
          strokeWidth={strokeWidth}
        />
        <circle
          cx="75"
          cy="75"
          r={normalizedRadius}
          fill="transparent"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={fillOffset}
          strokeLinecap="round"
          transform="rotate(-90 75 75)"
        >
          <animate
            attributeName="stroke-dashoffset"
            from={circumference}
            to={fillOffset}
            dur="1s"
            fill="freeze"
          />
        </circle>
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="18px"
          fill="#333"
        >
          {`${(fillPercentage * 100).toFixed(0)}%`}
        </text>
      </svg>
      <p className="mt-2 ring-text">{text}</p>
      <p className="text-muted">
        {currentSavings.toFixed(2)}/{savingsTarget.toFixed(2)} CHF
      </p>
    </div>
  );
}

function Savings() {
  const [savingsPlan, setSavingsPlan] = useState([]);
  const [currentSavings, setCurrentSavings] = useState({});
  const [loading, setLoading] = useState(true);

  const { savingTarget, setSavingTarget, totalSavings, setTotalSavings } = useGlobalContext();

  useEffect(() => {
    const fetchSavingsData = async () => {
      try {
        const savingsResponse = await fetch(`/api/monthly-savings-last6months?userid=YuwRGr2aNKQMu4LCN3sZcGNqg8g2`);
        const savingsData = await savingsResponse.json();

        console.log("Last 6 months savings data: ", savingsData);

        const last3Months = Object.keys(savingsData).sort().slice(-3);
        console.log("Last 3 months: ", last3Months);

        const savingsByMonth = last3Months.reduce((acc, month) => {
          if (savingsData[month]?.income !== undefined && savingsData[month]?.expenses !== undefined) {
            acc[month] = savingsData[month].income - savingsData[month].expenses;
          } else {
            acc[month] = 0; // Default to 0 if data is missing
          }
          return acc;
        }, {});
        setCurrentSavings(savingsByMonth);

        const summaryResponse = await fetch(`/api/financial_summary?userid=YuwRGr2aNKQMu4LCN3sZcGNqg8g2`);
        const summaryData = await summaryResponse.json();

        console.log("Financial summary data: ", summaryData);

        const totalIncome = summaryData.total_income ?? 0;
        const totalExpenses = summaryData.total_expenses ?? 0;
        const calculatedSavings = totalIncome - totalExpenses;
        setTotalSavings(calculatedSavings);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching savings data:", error);
        setLoading(false);
      }
    };

    fetchSavingsData();
  }, [setTotalSavings]);

  const getRingData = () => {
    if (loading) return [];

    const currentDate = new Date();
    const last3Months = Array.from({ length: 3 }, (_, i) => {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    });

    const monthlyRings = last3Months.map((monthYear) => ({
      text: monthYear,
      progress: currentSavings[monthYear] ? currentSavings[monthYear] / (savingTarget / 12) : 0,
      currentSavings: currentSavings[monthYear] || 0,
      savingsTarget: savingTarget / 12,
    }));

    const totalRing = {
      text: "Total Savings",
      progress: totalSavings / savingTarget,
      currentSavings: totalSavings,
      savingsTarget: savingTarget,
    };

    return [...monthlyRings, totalRing];
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
            pageTitle="Savings"
            breadcrumbItems={[
              { name: "Dashboard", path: "/dashboard", active: false },
              { name: "Savings", path: "/savings", active: true },
            ]}
          />

          {/* Rings section */}
          <Row className="mt-4 mb-4 justify-content-center">
            {getRingData().map((ring, index) => (
              <Col key={index} xs={12} sm={6} md={3} lg={2} className="mb-4">
                <ProgressRing 
                  progress={ring.progress} 
                  text={ring.text} 
                  currentSavings={ring.currentSavings}
                  savingsTarget={ring.savingsTarget}
                />
              </Col>
            ))}
          </Row>

          {/* Removed the Recent Savings and Add Savings sections */}

          <Row className="mt-4">
            <Col md={6}>
              <SavingsSetup 
                savingsPlan={savingsPlan} 
                onSavingsPlanChange={(newPlan) => {
                  setSavingsPlan(newPlan);
                  const newTotal = newPlan.reduce(
                    (sum, category) => sum + (category.savingsTarget || 0),
                    0
                  );
                  setSavingTarget(newTotal);
                  localStorage.setItem("savingsPlan", JSON.stringify(newPlan));
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Savings;
