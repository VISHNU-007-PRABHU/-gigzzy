const dotenv = require('dotenv');
dotenv.config();
let unirest = require('unirest');
const commonHelper = require('./commonHelper')
const moment = require('moment')

/**
 * 
 * @param {*} data 
 * @returns {
            "access_token": "eD7AmyrjafN8myJBVaaNKaSI2dq9",
            "expires_in": "3599"
        }
 */

var safaricom_payment_authorization = async function (data) {
    return new Promise(async function (resolve, reject) {
        try {
            let url = `https://${commonHelper.mpesaURL()}/oauth/v1/generate?grant_type=client_credentials`;
            let password = Buffer.from(`${process.env.MPESA_CONSUMERKEY}:${process.env.MPESA_CONSUMERSECRET}`).toString('base64')
            let headers = { 'Authorization': `Basic ${password}` };
            let req = await unirest('GET', url)
                .headers(headers)
                .send()
                .end(async res => {
                    if (res.error) {
                        console.log("mpesa res.error", res.error)
                        return reject({ status: false, msg: "error in safaricom payment authorization" })
                    }
                    return resolve({ status: true, msg: "success in safaricom payment authorization", data: JSON.parse(res.raw_body) })
                });
        } catch (error) {
            console.log("mpesa authu error", error)
            return reject({ status: false, msg: "error in safaricom payment authorization" })
        }
    })
}

/**
 * 
 * @param {*} data 
 * @returns {
            "OriginatorCoversationID": "33896-14867689-1",
            "ResponseCode": "0",
            "ResponseDescription": "success"
        }
 */
module.exports.safaricom_ctob_register = async (data) => {
    try {
        let url = `https://${commonHelper.mpesaURL()}/mpesa/c2b/v1/registerurl`
        // console.log("module.exports.safaricom_ctob_register -> url", url)
        let token = await safaricom_payment_authorization()
        if (token && !token.status) {
            return reject({ status: false, msg: "safaricom Mpesa express failed" })
        }
        let req = unirest('POST', url)
            .headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.data.access_token}`
            })
            .send(JSON.stringify({
                "ShortCode": process.env.MPESA_SHORT_CODE,
                "ResponseType": "Completed",
                "ConfirmationURL": "https://gigzzy.com/c2b_confirmation",
                "ValidationURL": "https://gigzzy.com/c2b_validation",
            }))
            .end((error, raw_body) => {
                console.log(error, raw_body,"ct0b");
                return { status: true, msg: "safaricom ctob register success" }
            });
    } catch (error) {
        // console.log("module.exports.safaricom_payment_authorization -> error", error)
        return { status: false, msg: "error in safaricom ctob register url" }
    }
}

/**
 * 
 * @param {*} data 
 * @returns {
            "OriginatorCoversationID": "33907-14863228-1",
            "ResponseCode": "0",
            "ResponseDescription": "Accept the service request successfully."
        }
 */
module.exports.safaricom_ctob_simulate = async (PhoneNumber, amount) => {
    try {
        if (!PhoneNumber || !amount) {
            return reject({ status: false, msg: "Invailed params" })
        }
        let url = `https://${commonHelper.mpesaURL()}/mpesa/c2b/v1/simulate`
        let token = await safaricom_payment_authorization()
        if (token && !token.status) {
            return reject({ status: false, msg: "safaricom Mpesa express failed" })
        }
        let req = unirest('POST', url)
            .headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.data.access_token}`
            })
            .send(JSON.stringify({
                "CommandID": "CustomerPayBillOnline",
                "Amount": amount,
                "Msisdn": PhoneNumber,
                "BillRefNumber":  Math.floor(Math.random() * 9000000000) + 1,
                "ShortCode":process.env.MPESA_SHORT_CODE,
            }))
            .end(res => {
            // console.log("module.exports.safaricom_ctob_simulate -> res", res)
                // console.log(res.raw_body, 'simulate');
                return { status: true, msg: "safaricom ctob register success" }
            });
    } catch (error) {
        // console.log("module.exports.safaricom_payment_authorization -> error", error)
        return { status: false, msg: "error in safaricom ctob register url" }
    }
}

module.exports.safaricom_lipesa_simulate = async (PhoneNumber, amount,invoice_no) => {
    return new Promise(async function (resolve, reject) {   
        try {
            if (!PhoneNumber || !amount) {
                return reject({ status: false, msg: "Invailed params" })
            }
            let url = `https://${commonHelper.mpesaURL()}/mpesa/stkpush/v1/processrequest`
            console.log("module.exports.safaricom_lipesa_simulate -> url", url)
            let timeStamp = moment().format('YYYYMMDDHHmmss')
            let passKey = process.env.MPESA_PASSKEY
            let encodeString = `${process.env.MPESA_SHORT_CODE}${passKey}${timeStamp}`
            let token = await safaricom_payment_authorization()
            if (token && !token.status) {
                return reject({ status: false, msg: "safaricom Mpesa express failed" })
            }
            let password = Buffer.from(encodeString).toString('base64')
            let request_data = {
                "BusinessShortCode": process.env.MPESA_SHORT_CODE,
                "Password": password,
                "Timestamp": timeStamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": amount,
                "PartyA": PhoneNumber,
                "PartyB": process.env.MPESA_PARTYB,
                "PhoneNumber": PhoneNumber,
                "CallBackURL": `${process.env.MPESA_CALLBACK_URL}/confirmation`,
                "AccountReference": invoice_no || "CompanyXLTD",
                "TransactionDesc": "Payment of X"
            }
            // console.log("module.exports.safaricom_lipesa_simulate -> request_data", request_data)
            let req = unirest('POST', url)
                .headers({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.data.access_token}`
                })
                .send(JSON.stringify(request_data))
                .end((res) => {
                    if (res.error) {
                        console.log("module.exports.safaricom_lipesa_simulate -> res.error", res.error)
                        return reject({ status: false, msg: "safaricom Mpesa express failed" })
                    }
                    return resolve({ status: true, msg: "safaricom lipesa success", data: JSON.parse(res.raw_body) })
                });
        } catch (error) {
            console.log("module.exports.safaricom_lipesa_simulate -> error", error)
            return reject({ status: false, msg: "Invalid Mpesa express request" })
        }
    })
}


module.exports.safaricom_refund_simulate = async (PhoneNumber, amount,transactionID) => {
    return new Promise(async function (resolve, reject) {
        try {
            // if (!PhoneNumber || !amount) {
            //     return reject({ status: false, msg: "Invailed params" })
            // }
            let url = `https://${commonHelper.mpesaURL()}/mpesa/reversal/v1/request`
            let timeStamp = moment().format('YYYYMMDDHHmmss')
            let passKey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
            let encodeString = `${process.env.MPESA_SHORT_CODE}${passKey}${timeStamp}`
            let token = await safaricom_payment_authorization()
            if (token && !token.status) {
                return reject({ status: false, msg: "safaricom Mpesa express failed" })
            }
            let password = Buffer.from(`${process.env.MPESA_CONSUMERKEY}:${process.env.MPESA_CONSUMERSECRET}`).toString('base64')

            let request_data = {
                "Initiator": "testapi",
                "SecurityCredential": "goxBxsLAvZ+jjru8qhsPwOfVWQMLtGXmZCKzSo7kPsyHzQ25YpOjb3BhAHwjGAhp4hnEnooFJhvpYJ6CnUq/9JEfnsdMP+PRb5n2E5vnA7FVhxC1wk1+Z9ITN7RP3g/ek2thiZe7w9CG8qMk1kX6v6lvdP5xgIgAJKWx6W/urubju4kQyFk2PlxrZtKSBh8lt7OKuJ0wzrGH1YW2FSDoOi3CGR0SpEM5ipAWAsKLdyAE6Lq/IGBHWM9VNixeWgDqALoukzV2jU6cuWCwGcB4AG7qI58NVx7UdJ/e6buKIj6WBFnI6sYURFpS6UDCXsqiiE1em2XJvUBSQ+U7x5jQuQ==",
                "CommandID": "TransactionReversal",
                "TransactionID": "PGD6AGEIJY",
                "Amount":"1",
                "ReceiverParty": "174379",
                "ReceiverIdentifierType": "11",
                // "QueueTimeOutURL":  `${process.env.MPESA_CALLBACK_URL}/refund_timeout`,
                // "ResultURL":  `${process.env.MPESA_CALLBACK_URL}/refund_confimation`,
                "QueueTimeOutURL":  `https://gigzzy.com/cancelled`,
                "ResultURL":  `https://gigzzy.com/cancelled`,
                "Remarks": "test refund",
                "Occassion": "Test occassion",
            }
            let req = unirest('GET', url)
                .headers({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.data.access_token}`
                })
                .send(JSON.stringify(request_data))
                .end((res) => {
                    // console.log(res.raw_body)
                    if (res.error) {
                        // console.log("module.exports.safaricom_refund_simulate -> res.error", res.error)
                        return reject({ status: false, msg: "safaricom mpesa refund failed" })
                    }
                    return resolve({ status: true, msg: "safaricom refund success", data: JSON.parse(res.raw_body) })
                });
        } catch (error) {
            // console.log("module.exports.safaricom_refund_simulate -> error", error)
            return reject({ status: false, msg: "Invalid Mpesa refund request" })
        }
    })
}
