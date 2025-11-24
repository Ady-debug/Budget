import React, { useEffect, useState } from "react";
import { updateServicesAndSubscriptions } from "../../api";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function ServicesAndSubscriptions(props) {
  const [servicesAndSubscriptions, setServicesAndSubscriptions] = useState({
    phone: "",
    broadband: "",
    subscriptions: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (props.data) {
      setServicesAndSubscriptions({
        phone: parseFloat(props.data.phone).toFixed(2) || "",
        broadband: parseFloat(props.data.broadband).toFixed(2) || "",
        subscriptions: parseFloat(props.data.subscriptions).toFixed(2) || "",
      });
    }
  }, [props.data]);

  useEffect(() => {
    const updateData = setTimeout(() => {
      async function sendServicesAndSubscriptions(servicesAndSubscriptions) {
        try {
          await updateServicesAndSubscriptions(servicesAndSubscriptions);
          setError(null);
        } catch (error) {
          setError(error);
        }
      }
      sendServicesAndSubscriptions(servicesAndSubscriptions);
    }, 2000);
    return () => clearTimeout(updateData);
  }, [servicesAndSubscriptions]);

  function updateAmount(event) {
    const { name, value } = event.target;

    const valueToNumber = parseFloat(value);
    if (value !== "" && isNaN(valueToNumber)) {
      setError("Please enter a number");
      return;
    }

    setServicesAndSubscriptions((prevItems) => {
      const updatedAmount = {
        ...prevItems,
        [name]: value == "" ? "" : value,
      };
      setError(null);
      return updatedAmount;
    });
  }

  let total =
    parseFloat(servicesAndSubscriptions.phone) +
    parseFloat(servicesAndSubscriptions.broadband) +
    parseFloat(servicesAndSubscriptions.subscriptions);
  total = total.toFixed(2);

  return (
    <div>
      <Card title="Services and Subscriptions" error={error}>
        <Input
          title="Phone"
          name="phone"
          onChange={updateAmount}
          value={servicesAndSubscriptions.phone}
        ></Input>
        <Input
          title="Broadband"
          name="broadband"
          onChange={updateAmount}
          value={servicesAndSubscriptions.broadband}
        ></Input>
        <Input
          title="Subscriptions"
          name="subscriptions"
          onChange={updateAmount}
          value={servicesAndSubscriptions.subscriptions}
        ></Input>
        <Total total={total} />
      </Card>
    </div>
  );
}
