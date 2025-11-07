import React, { useEffect, useState } from "react";
import { updatePersonal } from "../../api";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function Personal(props) {
  const [personal, setPersonal] = useState({
    clothingAndFootwear: "",
    hairdressing: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (props.data) {
      setPersonal({
        clothingAndFootwear: props.data.clothingAndFootwear || "",
        hairdressing: props.data.hairdressing || "",
      });
    }
  }, [props.data]);

  useEffect(() => {
    const updateData = setTimeout(() => {
      async function sendPersonal(personal) {
        try {
          await updatePersonal(personal);
          setError(null);
        } catch (error) {
          setError(error);
        }
      }
      sendPersonal(personal);
    }, 2000);
    return () => clearTimeout(updateData);
  }, [personal]);

  function updateAmount(event) {
    const { name, value } = event.target;

    if (isNaN(value)) {
      setError("Please enter a number");
      return;
    }

    const roundedValue = Math.round(value * 100) / 100;

    setPersonal((prevItems) => {
      const updatedAmount = {
        ...prevItems,
        [name]: value == "" ? "" : parseFloat(roundedValue),
      };
      setError(null);
      return updatedAmount;
    });
  }

  const total = personal.clothingAndFootwear + personal.hairdressing;
  let totalRounded = Math.round(total * 100) / 100;
  totalRounded = totalRounded.toFixed(2);

  return (
    <div>
      <Card title="Personal" error={error}>
        <Input
          title="Clothing and Footwear"
          name="clothingAndFootwear"
          onChange={updateAmount}
          value={personal.clothingAndFootwear}
        ></Input>
        <Input
          title="Hairdressing"
          name="hairdressing"
          onChange={updateAmount}
          value={personal.hairdressing}
        ></Input>
        <Total total={totalRounded} />
      </Card>
    </div>
  );
}
