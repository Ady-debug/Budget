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
  try {
    const response = await axios.post(`${SERVER_URL}/api/income`, {
      income,
    });
  } catch (error) {
    console.log(`Error updating income: ${error}`);
    throw error;
  }
}

// TODO:
// Consider improved error handling
