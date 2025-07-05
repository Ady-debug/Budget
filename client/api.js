import "dotenv/config";
import axios from "axios";

const serverURL = process.env.SERVER_URL;

async function getIncome() {
  const response = await axios.get(`${serverURL}/api/income`);
  console.log(response.data);
}
