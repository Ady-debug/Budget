import axios from "axios";

// const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const SERVER_URL = "http://localhost:3000";

export async function getIncome() {
  try {
    const response = await axios.get(`${SERVER_URL}/api/income`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
