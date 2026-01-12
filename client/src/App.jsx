import React, { useState, useEffect } from "react";
import { getBudgetData } from "../api";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Income from "./components/Income";
import HomeExpense from "./components/HomeExpense";
import Utilities from "./components/Utilities";
import ServicesAndSubscriptions from "./components/ServicesAndSubscriptions";
import TransportAndTravel from "./components/TransportAndTravel";
import Personal from "./components/Personal";
import Pets from "./components/Pets";
import FoodAndShopping from "./components/FoodAndShopping";
import AccountsAndSavings from "./components/AccountsAndSavings";
import Summary from "./components/Summary";

function App() {
  const [budgetData, setBudgetData] = useState({
    income: { wage: "", otherIncome: "" },
    homeExpense: { mortgage: "", councilTax: "", homeInsurance: "" },
    utilities: { gas: "", electricity: "", water: "" },
    servicesAndSubscriptions: { phone: "", broadband: "", subscriptions: "" },
    transportAndTravel: {
      vehicleInsurance: "",
      roadTax: "",
      fuel: "",
      breakdownCover: "",
      MOTAndServices: "",
      railAndBus: "",
    },
    personal: { clothingAndFootwear: "", hairdressing: "" },
    pets: { petFood: "", insurance: "" },
    foodAndShopping: { supermarketShopping: "", mealsOut: "" },
    accountsAndSavings: { accountFees: "", savings: "" },
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getDataFromAPI() {
      function transformDataFromAPI(data) {
        const budget = data.budget;
        const transformedData = {};

        budget.forEach((entry) => {
          if (!transformedData[entry.category]) {
            transformedData[entry.category] = {};
          }
          transformedData[entry.category][entry.item] = entry.amount;
        });

        return transformedData;
      }

      try {
        const data = await getBudgetData();
        const transformedData = transformDataFromAPI(data);
        setBudgetData(transformedData);
      } catch (error) {
        setError(error);
      }
    }

    getDataFromAPI();
    setError(null);
  }, []);

  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-50 via-violet-200 to-teal-100 dark:from-slate-700 dark:via-indigo-900 dark:to-violet-900 min-h-screen">
      <Header />
      {error && (
        <p className="font-bold text-red-400 flex justify-center">{error}</p>
      )}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        <Income
          data={budgetData.income}
          onUpdate={(incomeObj) =>
            setBudgetData((prev) => ({ ...prev, income: incomeObj }))
          }
        />
        <HomeExpense
          data={budgetData.homeExpense}
          onUpdate={(homeExpenseObj) =>
            setBudgetData((prev) => ({ ...prev, homeExpense: homeExpenseObj }))
          }
        />
        <Utilities
          data={budgetData.utilities}
          onUpdate={(utilitiesObj) =>
            setBudgetData((prev) => ({ ...prev, utilities: utilitiesObj }))
          }
        />
        <ServicesAndSubscriptions
          data={budgetData.servicesAndSubscriptions}
          onUpdate={(servicesAndSubscriptionsObj) =>
            setBudgetData((prev) => ({
              ...prev,
              servicesAndSubscriptions: servicesAndSubscriptionsObj,
            }))
          }
        />
        <TransportAndTravel data={budgetData.transportAndTravel} />
        <Personal data={budgetData.personal} />
        <Pets data={budgetData.pets} />
        <FoodAndShopping data={budgetData.foodAndShopping} />
        <AccountsAndSavings data={budgetData.accountsAndSavings} />
        <Summary data={budgetData} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
