import React, { useEffect, useState } from "react";
import { getIncome, updateIncome } from "../../api";

export default function Income() {
  const [income, setIncome] = useState({
    wage: "",
    otherIncome: "",
  });

  const [hidden, setHidden] = useState(true);

  const totalIncome = income.wage + income.otherIncome;
  const totalIncomeRounded = Math.round(totalIncome * 100) / 100;

  function renderTotalIncome() {
    totalIncomeRounded > 0 ? setHidden(false) : setHidden(true);
  }

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
    renderTotalIncome();
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
      <p hidden={hidden}>Total: £{totalIncomeRounded}</p>
    </form>
  );
}
