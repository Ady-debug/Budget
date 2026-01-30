import { useEffect, useState } from "react";
import { updatePets } from "../../api";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function Pets(props) {
  const { data, onUpdate } = props;
  const [pets, setPets] = useState({
    petFood: "",
    insurance: "",
  });
  const [error, setError] = useState(null);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  useEffect(() => {
    if (data) {
      setPets({
        petFood: parseFloat(data.petFood).toFixed(2) || "",
        insurance: parseFloat(data.insurance).toFixed(2) || "",
      });
    }
  }, [data]);

  useEffect(() => {
    if (!pendingUpdate) return;

    const timer = setTimeout(async () => {
      try {
        await updatePets(pendingUpdate);
        setError(null);
        if (onUpdate) {
          onUpdate({
            petFood:
              pendingUpdate.petFood === ""
                ? ""
                : parseFloat(pendingUpdate.petFood),
            insurance:
              pendingUpdate.insurance === ""
                ? ""
                : parseFloat(pendingUpdate.insurance),
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
      ...pets,
      [name]: value === "" ? "" : value,
    };

    setPets(newState);
    setPendingUpdate(newState);
    setError(null);
  }

  let total = parseFloat(pets.petFood) + parseFloat(pets.insurance);
  total = total.toFixed(2);

  return (
    <div>
      <Card title="Pets" error={error}>
        <Input
          title="Pet Food"
          name="petFood"
          onChange={updateAmount}
          value={pets.petFood}
        ></Input>
        <Input
          title="Insurance"
          name="insurance"
          onChange={updateAmount}
          value={pets.insurance}
        ></Input>
        <Total total={total} />
      </Card>
    </div>
  );
}
