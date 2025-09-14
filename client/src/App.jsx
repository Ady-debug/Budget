import React, { useState, useEffect } from "react";
import { getBudgetData } from "../api";
import "./App.css";
import Income from "./components/Income";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeExpense from "./components/HomeExpense";

function App() {
  const [budgetData, setBudgetData] = useState({
    income: { wage: "", otherIncome: "" },
    homeExpense: { mortgage: "", councilTax: "" },
  });
  const [error, setError] = useState(null);

  function transformArray(array) {
    const transformedArray = array.reduce((acc, item) => {
      acc[item.budget_item] = item.amount;
      return acc;
    }, {});
    return transformedArray;
  }

  function transformBudgetData(data) {
    const transformedEntries = Object.entries(data).map(([key, array]) => {
      return [key, transformArray(array)];
    });
    return Object.fromEntries(transformedEntries);
  }

  useEffect(() => {
    async function getStoredData() {
      try {
        const data = await getBudgetData();
        const transformedEntries = transformBudgetData(data);
        setBudgetData(transformedEntries);
      } catch (error) {
        setError(error);
      }
    }
    getStoredData();
  }, []);

  //TODO: Review new functions and use Effect to cement understanding
  // TODO: Add top level error component for budget load errors, render a new <p> spanning page

  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-50 via-violet-200 to-teal-100 dark:from-slate-700 dark:via-indigo-900 dark:to-violet-900 min-h-screen">
      <Header />
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center max-w-6xl mx-auto">
        <Income data={budgetData.income} />
        <HomeExpense />
      </div>
      <Footer />
    </div>
  );
}

export default App;
