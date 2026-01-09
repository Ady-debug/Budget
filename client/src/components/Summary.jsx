import React, { useEffect, useState } from "react";
import Card from "./card";

export default function Summary(props) {
  const data = props.data;

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  function updateTotals(data) {
    // Loops through each category in the budget, if that category is income then the value of each item is added to the totalIncome. If the category is not income, and therefore an expense, it is added to the totalExpenses.
    let income = 0;
    let expenses = 0;

    for (let budgetCategory in data) {
      for (let budgetItem in data[budgetCategory]) {
        if (budgetCategory === "income") {
          income += data[budgetCategory][budgetItem];
        } else {
          expenses += data[budgetCategory][budgetItem];
        }
      }
      setTotalIncome(parseFloat(income).toFixed(2));
      setTotalExpenses(parseFloat(expenses).toFixed(2));
    }
  }

  const surplus = parseFloat(totalIncome - totalExpenses).toFixed(2);

  useEffect(() => {
    updateTotals(data);
  }),
    [data];

  // FIXME: Use effect not working as expected to update the totals dynamically so also needs investigating.

  return (
    <div>
      <Card title="Summary" error={null}>
        <p className="font-normal text-gray-700 dark:text-gray-400 flex gap-5 mt-5">
          <span className="w-40">{totalIncome > 0 && "Total Income:"}</span>
          <span className="w-17">{totalIncome > 0 && `£${totalIncome}`}</span>
        </p>
        <p className="font-normal text-gray-700 dark:text-gray-400 flex gap-5 mt-5">
          <span className="w-40">{totalExpenses > 0 && "Total Expenses:"}</span>
          <span className="w-17">
            {totalExpenses > 0 && `£${totalExpenses}`}
          </span>
        </p>
        <p className="font-normal text-gray-700 dark:text-gray-400 flex gap-5 mt-5">
          <span className="w-40">{surplus > 0 && "Surplus:"}</span>
          <span className="w-17">{surplus > 0 && `£${surplus}`}</span>
        </p>
      </Card>
    </div>
  );
}
