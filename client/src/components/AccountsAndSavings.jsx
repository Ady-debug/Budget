import React, { useEffect, useState } from "react";
import { updateAccountsAndSavings } from "../../api";
import Card from "./card";
import Input from "./Input";
import Total from "./Total";

export default function AccountsAndSavings(props) {
  const [accountsAndSavings, setAccountsAndSavings] = useState({
    accountFees: "",
    savings: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (props.data) {
      setAccountsAndSavings({
        accountFees: props.data.accountFees || "",
        savings: props.data.savings || "",
      });
    }
  }, [props.data]);

  useEffect(() => {
    const updateData = setTimeout(() => {
      async function sendAccountsAndSavings(accountsAndSavings) {
        try {
          await updateAccountsAndSavings(accountsAndSavings);
          setError(null);
        } catch (error) {
          setError(error);
        }
      }
      sendAccountsAndSavings(accountsAndSavings);
    }, 2000);
    return () => clearTimeout(updateData);
  }, [accountsAndSavings]);

  function updateAmount(event) {
    const { name, value } = event.target;

    if (isNaN(value)) {
      setError("Please enter a number");
      return;
    }

    const roundedValue = Math.round(value * 100) / 100;

    setAccountsAndSavings((prevItems) => {
      const updatedAmount = {
        ...prevItems,
        [name]: value == "" ? "" : parseFloat(roundedValue),
      };
      setError(null);
      return updatedAmount;
    });
  }

  const total = accountsAndSavings.accountFees + accountsAndSavings.savings;
  let totalRounded = Math.round(total * 100) / 100;
  totalRounded = totalRounded.toFixed(2);

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
        <Total total={totalRounded} />
      </Card>
    </div>
  );
}
