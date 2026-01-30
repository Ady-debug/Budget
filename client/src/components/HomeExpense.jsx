import { useEffect, useState } from "react";
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
  const [pendingUpdate, setPendingUpdate] = useState(null);

  useEffect(() => {
    if (data) {
      setHomeExpense({
        mortgage: parseFloat(data.mortgage).toFixed(2) || "",
        councilTax: parseFloat(data.councilTax).toFixed(2) || "",
        homeInsurance: parseFloat(data.homeInsurance).toFixed(2) || "",
      });
    }
  }, [data]);

  useEffect(() => {
    if (!pendingUpdate) return;

    const timer = setTimeout(async () => {
      try {
        await updateHomeExpense(pendingUpdate);
        setError(null);
        if (onUpdate) {
          onUpdate({
            mortgage:
              pendingUpdate.mortgage === ""
                ? ""
                : parseFloat(pendingUpdate.mortgage),
            councilTax:
              pendingUpdate.councilTax === ""
                ? ""
                : parseFloat(pendingUpdate.councilTax),
            homeInsurance:
              pendingUpdate.homeInsurance === ""
                ? ""
                : parseFloat(pendingUpdate.homeInsurance),
          });
        }
        setPendingUpdate(null);
      } catch (error) {
        setError(error);
      }
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingUpdate]);

  function updateAmount(event) {
    const { name, value } = event.target;

    const valueToNumber = parseFloat(value);
    if (value !== "" && isNaN(valueToNumber)) {
      setError("Please enter a number");
      return;
    }

    const newState = {
      ...homeExpense,
      [name]: value === "" ? "" : value,
    };

    setHomeExpense(newState);
    setPendingUpdate(newState);
    setError(null);
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
