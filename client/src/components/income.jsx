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
        wage: props.data.wage || "",
        otherIncome: props.data.otherIncome || "",
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

  async function updateAmount(event) {
    const { name, value } = event.target;

    if (isNaN(value)) {
      setError("Please enter a number");
      return;
    }

    const roundedValue = Math.round(value * 100) / 100;

    setIncome((prevItems) => {
      const updatedAmount = {
        ...prevItems,
        [name]: value == "" ? "" : parseFloat(roundedValue),
      };
      setError(null);
      return updatedAmount;
    });
  }

  const total = income.wage + income.otherIncome;
  let totalRounded = Math.round(total * 100) / 100;
  totalRounded = totalRounded.toFixed(2);

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
        <Total total={totalRounded} />
      </Card>
    </div>
  );
}
