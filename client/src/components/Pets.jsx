import React, { useEffect, useState } from "react";
import { updatePets } from "../../api";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function Pets(props) {
  const { data, onUpdate } = props;
  const [pets, setPets] = useState({
    petFood: "",
    insurance: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) {
      setPets({
        petFood: parseFloat(data.petFood).toFixed(2) || "",
        insurance: parseFloat(data.insurance).toFixed(2) || "",
      });
    }
  }, [data]);

  useEffect(() => {
    const updateData = setTimeout(() => {
      async function sendPets(pets) {
        try {
          await updatePets(pets);
          setError(null);
          if (onUpdate) {
            //Updates data in app.jsx for use in other components
            onUpdate({
              petFood: pets.petFood === "" ? "" : parseFloat(pets.petFood),
              insurance:
                pets.insurance === "" ? "" : parseFloat(pets.insurance),
            });
          }
        } catch (error) {
          setError(error);
        }
      }
      sendPets(pets);
    }, 1000);
    return () => clearTimeout(updateData);
  }, [pets, onUpdate]);

  function updateAmount(event) {
    const { name, value } = event.target;

    const valueToNumber = parseFloat(value);
    if (value !== "" && isNaN(valueToNumber)) {
      setError("Please enter a number");
      return;
    }

    setPets((prevItems) => {
      const updatedAmount = {
        ...prevItems,
        [name]: value == "" ? "" : value,
      };
      setError(null);
      return updatedAmount;
    });
  }

  let total = parseFloat(pets.petFood) + parseFloat(pets.insurance);
  total = total.toFixed(2);

  return (
    <div>
      <Card title="Pets" error={error}>
        <Input
          title="Pet Food"
          name="petFood"
          onChange={updateAmount}
          value={pets.petFood}
        ></Input>
        <Input
          title="Insurance"
          name="insurance"
          onChange={updateAmount}
          value={pets.insurance}
        ></Input>
        <Total total={total} />
      </Card>
    </div>
  );
}
