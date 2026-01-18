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
    const updateData = setTimeout(() => {
      async function sendUpdatedUtilities(utilities) {
        try {
          await updateUtilities(utilities);
          setError(null);
          if (onUpdate) {
            //Updates data in app.jsx for use in other components
            onUpdate({
              gas: utilities.gas === "" ? "" : parseFloat(utilities.gas),
              electricity:
                utilities.electricity === ""
                  ? ""
                  : parseFloat(utilities.electricity),
              water: utilities.water === "" ? "" : parseFloat(utilities.water),
            });
          }
        } catch (error) {
          setError(error);
        }
      }
      sendUpdatedUtilities(utilities);
    }, 1000);
    return () => clearTimeout(updateData);
  }, [utilities, onUpdate]);

  function updateAmount(event) {
    const { name, value } = event.target;

    const valueToNumber = parseFloat(value);
    if (value !== "" && isNaN(valueToNumber)) {
      setError("Please enter a number");
      return;
    }

    setUtilities((prevItems) => {
      const updatedAmount = {
        ...prevItems,
        [name]: value == "" ? "" : value,
      };
      setError(null);
      return updatedAmount;
    });
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
