import { useEffect, useState, useRef } from "react";
import { updateHomeExpense } from "../../api";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function HomeExpense(props) {
  const { data, onUpdate } = props;
  const [homeExpense, setHomeExpense] = useState({
    mortgage: "",
    councilTax: "",
    homeInsurance: "",
  });
  const [error, setError] = useState(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (data) {
      setHomeExpense({
        mortgage: parseFloat(data.mortgage).toFixed(2) || "",
        councilTax: parseFloat(data.councilTax).toFixed(2) || "",
        homeInsurance: parseFloat(data.homeInsurance).toFixed(2) || "",
      });
      isInitialLoad.current = false;
    }
  }, [data]);

  useEffect(() => {
    if (isInitialLoad.current) {
      return;
    }
    const updateData = setTimeout(() => {
      async function sendHomeExpense(homeExpense) {
        try {
          await updateHomeExpense(homeExpense);
          setError(null);
          if (onUpdate) {
            //Updates data in app.jsx for use in other components
            onUpdate({
              mortgage:
                homeExpense.mortgage === ""
                  ? ""
                  : parseFloat(homeExpense.mortgage),
              councilTax:
                homeExpense.councilTax === ""
                  ? ""
                  : parseFloat(homeExpense.councilTax),
              homeInsurance:
                homeExpense.homeInsurance === ""
                  ? ""
                  : parseFloat(homeExpense.homeInsurance),
            });
          }
        } catch (error) {
          setError(error);
        }
      }
      sendHomeExpense(homeExpense);
    }, 1000);
    return () => clearTimeout(updateData);
  }, [homeExpense, onUpdate]);

  function updateAmount(event) {
    const { name, value } = event.target;

    const valueToNumber = parseFloat(value);
    if (value !== "" && isNaN(valueToNumber)) {
      setError("Please enter a number");
      return;
    }

    setHomeExpense((prevItems) => {
      const updatedAmount = {
        ...prevItems,
        [name]: value == "" ? "" : value,
      };
      setError(null);
      return updatedAmount;
    });
  }

  let total =
    parseFloat(homeExpense.mortgage) +
    parseFloat(homeExpense.councilTax) +
    parseFloat(homeExpense.homeInsurance);
  total = total.toFixed(2);

  return (
    <div>
      <Card title="Home Expenses" error={error}>
        <Input
          title="Mortgage"
          name="mortgage"
          onChange={updateAmount}
          value={homeExpense.mortgage}
        ></Input>
        <Input
          title="Council Tax"
          name="councilTax"
          onChange={updateAmount}
          value={homeExpense.councilTax}
        ></Input>
        <Input
          title="Home & Contents Insurance"
          name="homeInsurance"
          onChange={updateAmount}
          value={homeExpense.homeInsurance}
        ></Input>
        <Total total={total} />
      </Card>
    </div>
  );
}
