import React, { useEffect, useState } from "react";
import { getIncome, updateIncome } from "../../api";

export default function Income() {
  let [income, setIncome] = useState({
    wage: "",
    otherIncome: "",
  });

  const [hidden, setHidden] = useState(true);

  const totalIncome = income.wage + income.otherIncome;

  function renderTotalIncome() {
    totalIncome > 0 ? setHidden(false) : setHidden(true);
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
    setIncome((prevItems) => {
      const updatedIncome = {
        ...prevItems,
        [name]: Number(value),
      };

      return updatedIncome;
    });
    renderTotalIncome();
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
      <p hidden={hidden}>Total: {totalIncome}</p>
    </form>
  );
}
