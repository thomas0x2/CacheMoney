import React, { useState } from 'react';
import { Table, Form } from 'react-bootstrap';
import moment from 'moment';
import './IncomeTable.css';

const IncomeTable = ({ incomes }) => {
  const [groupByCategory, setGroupByCategory] = useState(false);

  const currentDate = moment();
  const lastThreeMonths = [
    currentDate.clone().subtract(2, 'months').format('MMMM YYYY'),
    currentDate.clone().subtract(1, 'months').format('MMMM YYYY'),
    currentDate.format('MMMM YYYY')
  ];
  const nextMonth = currentDate.clone().add(1, 'months').format('MMMM YYYY');

  const calculateIncome = (income, month) => {
    const monthStart = moment(month, 'MMMM YYYY').startOf('month');
    const monthEnd = monthStart.clone().endOf('month');
    switch (income.frequency) {
      case 'onetime':
        const incomeDate = moment(income.date);
        return incomeDate.isBetween(monthStart, monthEnd, null, '[]') ? income.amount : 0;
      case 'weekly':
        const weeksInMonth = monthEnd.diff(monthStart, 'weeks') + 1;
        return income.amount * weeksInMonth;
      case 'monthly':
        return income.amount;
      default:
        return 0;
    }
  };

  const calculateTotalForPeriod = (incomes, period) => {
    return incomes.reduce((total, income) => total + calculateIncome(income, period), 0);
  };

  const calculateGrandTotal = (income) => {
    return [...lastThreeMonths, nextMonth].reduce((total, month) => {
      return total + calculateIncome(income, month);
    }, 0);
  };

  const groupIncomesByCategory = (incomes) => {
    const groupedIncomes = {};
    incomes.forEach(income => {
      if (!groupedIncomes[income.category]) {
        groupedIncomes[income.category] = [];
      }
      groupedIncomes[income.category].push(income);
    });
    return Object.entries(groupedIncomes).map(([category, categoryIncomes]) => ({
      name: category,
      ...lastThreeMonths.reduce((acc, month) => {
        acc[month] = calculateTotalForPeriod(categoryIncomes, month);
        return acc;
      }, {}),
      [nextMonth]: calculateTotalForPeriod(categoryIncomes, nextMonth),
      total: categoryIncomes.reduce((total, income) => total + calculateGrandTotal(income), 0)
    }));
  };

  const incomesToDisplay = groupByCategory ? groupIncomesByCategory(incomes) : incomes;

  const grandTotalRow = {
    name: 'Total',
    ...lastThreeMonths.reduce((acc, month) => {
      acc[month] = calculateTotalForPeriod(incomes, month);
      return acc;
    }, {}),
    [nextMonth]: calculateTotalForPeriod(incomes, nextMonth),
    total: incomes.reduce((total, income) => total + calculateGrandTotal(income), 0)
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <span className="me-2">Name</span>
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
            <th>{groupByCategory ? 'Category' : 'Income Name'}</th>
            {lastThreeMonths.map(month => <th key={month}>{month}</th>)}
            <th>{nextMonth}</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {incomesToDisplay.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              {lastThreeMonths.map(month => (
                <td key={month}>
                  {(groupByCategory ? item[month] : calculateIncome(item, month)).toFixed(2)} CHF
                </td>
              ))}
              <td>
                {(groupByCategory ? item[nextMonth] : calculateIncome(item, nextMonth)).toFixed(2)} CHF
              </td>
              <td>
                {(groupByCategory ? item.total : calculateGrandTotal(item)).toFixed(2)} CHF
              </td>
            </tr>
          ))}
          <tr className="total-row">
            <td>{grandTotalRow.name}</td>
            {lastThreeMonths.map(month => (
              <td key={month}>{grandTotalRow[month].toFixed(2)} CHF</td>
            ))}
            <td>{grandTotalRow[nextMonth].toFixed(2)} CHF</td>
            <td>{grandTotalRow.total.toFixed(2)} CHF</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default IncomeTable;
