import React from "react";
import Card from "./card";

export default function Summary(props) {
  const totalIncome = null;
  const totalExpenses = null;
  const surplus = null;

  return (
    <div>
      <Card title="Summary" error={error}>
        <p className="font-normal text-gray-700 dark:text-gray-400 flex gap-5 mt-5">
          <span className="w-40">{totalIncome > 0 && "Total Income:"}</span>
          <span className="w-17">{totalIncome > 0 && `£${totalIncome}`}</span>
        </p>
        <p className="font-normal text-gray-700 dark:text-gray-400 flex gap-5 mt-5">
          <span className="w-40">{totalExpenses > 0 && "Total Income:"}</span>
          <span className="w-17">{totalExpenses > 0 && `£${totalIncome}`}</span>
        </p>
        <p className="font-normal text-gray-700 dark:text-gray-400 flex gap-5 mt-5">
          <span className="w-40">{surplus > 0 && "Total Income:"}</span>
          <span className="w-17">{surplus > 0 && `£${totalIncome}`}</span>
        </p>
        );
      </Card>
    </div>
  );
}
