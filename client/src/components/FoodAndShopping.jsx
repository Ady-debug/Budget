import React, { useEffect, useState } from "react";
import { updateFoodAndShopping } from "../../api";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function FoodAndShopping(props) {
  const [foodAndShopping, setFoodAndShopping] = useState({
    supermarketShopping: "",
    mealsOut: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (props.data) {
      setFoodAndShopping({
        supermarketShopping: props.data.supermarketShopping || "",
        mealsOut: props.data.mealsOut || "",
      });
    }
  }, [props.data]);

  useEffect(() => {
    const updateData = setTimeout(() => {
      async function sendFoodAndShopping(foodAndShopping) {
        try {
          await updateFoodAndShopping(foodAndShopping);
          setError(null);
        } catch (error) {
          setError(error);
        }
      }
      sendFoodAndShopping(foodAndShopping);
    }, 2000);
    return () => clearTimeout(updateData);
  }, [foodAndShopping]);

  function updateAmount(event) {
    const { name, value } = event.target;

    if (isNaN(value)) {
      setError("Please enter a number");
      return;
    }

    const roundedValue = Math.round(value * 100) / 100;

    setFoodAndShopping((prevItems) => {
      const updatedAmount = {
        ...prevItems,
        [name]: value == "" ? "" : parseFloat(roundedValue),
      };
      setError(null);
      return updatedAmount;
    });
  }

  const total = foodAndShopping.supermarketShopping + foodAndShopping.mealsOut;
  let totalRounded = Math.round(total * 100) / 100;
  totalRounded = totalRounded.toFixed(2);

  return (
    <div>
      <Card title="Food and Shopping" error={error}>
        <Input
          title="Supermarket Shopping"
          name="supermarketShopping"
          onChange={updateAmount}
          value={foodAndShopping.supermarketShopping}
        ></Input>
        <Input
          title="Meals Out"
          name="mealsOut"
          onChange={updateAmount}
          value={foodAndShopping.mealsOut}
        ></Input>
        <Total total={totalRounded} />
      </Card>
    </div>
  );
}
