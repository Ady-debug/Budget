import React from "react";
import Card from "./Card";

export default function BudgetChart(props) {
  const { data } = props;

  return (
    <div className="col-span-1 sm:col-span-2 lg:col-span-3">
      <Card centered={true} title="Breakdown" error={null}>
        <p>{`Data goes here: ${data}`}</p>
      </Card>
    </div>
  );
}
