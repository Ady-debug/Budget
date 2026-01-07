import React from "react";
import Card from "./card";

export default function Summary(props) {
  const data = props.data;
  console.log(data);

  let totalIncome = 0;
  let totalExpenses = 0;

  // Loops through each category in the budget, if that category is income then the value of each item is added to the totalIncome. If the category is not income, and therefore an expense, it is added to the totalExpenses.
  for (let budgetCategory in data) {
    for (let budgetItem in data[budgetCategory]) {
      if (budgetCategory === "income") {
        totalIncome += data[budgetCategory][budgetItem];
      } else {
        totalExpenses += data[budgetCategory][budgetItem];
      }
      console.log(`Budget category: ${budgetCategory}`);
      console.log(`Budget item: ${budgetItem}`);
      console.log(`Budget item amount: ${data[budgetCategory][budgetItem]}`);
    }
  }

  // FIXME: Total is correct aside from a trailing .0000000000005 which needs investigating.

  const surplus = totalIncome - totalExpenses;

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
