import React, { useEffect, useState } from "react";
import { updateIncome } from "../../api";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function Income(props) {
  const [income, setIncome] = useState({
    wage: "",
    otherIncome: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (props.data) {
      setIncome({
        wage: parseFloat(props.data.wage).toFixed(2),
        otherIncome: parseFloat(props.data.otherIncome).toFixed(2),
      });
    }
  }, [props.data]);

  useEffect(() => {
    const updateData = setTimeout(() => {
      async function sendUpdatedIncome(income) {
        try {
          await updateIncome(income);
          setError(null);
        } catch (error) {
          setError(error);
        }
      }
      sendUpdatedIncome(income);
    }, 2000);
    return () => clearTimeout(updateData);
  }, [income]);

  function updateAmount(event) {
    const { name, value } = event.target;

    const valueToNumber = parseFloat(value);
    if (value !== "" && isNaN(valueToNumber)) {
      setError("Please enter a number");
      return;
    }

    setIncome((prevItems) => {
      const updatedAmount = {
        ...prevItems,
        [name]: value == "" ? "" : value,
      };
      setError(null);
      return updatedAmount;
    });
  }

  let total = parseFloat(income.wage) + parseFloat(income.otherIncome);
  total = total.toFixed(2);

  return (
    <div>
      <Card title="Income" error={error}>
        <Input
          title="Wage"
          name="wage"
          onChange={updateAmount}
          value={income.wage}
        ></Input>
        <Input
          title="Other Income"
          name="otherIncome"
          onChange={updateAmount}
          value={income.otherIncome}
        ></Input>
        <Total total={total} />
      </Card>
    </div>
  );
}
