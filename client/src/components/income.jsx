import React, { useState } from "react";

export default function Income() {

    let [incomeAmounts, setIncomeAmounts] = useState({
        wage: '',
        otherIncome: '',
    })

    function updateAmount(event) {
        const {name, value} = event.target;

        setIncomeAmounts(prevItems => {
            incomeAmounts = {
                ...prevItems,
                [name]: [value]
            }
        })

        console.table(incomeAmounts);
      
    }

    return (
        <form>
            <h2>Income</h2>
            Wage <input name="wage" placeholder="£ per month" onChange={updateAmount} />
            Other Income <input name="otherIncome" placeholder="£ per month" onChange={updateAmount} />
        </form>
    )
}

//TODO: fix issue where setIncomeAmounts does not update object without wiping other field