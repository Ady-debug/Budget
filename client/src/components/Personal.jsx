import React, { useEffect, useState } from "react";
import { updatePersonal } from "../../api";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function Personal(props) {
  const { data, onUpdate } = props;
  const [personal, setPersonal] = useState({
    clothingAndFootwear: "",
    hairdressing: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) {
      setPersonal({
        clothingAndFootwear:
          parseFloat(data.clothingAndFootwear).toFixed(2) || "",
        hairdressing: parseFloat(data.hairdressing).toFixed(2) || "",
      });
    }
  }, [data]);

  useEffect(() => {
    const updateData = setTimeout(() => {
      async function sendPersonal(personal) {
        try {
          await updatePersonal(personal);
          setError(null);
          if (onUpdate) {
            //Updates data in app.jsx for use in other components
            onUpdate({
              clothingAndFootwear:
                personal.clothingAndFootwear === ""
                  ? ""
                  : parseFloat(personal.clothingAndFootwear),
              hairdressing:
                personal.hairdressing === ""
                  ? ""
                  : parseFloat(personal.hairdressing),
            });
          }
        } catch (error) {
          setError(error);
        }
      }
      sendPersonal(personal);
    }, 1000);
    return () => clearTimeout(updateData);
  }, [personal, onUpdate]);

  function updateAmount(event) {
    const { name, value } = event.target;

    const valueToNumber = parseFloat(value);
    if (value !== "" && isNaN(valueToNumber)) {
      setError("Please enter a number");
      return;
    }

    setPersonal((prevItems) => {
      const updatedAmount = {
        ...prevItems,
        [name]: value == "" ? "" : value,
      };
      setError(null);
      return updatedAmount;
    });
  }

  let total =
    parseFloat(personal.clothingAndFootwear) +
    parseFloat(personal.hairdressing);
  total = total.toFixed(2);

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
        <Total total={total} />
      </Card>
    </div>
  );
}
