import React, { useEffect, useState } from "react";
import { updateHomeExpense } from "../../api";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function HomeExpense(props) {
  const [homeExpense, setHomeExpense] = useState({
    mortgage: "",
    councilTax: "",
    homeInsurance: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (props.data) {
      setHomeExpense({
        mortgage: props.data.mortgage || "",
        councilTax: props.data.councilTax || "",
        homeInsurance: props.data.homeInsurance || "",
      });
    }
  }, [props.data]);

  useEffect(() => {
    const updateData = setTimeout(() => {
      async function sendHomeExpense(homeExpense) {
        try {
          await updateHomeExpense(homeExpense);
          setError(null);
        } catch (error) {
          setError(error);
        }
      }
      sendHomeExpense(homeExpense);
    }, 2000);
    return () => clearTimeout(updateData);
  }, [homeExpense]);

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

  const total =
    homeExpense.mortgage + homeExpense.councilTax + homeExpense.homeInsurance;
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
        <Input
          title="Home & Contents Insurance"
          name="homeInsurance"
          onChange={updateAmount}
          value={homeExpense.homeInsurance}
        ></Input>
        <Total total={totalRounded} />
      </Card>
    </div>
  );
}
