import React, { useEffect, useState } from "react";
import { updateUtilities } from "../../api";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function Utilities(props) {
  const [utilities, setUtilities] = useState({
    gas: "",
    electricity: "",
    water: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (props.data) {
      setUtilities({
        gas: props.data.gas || "",
        electricity: props.data.electricity || "",
        water: props.data.water || "",
      });
    }
  }, [props.data]);

  useEffect(() => {
    const updateData = setTimeout(() => {
      async function sendUpdatedUtilities(utilities) {
        try {
          await updateUtilities(utilities);
          setError(null);
        } catch (error) {
          setError(error);
        }
      }
      sendUpdatedUtilities(utilities);
    }, 2000);
    return () => clearTimeout(updateData);
  }, [utilities]);

  function updateAmount(event) {
    const { name, value } = event.target;

    if (isNaN(value)) {
      setError("Please enter a number");
      return;
    }

    const roundedValue = Math.round(value * 100) / 100;

    setUtilities((prevItems) => {
      const updatedAmount = {
        ...prevItems,
        [name]: value == "" ? "" : parseFloat(roundedValue),
      };
      setError(null);
      return updatedAmount;
    });
  }

  const total = utilities.gas + utilities.electricity + utilities.water;
  let totalRounded = Math.round(total * 100) / 100;
  totalRounded = totalRounded.toFixed(2);

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
        <Total total={totalRounded} />
      </Card>
    </div>
  );
}
