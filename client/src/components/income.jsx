import React, { useEffect, useState } from "react";
import { getIncome, updateIncome } from "../../api";

export default function Income() {
  const [income, setIncome] = useState({
    wage: "",
    otherIncome: "",
  });
  const [error, setError] = useState(null);

  const totalIncome = income.wage + income.otherIncome;
  const totalIncomeRounded = Math.round(totalIncome * 100) / 100;

  useEffect(() => {
    async function getStoredData() {
      const data = await getIncome();
      const storedIncome = { wage: "", otherIncome: "" };
      data.income.forEach((item) => {
        storedIncome[item.income_type] = item.amount;
      });
      setIncome(storedIncome);
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
      sendUpdatedIncome(income);
    }, 2000);
    return () => clearTimeout(updateData);
  }, [income]);

  async function updateAmount(event) {
    const { name, value } = event.target;
    const roundedValue = Math.round(value * 100) / 100;

    setIncome((prevItems) => {
      const updatedIncome = {
        ...prevItems,
        [name]: value == "" ? "" : parseFloat(roundedValue),
      };
      return updatedIncome;
    });
  }

  return (
    <form>
      <h2>Income</h2>
      {error && <p style={{ color: "red" }}>{error.message}</p>}
      <label>
        Wage:
        <input
          name="wage"
          type="number"
          inputMode="decimal"
          placeholder="£ per month"
          onChange={updateAmount}
          value={income.wage}
        />
      </label>
      <label>
        Other Income:
        <input
          name="otherIncome"
          type="number"
          inputMode="decimal"
          placeholder="£ per month"
          onChange={updateAmount}
          value={income.otherIncome}
        />
      </label>
      <p>{totalIncomeRounded > 0 && `Total: £${totalIncomeRounded}`}</p>
    </form>
  );
}

// TODO: - refactor to remove duplicate in useEffect?
