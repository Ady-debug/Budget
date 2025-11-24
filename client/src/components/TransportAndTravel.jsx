import React, { useEffect, useState } from "react";
import { updateTransportAndTravel } from "../../api";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function TransportAndTravel(props) {
  const [transportAndTravel, setTransportAndTravel] = useState({
    vehicleInsurance: "",
    roadTax: "",
    fuel: "",
    breakdownCover: "",
    MOTAndServices: "",
    railAndBus: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (props.data) {
      setTransportAndTravel({
        vehicleInsurance:
          parseFloat(props.data.vehicleInsurance).toFixed(2) || "",
        roadTax: parseFloat(props.data.roadTax).toFixed(2) || "",
        fuel: parseFloat(props.data.fuel).toFixed(2) || "",
        breakdownCover: parseFloat(props.data.breakdownCover).toFixed(2) || "",
        MOTAndServices: parseFloat(props.data.MOTAndServices).toFixed(2) || "",
        railAndBus: parseFloat(props.data.railAndBus).toFixed(2) || "",
      });
    }
  }, [props.data]);

  useEffect(() => {
    const updateData = setTimeout(() => {
      async function sendTransportAndTravel(transportAndTravel) {
        try {
          await updateTransportAndTravel(transportAndTravel);
          setError(null);
        } catch (error) {
          setError(error);
        }
      }
      sendTransportAndTravel(transportAndTravel);
    }, 2000);
    return () => clearTimeout(updateData);
  }, [transportAndTravel]);

  function updateAmount(event) {
    const { name, value } = event.target;

    const valueToNumber = parseFloat(value);
    if (value !== "" && isNaN(valueToNumber)) {
      setError("Please enter a number");
      return;
    }

    setTransportAndTravel((prevItems) => {
      const updatedAmount = {
        ...prevItems,
        [name]: value == "" ? "" : value,
      };
      setError(null);
      return updatedAmount;
    });
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
