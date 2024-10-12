import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './BreadcrumbAndProfile.css';

function BreadcrumbAndProfile({ username, role, breadcrumbItems, pageTitle }) {
  let welcomeMessage = `Welcome, ${username}`;
  let financialStatusSummary = "Here's a summary of your financial status.";

  if (pageTitle === "Incomes") {
    welcomeMessage = `${username}, here are your incomes...`;
  } else if (pageTitle === "Expenses") {
    welcomeMessage = `${username}, here are your expenses...`;
  } else if (pageTitle === "Dashboard") {
    welcomeMessage = `Welcome back, ${username}`;
    financialStatusSummary = "At the current rate, you will reach your saving target in X days";
  } else if (pageTitle === 'Set Target') {
    welcomeMessage = `${username}, how much do you want to save?`;
    financialStatusSummary = "";
  } else if (pageTitle === 'Savings') {
    welcomeMessage = `${username}, here are your savings...`;
  }

  return (
    <>
      <Breadcrumb className="custom-breadcrumb">
        {breadcrumbItems.map((item, index) => (
          <LinkContainer key={index} to={item.path} active={item.active}>
            <Breadcrumb.Item active={item.active}>{item.name}</Breadcrumb.Item>
          </LinkContainer>
        ))}
      </Breadcrumb>
      <div className="user-info d-flex justify-content-between align-items-center">
        <h1>{pageTitle}</h1>
        <div className="profile">
          <img src={`${process.env.PUBLIC_URL}/images/User/User.png`} alt={username} className="user-image" />
          <div>
            <strong>{username}</strong><br />
            {role}
          </div>
        </div>
      </div>
      <div>
        <h3>{welcomeMessage}</h3>
        <p>{financialStatusSummary}</p>
      </div>
    </>
  );
}

export default BreadcrumbAndProfile;