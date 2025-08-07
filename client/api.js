import axios from "axios";

// const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const SERVER_URL = "http://localhost:3000";

export async function getIncome() {
  try {
    const response = await axios.get(`${SERVER_URL}/api/income`);
    return response.data;
  } catch (error) {
    console.log(`Error getting income: ${error}`);
    throw error;
  }
}

export async function updateIncome(income) {
  console.log(income);
  if (income.wage < 0 || income.otherIncome < 0) {
    throw new Error("Amount must be more than 0");
  } else {
    try {
      const response = await axios.post(`${SERVER_URL}/api/income`, {
        income,
      });
    } catch (error) {
      throw error;
    }
  }
}

// TODO:
// Check error handling correct pattern and improve upon across layers. Check aligns to DB restrictions
