import { useEffect, useState } from "react";
import { updateIncome } from "../../api";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function Income(props) {
  const { data, onUpdate } = props;
  const [income, setIncome] = useState({
    wage: "",
    otherIncome: "",
  });
  const [error, setError] = useState(null);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  useEffect(() => {
    if (data) {
      setIncome({
        wage: parseFloat(data.wage).toFixed(2),
        otherIncome: parseFloat(data.otherIncome).toFixed(2),
      });
    }
  }, [data]);

  useEffect(() => {
    if (!pendingUpdate) return;

    const timer = setTimeout(async () => {
      try {
        await updateIncome(pendingUpdate);
        setError(null);
        if (onUpdate) {
          onUpdate({
            wage:
              pendingUpdate.wage === "" ? "" : parseFloat(pendingUpdate.wage),
            otherIncome:
              pendingUpdate.otherIncome === ""
                ? ""
                : parseFloat(pendingUpdate.otherIncome),
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
      ...income,
      [name]: value === "" ? "" : value,
    };

    setIncome(newState);
    setPendingUpdate(newState);
    setError(null);
  }

  let total = parseFloat(income.wage) + parseFloat(income.otherIncome);
  total = total.toFixed(2);

  return (
    <div>
      <Card title="Income" error={error}>
        <Input
          title="Wage"
          name="wage"
          onChange={updateAmount}
          value={income.wage}
        ></Input>
        <Input
          title="Other Income"
          name="otherIncome"
          onChange={updateAmount}
          value={income.otherIncome}
        ></Input>
        <Total total={total} />
      </Card>
    </div>
  );
}
