import React from "react";
import Card from "./card";

export default function Summary(props) {
  const data = props.data;
  console.log(data);

  // Create helper function to add all the values from category starting with income. This can be used against multiple categories for expenses

  const totalIncome = null;
  const totalExpenses = null;
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
