import React, { useEffect, useState } from "react";
import { getIncome, updateIncome } from "../../api";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function Income() {
  const [income, setIncome] = useState({
    wage: "",
    otherIncome: "",
  });
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const totalIncome = income.wage + income.otherIncome;
  let totalIncomeRounded = Math.round(totalIncome * 100) / 100;
  totalIncomeRounded = totalIncomeRounded.toFixed(2);

  useEffect(() => {
    async function getStoredData() {
      try {
        const data = await getIncome();
        const storedIncome = { wage: "", otherIncome: "" };
        data.income.forEach((item) => {
          storedIncome[item.income_type] = item.amount;
        });
        setIncome(storedIncome);
        setDataLoaded(true);
      } catch (error) {
        setError(error);
      }
    }
    getStoredData();
  }, []);

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
      dataLoaded === true && sendUpdatedIncome(income);
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
      const updatedIncome = {
        ...prevItems,
        [name]: value == "" ? "" : parseFloat(roundedValue),
      };
      setError(null);
      return updatedIncome;
    });
  }

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
        <Total total={totalIncomeRounded} />
      </Card>
    </div>
  );
}

//TODO: Improve styling of input areas
