import React, { useEffect, useState } from "react";
import { getIncome, updateIncome } from "../../api";

export default function Income() {
  let [income, setIncome] = useState({
    wage: "",
    otherIncome: "",
  });

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
        await updateIncome(income);
      }
      sendUpdatedIncome(income);
    }, 2000);

    return () => clearTimeout(updateData);
  }, [income]);

  const totalIncome = income.wage + income.otherIncome;

  async function updateAmount(event) {
    const { name, value } = event.target;

    setIncome((prevItems) => {
      const updatedIncome = {
        ...prevItems,
        [name]: Number(value),
      };

      return updatedIncome;
    });
  }

  return (
    <form>
      <h2>Income</h2>
      <label>
        Wage:
        <input
          name="wage"
          placeholder="£ per month"
          onChange={updateAmount}
          value={income.wage}
        />
      </label>
      <label>
        Other Income:
        <input
          name="otherIncome"
          placeholder="£ per month"
          onChange={updateAmount}
          value={income.otherIncome}
        />
      </label>
      <p>Total: {totalIncome}</p>
    </form>
  );
}
