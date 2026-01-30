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
  const [pendingUpdate, setPendingUpdate] = useState(null);

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
    if (!pendingUpdate) return;

    const timer = setTimeout(async () => {
      console.log("Timer fired, calling API");
      try {
        await updateServicesAndSubscriptions(pendingUpdate);
        setError(null);
        if (onUpdate) {
          onUpdate({
            phone:
              pendingUpdate.phone === "" ? "" : parseFloat(pendingUpdate.phone),
            broadband:
              pendingUpdate.broadband === ""
                ? ""
                : parseFloat(pendingUpdate.broadband),
            subscriptions:
              pendingUpdate.subscriptions === ""
                ? ""
                : parseFloat(pendingUpdate.subscriptions),
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
      ...servicesAndSubscriptions,
      [name]: value === "" ? "" : value,
    };

    setServicesAndSubscriptions(newState);
    setPendingUpdate(newState);
    setError(null);
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
