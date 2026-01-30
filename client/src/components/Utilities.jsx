import { useEffect, useState } from "react";
import { updateUtilities } from "../../api";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function Utilities(props) {
  const { data, onUpdate } = props;
  const [utilities, setUtilities] = useState({
    gas: "",
    electricity: "",
    water: "",
  });
  const [error, setError] = useState(null);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  useEffect(() => {
    if (data) {
      setUtilities({
        gas: parseFloat(data.gas).toFixed(2) || "",
        electricity: parseFloat(data.electricity).toFixed(2) || "",
        water: parseFloat(data.water).toFixed(2) || "",
      });
    }
  }, [data]);

  useEffect(() => {
    if (!pendingUpdate) return;

    const timer = setTimeout(async () => {
      console.log("Timer fired, calling API");
      try {
        await updateUtilities(pendingUpdate);
        setError(null);
        if (onUpdate) {
          onUpdate({
            gas: pendingUpdate.gas === "" ? "" : parseFloat(pendingUpdate.gas),
            electricity:
              pendingUpdate.electricity === ""
                ? ""
                : parseFloat(pendingUpdate.electricity),
            water:
              pendingUpdate.water === "" ? "" : parseFloat(pendingUpdate.water),
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
      ...utilities,
      [name]: value === "" ? "" : value,
    };

    setUtilities(newState);
    setPendingUpdate(newState);
    setError(null);
  }

  let total =
    parseFloat(utilities.gas) +
    parseFloat(utilities.electricity) +
    parseFloat(utilities.water);
  total = total.toFixed(2);

  return (
    <div>
      <Card title="Utilities" error={error}>
        <Input
          title="Gas"
          name="gas"
          onChange={updateAmount}
          value={utilities.gas}
        ></Input>
        <Input
          title="Electricity"
          name="electricity"
          onChange={updateAmount}
          value={utilities.electricity}
        ></Input>
        <Input
          title="Water"
          name="water"
          onChange={updateAmount}
          value={utilities.water}
        ></Input>
        <Total total={total} />
      </Card>
    </div>
  );
}
