import { useEffect, useState } from "react";
import { updatePersonal } from "../../api";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function Personal(props) {
  const { data, onUpdate } = props;
  const [personal, setPersonal] = useState({
    clothingAndFootwear: "",
    hairdressing: "",
  });
  const [error, setError] = useState(null);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  useEffect(() => {
    if (data) {
      setPersonal({
        clothingAndFootwear:
          parseFloat(data.clothingAndFootwear).toFixed(2) || "",
        hairdressing: parseFloat(data.hairdressing).toFixed(2) || "",
      });
    }
  }, [data]);

  useEffect(() => {
    if (!pendingUpdate) return;

    const timer = setTimeout(async () => {
      try {
        await updatePersonal(pendingUpdate);
        setError(null);
        if (onUpdate) {
          onUpdate({
            clothingAndFootwear:
              pendingUpdate.clothingAndFootwear === ""
                ? ""
                : parseFloat(pendingUpdate.clothingAndFootwear),
            hairdressing:
              pendingUpdate.hairdressing === ""
                ? ""
                : parseFloat(pendingUpdate.hairdressing),
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
      ...personal,
      [name]: value === "" ? "" : value,
    };

    setPersonal(newState);
    setPendingUpdate(newState);
    setError(null);
  }

  let total =
    parseFloat(personal.clothingAndFootwear) +
    parseFloat(personal.hairdressing);
  total = total.toFixed(2);

  return (
    <div>
      <Card title="Personal" error={error}>
        <Input
          title="Clothing and Footwear"
          name="clothingAndFootwear"
          onChange={updateAmount}
          value={personal.clothingAndFootwear}
        ></Input>
        <Input
          title="Hairdressing"
          name="hairdressing"
          onChange={updateAmount}
          value={personal.hairdressing}
        ></Input>
        <Total total={total} />
      </Card>
    </div>
  );
}
