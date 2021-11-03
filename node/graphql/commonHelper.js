const fs = require("fs");
const util = require("util");
var FCM = require("fcm-node");
var nodemailer = require("nodemailer");
var sesTransport = require("nodemailer-ses-transport");
const dotenv = require('dotenv');
dotenv.config();
const smtpEndpoint = process.env.smtpEndpoint;
const port = process.env.AWS_PORT;
const senderAddress = process.env.senderAddress;
const smtpUsername = process.env.smtpUsername;
const smtpPassword = process.env.smtpPassword;
const SMS_SENDERID = process.env.AFRICASTALKING_SENDERID;
var serverKey =process.env.PUSHNOTIFICATION_KEY;
var fcm = new FCM(serverKey);
const env = process.env;
const africa = require("africastalking")({
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_API_USERNAME,
});
const sms = africa.SMS;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const transporter = nodemailer.createTransport({
  host: smtpEndpoint,
  port: port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: smtpUsername,
    pass: smtpPassword
  }
});

module.exports.home = 0;
module.exports.pending = 1;
module.exports.on_going = 2;
module.exports.completed = 3;
module.exports.chat = 4;
module.exports.booking_view = 5;

module.exports.no_image = () => {
  return env.APP_URL + "/images/public/no_img.png";
};
module.exports.siteName = () => {
  return env.APP_NAME;
};
module.exports.getBaseurl = () => {
  return env.APP_URL;
};
module.exports.getPaymenturl = () => {
  return env.PAYMENT_URL;
};
module.exports.siteUrl = () => {
  return env.APP_URL;
};
module.exports.mpesaURL = () => {
  if (env.MPESA) {
    return env.MPESA_PRODUCTION;
  } else {
    return env.MPESA_SANDBOX;
  }
};
module.exports.prepareUploadFolder = (path) => {
  const pathExist = fs.existsSync(path);
  if (!pathExist) {
    fs.mkdirSync(path, {
      recursive: true,
    });
  }
};

module.exports.push_notifiy = async (message) => {
  return await fcm.send(message, function (err, response) {
    if (err) {
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
};

/**
 * 
 * @param {*} type 
 * @param {*} data 
 * @returns string of message
 */

const static_sms_template = (type, data) => {
  let { otp, msg, link } = data
  switch (type) {
    case "otp":
      return `GIGZZY OTP : ${otp}`
    case "job_placed":
      return `Your gigzzy job is placed successfully`
    case "pay_extra_fare":
      return `Provider end job, and add some extra fare`
    case "job_finished":
      return `Your gigzzy job is completed successfully`
    case "admin_apporved":
      return `Congratulations and you have been approved as Gigzzy Pro`
    case "job_assign":
      return `You have a new job from Gigzzy`
    case "scheduled_job":
      return `Your gigzzy job has almost ready to start`
    default:
      return `Thank's for using gizzy`
  }
}

/**
 * 
 * @param {*} phone_no 
 * @param {*} type 
 */

module.exports.send_sms = async (country_code, phone_no, type, data) => {
  try {
    let message = await static_sms_template(type, data)
    let phone_number = `${country_code}${phone_no}`
    const options = {
      to: `+${phone_number}`,
      message: message,
      from: SMS_SENDERID
    }
    sms.send(options)
      .then((suc) => {
        console.log("send sms ==>",suc['SMSMessageData']['Recipients']);
      })
      .catch((err) => {
        console.log("error sms ===>", err);
      });
    return true
  } catch (error) {
    return false
  }
};

const static_mail_template = (type, data) => {
  let { otp, msg, link } = data
  switch (type) {
    case "otp":
      return {
        subject: "GIGZZY OTP ✔",
        text: "OTP?",
        html: `<b>GIGZZY OTP : ${otp} </b>`
      }
    case "mail_register":
      return {
        subject: "GIGZZY Email Verification ✔",
        text: "Email verification otp?",
        html: `<b>GIGZZY EMAIL OTP : ${otp} </b>`
      }
    case "admin_approved":
      return {
        subject: "GIGZZY Profile verification ✔",
        text: "Please wait, admin will verified you profile?",
        html: `<b>${msg}</b>`
      }
    case "book_later":
      return {
        subject: "GIGZZY ✔",
        text: "Your job is booked successfully",
        html: `<b>Thanks for booking job, If any query please contact to our support team</b>`
      }
    case "schedule_job":
      return {
        subject: "GIGZZY ✔",
        text: "Your job is almost ready",
        html: `<b>${msg}</b>`
      }
    case "job_finished":
      return {
        subject: "GIGZZY ✔",
        text: "Job finished?",
        html: `<b>Your job is succesfully completed</b>`
      }
    case "reset_pwd":
      return {
        subject: "GIGZZY ✔",
        text: "Your reset password link",
        html: `<b>${link}</b>`
      }
    default:
      return {
        subject: "GIGZZY ✔",
        text: "Thanks for using gizzy",
        html: `<b>Thank's for using gizzy </b>`
      }
  }

}

module.exports.send_mail_sendgrid = async (email, type, datas) => {
  try {

    let email_temp = await static_mail_template(type, datas)
    const mail_msg = {
      to: email,
      from: senderAddress,
      ...email_temp
    };
    let data = await sgMail.send(mail_msg);
    return true
  } catch (error) {
    console.log("module.exports.send_mail_sendgrid -> error", error)
    return false
  }
}

