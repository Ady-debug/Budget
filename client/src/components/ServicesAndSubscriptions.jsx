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
        phone: props.data.phone || "",
        broadband: props.data.broadband || "",
        subscriptions: props.data.subscriptions || "",
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

    if (isNaN(value)) {
      setError("Please enter a number");
      return;
    }

    const roundedValue = Math.round(value * 100) / 100;

    setServicesAndSubscriptions((prevItems) => {
      const updatedAmount = {
        ...prevItems,
        [name]: value == "" ? "" : parseFloat(roundedValue),
      };
      setError(null);
      return updatedAmount;
    });
  }

  const total =
    servicesAndSubscriptions.phone +
    servicesAndSubscriptions.broadband +
    servicesAndSubscriptions.subscriptions;
  let totalRounded = Math.round(total * 100) / 100;
  totalRounded = totalRounded.toFixed(2);

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
        <Total total={totalRounded} />
      </Card>
    </div>
  );
}
