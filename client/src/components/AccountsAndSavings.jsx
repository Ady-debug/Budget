import { useEffect, useState } from "react";
import { updateAccountsAndSavings } from "../../api";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function AccountsAndSavings(props) {
  const { data, onUpdate } = props;
  const [accountsAndSavings, setAccountsAndSavings] = useState({
    accountFees: "",
    savings: "",
  });
  const [error, setError] = useState(null);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  useEffect(() => {
    if (data) {
      setAccountsAndSavings({
        accountFees: parseFloat(data.accountFees).toFixed(2) || "",
        savings: parseFloat(data.savings).toFixed(2) || "",
      });
    }
  }, [data]);

  useEffect(() => {
    if (!pendingUpdate) return;

    const timer = setTimeout(async () => {
      try {
        await updateAccountsAndSavings(pendingUpdate);
        setError(null);
        if (onUpdate) {
          onUpdate({
            accountFees:
              pendingUpdate.accountFees === ""
                ? ""
                : parseFloat(pendingUpdate.accountFees),
            savings:
              pendingUpdate.savings === ""
                ? ""
                : parseFloat(pendingUpdate.savings),
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
      ...accountsAndSavings,
      [name]: value === "" ? "" : value,
    };

    setAccountsAndSavings(newState);
    setPendingUpdate(newState);
    setError(null);
  }

  let total =
    parseFloat(accountsAndSavings.accountFees) +
    parseFloat(accountsAndSavings.savings);
  total = total.toFixed(2);

  return (
    <div>
      <Card title="Accounts and Savings" error={error}>
        <Input
          title="Account Fees"
          name="accountFees"
          onChange={updateAmount}
          value={accountsAndSavings.accountFees}
        ></Input>
        <Input
          title="Savings"
          name="savings"
          onChange={updateAmount}
          value={accountsAndSavings.savings}
        ></Input>
        <Total total={total} />
      </Card>
    </div>
  );
}
