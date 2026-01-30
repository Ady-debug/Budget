import { useEffect, useState } from "react";
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
  const [pendingUpdate, setPendingUpdate] = useState(null);

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
    if (!pendingUpdate) return;

    const timer = setTimeout(async () => {
      try {
        await updateFoodAndShopping(pendingUpdate);
        setError(null);
        if (onUpdate) {
          onUpdate({
            supermarketShopping:
              pendingUpdate.supermarketShopping === ""
                ? ""
                : parseFloat(pendingUpdate.supermarketShopping),
            mealsOut:
              pendingUpdate.mealsOut === ""
                ? ""
                : parseFloat(pendingUpdate.mealsOut),
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
      ...foodAndShopping,
      [name]: value === "" ? "" : value,
    };

    setFoodAndShopping(newState);
    setPendingUpdate(newState);
    setError(null);
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
