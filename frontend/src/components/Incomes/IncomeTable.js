import React, { useState } from "react";
import { Table, Form } from "react-bootstrap";
import moment from "moment";
import "./IncomeTable.css";

const IncomeTable = ({ incomes }) => {
  const [groupByCategory, setGroupByCategory] = useState(false);

  // Extract unique months from incomes data and sort them
  const months = [...new Set(incomes.map((income) => income.date))].sort(
    (a, b) => moment(a, "YYYY-MM").diff(moment(b, "YYYY-MM"))
  );

  // Extract unique income names
  const incomeNames = [...new Set(incomes.map((income) => income.name))];

  // Calculate the income amount for each name and month
  const calculateIncome = (incomeName, month) => {
    const income = incomes.find(
      (income) => income.name === incomeName && income.date === month
    );
    return income ? income.amount : 0;
  };

  // Calculate the total for each income name across all months
  const calculateTotalForName = (incomeName) => {
    return months.reduce(
      (total, month) => total + calculateIncome(incomeName, month),
      0
    );
  };

  // Calculate the total for each month across all income names
  const calculateTotalForMonth = (month) => {
    return incomeNames.reduce(
      (total, name) => total + calculateIncome(name, month),
      0
    );
  };

  // Calculate the grand total across all months and income names
  const calculateGrandTotal = () => {
    return incomes.reduce((total, income) => total + income.amount, 0);
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <span className="me-2">Group by</span>
        <Form.Check
          type="switch"
          id="group-by-category-switch"
          checked={groupByCategory}
          onChange={(e) => setGroupByCategory(e.target.checked)}
        />
        <span className="ms-2">Category</span>
      </div>
      <Table bordered hover className="income-table">
        <thead>
          <tr className="bg-primary text-white">
            <th>Income Name</th>
            {months.map((month) => (
              <th key={month}>{moment(month, "YYYY-MM").format("MMMM YYYY")}</th>
            ))}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {/* {incomeNames.map((incomeName, index) => (
            <tr key={index}>
              <td>{incomeName}</td>
              {months.map((month) => (
                <td key={month}>
                  {calculateIncome(incomeName, month).toFixed(2)} CHF
                </td>
              ))}
              <td>{calculateTotalForName(incomeName).toFixed(2)} CHF</td>
            </tr>
          ))} */}
          <tr className="total-row">
            <td>Total</td>
            {months.map((month) => (
              <td key={month}>{calculateTotalForMonth(month).toFixed(2)} CHF</td>
            ))}
            <td>{calculateGrandTotal().toFixed(2)} CHF</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default IncomeTable;
