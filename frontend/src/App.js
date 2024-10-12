import React, { useState, useEffect, createContext, useContext } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn/SignIn";
import Dashboard from "./components/Dashboard/Dashboard";
import Incomes from "./components/Incomes/Incomes";
import Expenses from "./components/Expenses/Expenses";
import SignOut from "./components/SignOut/SignOut";
import Savings from "./components/Savings/Savings";
import Assistant from "./components/Assistant/Assistant"; // Import the new Assistant page
import AuthenticatedRoute from "./components/Auth/AuthenticatedRoute";
import { UserProvider } from "./components/Auth/UserContext";
import "./App.css";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [savingTarget, setSavingTarget] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);

  return (
    <GlobalContext.Provider value={{ savingTarget, setSavingTarget, totalSavings, setTotalSavings }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);

function App() {
  const [incomes, setIncomes] = useState(() => {
    const savedIncomes = localStorage.getItem("incomes");
    return savedIncomes ? JSON.parse(savedIncomes) : [];
  });

  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("expenses");
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  // Calculate total incomes
  const totalIncomes = incomes.reduce(
    (total, income) => total + parseFloat(income.amount),
    0,
  );

  // Calculate total expenses
  const totalExpenses = expenses.reduce(
    (total, expense) => total + parseFloat(expense.amount),
    0,
  );

  // Persist incomes and expenses to localStorage
  useEffect(() => {
    localStorage.setItem("incomes", JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  return (
    <GlobalProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route
              path="/dashboard"
              element={
                <AuthenticatedRoute>
                  <Dashboard
                    totalIncomes={totalIncomes}
                    totalExpenses={totalExpenses}
                  />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/incomes"
              element={
                <AuthenticatedRoute>
                  <Incomes incomes={incomes} setIncomes={setIncomes} />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <AuthenticatedRoute>
                  <Expenses expenses={expenses} setExpenses={setExpenses} />
                </AuthenticatedRoute>
              }
            />
            <Route path="/signout" element={<SignOut />} />
            <Route path="/savings" element={<Savings />} />
            <Route
              path="/assistant"
              element={
                <AuthenticatedRoute>
                  <Assistant /> {/* New Assistant route */}
                </AuthenticatedRoute>
              }
            />
          </Routes>
        </Router>
      </UserProvider>
    </GlobalProvider>
  );
}

export default App;