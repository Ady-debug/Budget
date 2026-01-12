import React, { useEffect, useState } from "react";
import { updateFoodAndShopping } from "../../api";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function FoodAndShopping(props) {
  const { data, onUpdate } = props;
  const [foodAndShopping, setFoodAndShopping] = useState({
    supermarketShopping: "",
    mealsOut: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) {
      setFoodAndShopping({
        supermarketShopping:
          parseFloat(data.supermarketShopping).toFixed(2) || "",
        mealsOut: parseFloat(data.mealsOut).toFixed(2) || "",
      });
    }
  }, [data]);

  useEffect(() => {
    const updateData = setTimeout(() => {
      async function sendFoodAndShopping(foodAndShopping) {
        try {
          await updateFoodAndShopping(foodAndShopping);
          setError(null);
          if (onUpdate) {
            //Updates data in app.jsx for use in other components
            onUpdate({
              supermarketShopping:
                foodAndShopping.supermarketShopping === ""
                  ? ""
                  : parseFloat(foodAndShopping.supermarketShopping),
              mealsOut:
                foodAndShopping.mealsOut === ""
                  ? ""
                  : parseFloat(foodAndShopping.mealsOut),
            });
          }
        } catch (error) {
          setError(error);
        }
      }
      sendFoodAndShopping(foodAndShopping);
    }, 1000);
    return () => clearTimeout(updateData);
  }, [foodAndShopping, onUpdate]);

  function updateAmount(event) {
    const { name, value } = event.target;

    const valueToNumber = parseFloat(value);
    if (value !== "" && isNaN(valueToNumber)) {
      setError("Please enter a number");
      return;
    }

    setFoodAndShopping((prevItems) => {
      const updatedAmount = {
        ...prevItems,
        [name]: value == "" ? "" : value,
      };
      setError(null);
      return updatedAmount;
    });
  }

  let total =
    parseFloat(foodAndShopping.supermarketShopping) +
    parseFloat(foodAndShopping.mealsOut);
  total = total.toFixed(2);

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
        <Total total={total} />
      </Card>
    </div>
  );
}
