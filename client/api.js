import axios from "axios";

// const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const SERVER_URL = "http://localhost:3000";

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

export async function getIncome() {
  try {
    const response = await axios.get(`${SERVER_URL}/api/income`);
    return response.data;
  } catch (error) {
    console.log(`Error getting income: ${error}`);
    throw new Error("There was an error getting your stored income figures");
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

// TODO:
// Look into option to remove hardcoded server and replace with environment variable
