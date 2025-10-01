import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function validateField(value, fieldName) {
  if (value < 0) {
    throw new Error(`${fieldName} amount must be more or equal to 0`);
  }
  if (value == null || isNaN(value)) {
    throw new Error(`Please enter a number for your ${fieldName}`);
  }
  if (value > 99999999.99) {
    throw new Error("Please enter an accurate income, the figure is too high");
  }
}

export async function getBudgetData() {
  try {
    const response = await axios.get(`${SERVER_URL}/api/budget`);
    return response.data;
  } catch (error) {
    console.log(`Error getting budget information: ${error}`);
    throw new Error("There was an error getting your stored budget figures");
  }
}

export async function updateIncome(income) {
  if (!income || typeof income !== "object") {
    throw new Error("Please enter your income");
  }

  validateField(income.wage, "Wage");
  validateField(income.otherIncome, "Other income");

  try {
    const response = await axios.post(`${SERVER_URL}/api/income`, {
      income,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating income: ${error.message}`);
    throw new Error("There was an error saving your income");
  }
}
