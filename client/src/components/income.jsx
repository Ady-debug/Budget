import React, { useState } from "react";

export default function Income() {

    let [income, setIncome] = useState({
        wage: '',
        otherIncome: '',
    })

    const [totalIncome, setTotalIncome] = useState('');

    function updateAmount(event) {

        const {name, value} = event.target;

        setIncome(prevItems => {
            return {
                ...prevItems,
                [name]: Number(value)
            }
        })

        console.table(income);
        setTotalIncome(income.wage + income.otherIncome);
    }

    return (
        <form>
            <h2>Income</h2>
            <label> 
                Wage:  
                <input 
                    name="wage" 
                    placeholder="£ per month" 
                    onChange={updateAmount}
                    value={income.wage}
                />
            </label>
            <label>
                Other Income: 
                <input 
                    name="otherIncome" 
                    placeholder="£ per month" 
                    onChange={updateAmount}
                    value={income.otherIncome} 
                />
            </label> 
            <p>Wage: {income.wage}</p>
            <p>Other Income: {income.otherIncome}</p>
            <p>Total: {totalIncome}</p>
        </form>
    )
}

//TODO: fix issue where total doesn't update until space is added in fields