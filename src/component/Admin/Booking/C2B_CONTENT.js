import React, { useEffect, useState } from "react";
const C2B_CONTENT = props => {
    console.log(props)
    const [BusinessNumber, setBusinessNumber] = useState("");
    const [AmountNumber, setAmountNumber] = useState("");
    const [Amount, setAmount] = useState("");
    useEffect(() => {
        setBusinessNumber(props.BusinessNumber);
        setAmountNumber(props.AmountNumber);
        setAmount(props.Amount);
    }, [props]);
    const content = [
        `Select 'Pay Bill' from your M-PESA menu`,
        `Enter ${BusinessNumber} as the 'Business Number'`,
        `Enter ${AmountNumber} as the 'Account Number'`,
        `Enter ${Amount} as the 'Amount',`,
        `Enter your M-PESA PIN'`,
        `Confirm that all the details are correct and press OK`,
    ];
    return (
        <>
            {
                content.map(data => (
                    <>
                        <li key="data">{data}</li>
                    </>
                )
                )
            }
        </>
    )
}

export default C2B_CONTENT
