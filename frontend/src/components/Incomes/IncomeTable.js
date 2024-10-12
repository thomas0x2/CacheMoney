import React from 'react';
import { Table } from 'react-bootstrap';
import moment from 'moment';
import './IncomeTable.css'

const IncomeTable = ({ incomes }) => {
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
    <Table bordered hover className="income-table">
      <thead>
        <tr className="bg-primary text-white">
          <th>Income Name</th>
          {lastThreeMonths.map(month => <th key={month}>{month}</th>)}
          <th>{nextMonth}</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {incomes.map((income, index) => (
          <tr key={index}>
            <td>{income.name}</td>
            {lastThreeMonths.map(month => (
              <td key={month}>{calculateIncome(income, month).toFixed(2)} CHF</td>
            ))}
            <td>{calculateIncome(income, nextMonth).toFixed(2)} CHF</td>
            <td>{calculateGrandTotal(income).toFixed(2)} CHF</td>
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
  );
};

export default IncomeTable;
