import axios from "axios";
import { supabase } from "./src/supabaseClient";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    Authorization: `Bearer ${session?.access_token}`,
  };
}

export function validateField(value, fieldName) {
  const numValue = parseFloat(value);

  if (isNaN(numValue)) {
    throw new Error(`Enter a number for your ${fieldName}`);
  }
  if (numValue < 0) {
    throw new Error(`${fieldName} amount must be more or equal to 0`);
  }
  if (numValue > 99999999.99) {
    throw new Error("Please enter an accurate amount, the figure is too high");
  }
}

export async function getBudgetData() {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${SERVER_URL}/api/budget`, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error getting budget information: ${error}`);
    throw new Error("There was an error getting your stored budget figures");
  }
}

export async function updateIncome(income) {
  if (!income || typeof income !== "object") {
    throw new Error("Please enter your income");
  }

  validateField(income.wage, "Wage");
  validateField(income.otherIncome, "Other Income");

  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(
      `${SERVER_URL}/api/income`,
      { income },
      { headers },
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating income: ${error.message}`);
    throw new Error("There was an error saving your income");
  }
}

export async function updateHomeExpense(homeExpense) {
  if (!homeExpense || typeof homeExpense !== "object") {
    throw new Error("Please enter your home expenses");
  }

  validateField(homeExpense.mortgage, "Mortgage");
  validateField(homeExpense.councilTax, "Council Tax");
  validateField(homeExpense.homeInsurance, "Home Insurance");

  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(
      `${SERVER_URL}/api/home_expense`,
      { homeExpense },
      { headers },
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating home expenses: ${error.message}`);
    throw new Error("There was an error saving your home expenses");
  }
}

export async function updateUtilities(utilities) {
  if (!utilities || typeof utilities !== "object") {
    throw new Error("Please enter your utility expenses");
  }

  validateField(utilities.gas, "Gas");
  validateField(utilities.electricity, "Electricity");
  validateField(utilities.water, "Water");

  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(
      `${SERVER_URL}/api/utilities`,
      { utilities },
      { headers },
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating utilities: ${error.message}`);
    throw new Error("There was an error saving your utilities");
  }
}

export async function updateServicesAndSubscriptions(servicesAndSubscriptions) {
  if (
    !servicesAndSubscriptions ||
    typeof servicesAndSubscriptions !== "object"
  ) {
    throw new Error("Please enter your service and subscription expenses");
  }

  validateField(servicesAndSubscriptions.phone, "Phone");
  validateField(servicesAndSubscriptions.broadband, "Broadband");
  validateField(servicesAndSubscriptions.subscriptions, "Subscriptions");

  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(
      `${SERVER_URL}/api/servicesandsubscriptions`,
      { servicesAndSubscriptions },
      { headers },
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating services and subscriptions: ${error.message}`,
    );
    throw new Error(
      "There was an error saving your services and subscriptions",
    );
  }
}

export async function updateTransportAndTravel(transportAndTravel) {
  if (!transportAndTravel || typeof transportAndTravel !== "object") {
    throw new Error("Please enter your transport and travel costs");
  }

  validateField(transportAndTravel.vehicleInsurance, "Vehicle Insurance");
  validateField(transportAndTravel.roadTax, "Road Tax");
  validateField(transportAndTravel.fuel, "Fuel");
  validateField(transportAndTravel.breakdownCover, "Breakdown Cover");
  validateField(transportAndTravel.MOTAndServices, "MOT and Services");
  validateField(transportAndTravel.railAndBus, "Rail and Bus");

  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(
      `${SERVER_URL}/api/transportandtravel`,
      { transportAndTravel },
      { headers },
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating transport and travel: ${error.message}`);
    throw new Error(
      "There was an error saving your transport and travel costs",
    );
  }
}

export async function updatePersonal(personal) {
  if (!personal || typeof personal !== "object") {
    throw new Error("Please enter your personal costs");
  }

  validateField(personal.clothingAndFootwear, "Clothing and Footwear");
  validateField(personal.hairdressing, "Hairdressing");

  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(
      `${SERVER_URL}/api/personal`,
      { personal },
      { headers },
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating personal: ${error.message}`);
    throw new Error("There was an error saving your personal costs");
  }
}

export async function updatePets(pets) {
  if (!pets || typeof pets !== "object") {
    throw new Error("Please enter your pet costs");
  }

  validateField(pets.petFood, "Pet Food");
  validateField(pets.insurance, "Insurance");

  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(
      `${SERVER_URL}/api/pets`,
      { pets },
      { headers },
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating pets: ${error.message}`);
    throw new Error("There was an error saving your pet costs");
  }
}

export async function updateFoodAndShopping(foodAndShopping) {
  if (!foodAndShopping || typeof foodAndShopping !== "object") {
    throw new Error("Please enter your food and shopping costs");
  }

  validateField(foodAndShopping.supermarketShopping, "Supermarket Shopping");
  validateField(foodAndShopping.mealsOut, "Meals Out");

  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(
      `${SERVER_URL}/api/foodandshopping`,
      { foodAndShopping },
      { headers },
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating foodAndShopping: ${error.message}`);
    throw new Error("There was an error saving your food and shopping costs");
  }
}

export async function updateAccountsAndSavings(accountsAndSavings) {
  if (!accountsAndSavings || typeof accountsAndSavings !== "object") {
    throw new Error("Please enter your accounts and savings costs");
  }

  validateField(accountsAndSavings.accountFees, "Account Fees");
  validateField(accountsAndSavings.savings, "Savings");

  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(
      `${SERVER_URL}/api/accountsandsavings`,
      { accountsAndSavings },
      { headers },
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating accountsAndSavings: ${error.message}`);
    throw new Error(
      "There was an error saving your accounts and savings costs",
    );
  }
}
