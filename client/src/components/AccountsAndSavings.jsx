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

  useEffect(() => {
    if (data) {
      setAccountsAndSavings({
        accountFees: parseFloat(data.accountFees).toFixed(2) || "",
        savings: parseFloat(data.savings).toFixed(2) || "",
      });
    }
  }, [data]);

  useEffect(() => {
    const updateData = setTimeout(() => {
      async function sendAccountsAndSavings(accountsAndSavings) {
        try {
          await updateAccountsAndSavings(accountsAndSavings);
          setError(null);
          if (onUpdate) {
            //Updates data in app.jsx for use in other components
            onUpdate({
              accountFees:
                accountsAndSavings.accountFees === ""
                  ? ""
                  : parseFloat(accountsAndSavings.accountFees),
              savings:
                accountsAndSavings.savings === ""
                  ? ""
                  : parseFloat(accountsAndSavings.savings),
            });
          }
        } catch (error) {
          setError(error);
        }
      }
      sendAccountsAndSavings(accountsAndSavings);
    }, 1000);
    return () => clearTimeout(updateData);
  }, [accountsAndSavings, onUpdate]);

  function updateAmount(event) {
    const { name, value } = event.target;

    const valueToNumber = parseFloat(value);
    if (value !== "" && isNaN(valueToNumber)) {
      setError("Please enter a number");
      return;
    }

    setAccountsAndSavings((prevItems) => {
      const updatedAmount = {
        ...prevItems,
        [name]: value == "" ? "" : value,
      };
      setError(null);
      return updatedAmount;
    });
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
