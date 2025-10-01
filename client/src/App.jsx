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

  // TODO: Update useEffect to correctly format data from new table

  useEffect(() => {
    async function getStoredData() {
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

      try {
        const data = await getBudgetData();
        const transformedEntries = transformBudgetData(data);
        setBudgetData(transformedEntries);
      } catch (error) {
        setError(error);
      }
    }
    getStoredData();
    setError(null);
  }, []);

  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-50 via-violet-200 to-teal-100 dark:from-slate-700 dark:via-indigo-900 dark:to-violet-900 min-h-screen">
      <Header />
      {error && (
        <p className="font-bold text-red-400 flex justify-center">{error}</p>
      )}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center max-w-6xl mx-auto">
        <Income data={budgetData.income} />
        <HomeExpense data={budgetData.homeExpense} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
