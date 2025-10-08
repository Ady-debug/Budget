import React, { useEffect, useState } from "react";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function HomeExpense(props) {
  const [homeExpense, setHomeExpense] = useState({
    mortgage: "",
    councilTax: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (props.data) {
      setHomeExpense({
        mortgage: props.data.mortgage || "",
        councilTax: props.data.councilTax || "",
      });
    }
  }, [props.data]);

  // TODO: Add API and POST route to update home expenses

  // TODO: Add useEffect to update data on timeout (see Income component for more details)

  function updateAmount(event) {
    const { name, value } = event.target;

    if (isNaN(value)) {
      setError("Please enter a number");
      return;
    }

    const roundedValue = Math.round(value * 100) / 100;

    setHomeExpense((prevItems) => {
      const updatedAmount = {
        ...prevItems,
        [name]: value == "" ? "" : parseFloat(roundedValue),
      };
      setError(null);
      return updatedAmount;
    });
  }

  const total = homeExpense.mortgage + homeExpense.councilTax;
  let totalRounded = Math.round(total * 100) / 100;
  totalRounded = totalRounded.toFixed(2);

  return (
    <div>
      <Card title="Home Expenses" error={error}>
        <Input
          title="Mortgage"
          name="mortgage"
          onChange={updateAmount}
          value={homeExpense.mortgage}
        ></Input>
        <Input
          title="Council Tax"
          name="councilTax"
          onChange={updateAmount}
          value={homeExpense.councilTax}
        ></Input>
        <Total total={totalRounded} />
      </Card>
    </div>
  );
}

// TODO: Setup DB schema
// TODO: Setup API routes
// TODO: Setup data loaded state and setup data/send data useEffect functions
