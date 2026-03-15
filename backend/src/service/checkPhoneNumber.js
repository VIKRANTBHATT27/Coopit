import { configDotenv } from "dotenv";
import twilio from "twilio";

configDotenv();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

var oneTimePassword = undefined;

async function createMessage(phoneNo, oneTimePassword) {
     try {
          const message = await client.messages.create({
               body: `Otp for Coopit Application: \n ${oneTimePassword}`,
               from: process.env.TWILIO_PHONE_NUMBER,
               to: phoneNo,
          });

          console.log(message.body);
          return true;
     } catch (err) {
          console.error("Twilio error:", err.message);
          return false;
     }
};


export const sendOneTimePassword = async (phoneNo) => {

     oneTimePassword = Math.floor(100000 + Math.random() * 900000);

     const response = await createMessage(phoneNo, oneTimePassword);
     if (!response) throw new Error("OTP not sent");

     setTimeout(() => {
          oneTimePassword = undefined;
     }, 1000 * 60 * 3);

     return { msg: "otp send successfully" };
};



export const checkOneTimePassword = async (otp) => {
     // return true on correct otp
     if (oneTimePassword !== otp) return false;

     return true;
};