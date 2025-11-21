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
        mortgage: parseFloat(props.data.mortgage).toFixed(2) || "",
        councilTax: parseFloat(props.data.councilTax).toFixed(2) || "",
        homeInsurance: parseFloat(props.data.homeInsurance).toFixed(2) || "",
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

    const valueToNumber = parseFloat(value);

    if (isNaN(valueToNumber)) {
      setError("Please enter a number");
      return;
    }

    setHomeExpense((prevItems) => {
      const updatedAmount = {
        ...prevItems,
        [name]: value == "" ? "" : value,
      };
      setError(null);
      return updatedAmount;
    });
  }

  let total =
    parseFloat(homeExpense.mortgage) +
    parseFloat(homeExpense.councilTax) +
    parseFloat(homeExpense.homeInsurance);
  total = total.toFixed(2);

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
        <Total total={total} />
      </Card>
    </div>
  );
}
