import React, { useEffect, useState } from "react";
import { updatePets } from "../../api";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function Pets(props) {
  const [pets, setPets] = useState({
    petFood: "",
    insurance: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (props.data) {
      setPets({
        petFood: props.data.petFood || "",
        insurance: props.data.insurance || "",
      });
    }
  }, [props.data]);

  useEffect(() => {
    const updateData = setTimeout(() => {
      async function sendPets(pets) {
        try {
          await updatePets(pets);
          setError(null);
        } catch (error) {
          setError(error);
        }
      }
      sendPets(pets);
    }, 2000);
    return () => clearTimeout(updateData);
  }, [pets]);

  function updateAmount(event) {
    const { name, value } = event.target;

    if (isNaN(value)) {
      setError("Please enter a number");
      return;
    }

    const roundedValue = Math.round(value * 100) / 100;

    setPets((prevItems) => {
      const updatedAmount = {
        ...prevItems,
        [name]: value == "" ? "" : parseFloat(roundedValue),
      };
      setError(null);
      return updatedAmount;
    });
  }

  const total = pets.petFood + pets.insurance;
  let totalRounded = Math.round(total * 100) / 100;
  totalRounded = totalRounded.toFixed(2);

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
        <Total total={totalRounded} />
      </Card>
    </div>
  );
}
