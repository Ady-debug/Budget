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
        vehicleInsurance: props.data.vehicleInsurance || "",
        roadTax: props.data.roadTax || "",
        fuel: props.data.fuel || "",
        breakdownCover: props.data.breakdownCover || "",
        MOTAndServices: props.data.MOTAndServices || "",
        railAndBus: props.data.railAndBus || "",
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

    if (isNaN(value)) {
      setError("Please enter a number");
      return;
    }

    const roundedValue = Math.round(value * 100) / 100;

    setTransportAndTravel((prevItems) => {
      const updatedAmount = {
        ...prevItems,
        [name]: value == "" ? "" : parseFloat(roundedValue),
      };
      setError(null);
      return updatedAmount;
    });
  }

  const total =
    transportAndTravel.vehicleInsurance +
    transportAndTravel.roadTax +
    transportAndTravel.fuel +
    transportAndTravel.breakdownCover +
    transportAndTravel.MOTAndServices +
    transportAndTravel.railAndBus;
  let totalRounded = Math.round(total * 100) / 100;
  totalRounded = totalRounded.toFixed(2);

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
        <Total total={totalRounded} />
      </Card>
    </div>
  );
}
