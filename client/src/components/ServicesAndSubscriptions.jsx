import { useEffect, useState } from "react";
import { updateServicesAndSubscriptions } from "../../api";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function ServicesAndSubscriptions(props) {
  const { data, onUpdate } = props;
  const [servicesAndSubscriptions, setServicesAndSubscriptions] = useState({
    phone: "",
    broadband: "",
    subscriptions: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) {
      setServicesAndSubscriptions({
        phone: parseFloat(data.phone).toFixed(2) || "",
        broadband: parseFloat(data.broadband).toFixed(2) || "",
        subscriptions: parseFloat(data.subscriptions).toFixed(2) || "",
      });
    }
  }, [data]);

  useEffect(() => {
    const updateData = setTimeout(() => {
      async function sendServicesAndSubscriptions(servicesAndSubscriptions) {
        try {
          await updateServicesAndSubscriptions(servicesAndSubscriptions);
          setError(null);
          if (onUpdate) {
            //Updates data in app.jsx for use in other components
            onUpdate({
              phone:
                servicesAndSubscriptions.phone === ""
                  ? ""
                  : parseFloat(servicesAndSubscriptions.phone),
              broadband:
                servicesAndSubscriptions.broadband === ""
                  ? ""
                  : parseFloat(servicesAndSubscriptions.broadband),
              subscriptions:
                servicesAndSubscriptions.subscriptions === ""
                  ? ""
                  : parseFloat(servicesAndSubscriptions.subscriptions),
            });
          }
        } catch (error) {
          setError(error);
        }
      }
      sendServicesAndSubscriptions(servicesAndSubscriptions);
    }, 1000);
    return () => clearTimeout(updateData);
  }, [servicesAndSubscriptions, onUpdate]);

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
