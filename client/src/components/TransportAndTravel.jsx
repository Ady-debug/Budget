import { useEffect, useState } from "react";
import { updateTransportAndTravel } from "../../api";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function TransportAndTravel(props) {
  const { data, onUpdate } = props;
  const [transportAndTravel, setTransportAndTravel] = useState({
    vehicleInsurance: "",
    roadTax: "",
    fuel: "",
    breakdownCover: "",
    MOTAndServices: "",
    railAndBus: "",
  });
  const [error, setError] = useState(null);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  useEffect(() => {
    if (data) {
      setTransportAndTravel({
        vehicleInsurance: parseFloat(data.vehicleInsurance).toFixed(2) || "",
        roadTax: parseFloat(data.roadTax).toFixed(2) || "",
        fuel: parseFloat(data.fuel).toFixed(2) || "",
        breakdownCover: parseFloat(data.breakdownCover).toFixed(2) || "",
        MOTAndServices: parseFloat(data.MOTAndServices).toFixed(2) || "",
        railAndBus: parseFloat(data.railAndBus).toFixed(2) || "",
      });
    }
  }, [data]);

  useEffect(() => {
    if (!pendingUpdate) return;

    const timer = setTimeout(async () => {
      console.log("Timer fired, calling API");
      try {
        await updateTransportAndTravel(pendingUpdate);
        setError(null);
        if (onUpdate) {
          onUpdate({
            vehicleInsurance:
              pendingUpdate.vehicleInsurance === ""
                ? ""
                : parseFloat(pendingUpdate.vehicleInsurance),
            roadTax:
              pendingUpdate.roadTax === ""
                ? ""
                : parseFloat(pendingUpdate.roadTax),
            fuel:
              pendingUpdate.fuel === "" ? "" : parseFloat(pendingUpdate.fuel),
            breakdownCover:
              pendingUpdate.breakdownCover === ""
                ? ""
                : parseFloat(pendingUpdate.breakdownCover),
            MOTAndServices:
              pendingUpdate.MOTAndServices === ""
                ? ""
                : parseFloat(pendingUpdate.MOTAndServices),
            railAndBus:
              pendingUpdate.railAndBus === ""
                ? ""
                : parseFloat(pendingUpdate.railAndBus),
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
      ...transportAndTravel,
      [name]: value === "" ? "" : value,
    };

    setTransportAndTravel(newState);
    setPendingUpdate(newState);
    setError(null);
  }

  let total =
    parseFloat(transportAndTravel.vehicleInsurance) +
    parseFloat(transportAndTravel.roadTax) +
    parseFloat(transportAndTravel.fuel) +
    parseFloat(transportAndTravel.breakdownCover) +
    parseFloat(transportAndTravel.MOTAndServices) +
    parseFloat(transportAndTravel.railAndBus);
  total = total.toFixed(2);

  return (
    <div>
      <Card title="Transport and Travel" error={error}>
        <Input
          title="Vehicle Insurance"
          name="vehicleInsurance"
          onChange={updateAmount}
          value={transportAndTravel.vehicleInsurance}
        ></Input>
        <Input
          title="Road Tax"
          name="roadTax"
          onChange={updateAmount}
          value={transportAndTravel.roadTax}
        ></Input>
        <Input
          title="Fuel"
          name="fuel"
          onChange={updateAmount}
          value={transportAndTravel.fuel}
        ></Input>
        <Input
          title="Breakdown Cover"
          name="breakdownCover"
          onChange={updateAmount}
          value={transportAndTravel.breakdownCover}
        ></Input>
        <Input
          title="MOT and Services"
          name="MOTAndServices"
          onChange={updateAmount}
          value={transportAndTravel.MOTAndServices}
        ></Input>
        <Input
          title="Rail and Bus"
          name="railAndBus"
          onChange={updateAmount}
          value={transportAndTravel.railAndBus}
        ></Input>
        <Total total={total} />
      </Card>
    </div>
  );
}
