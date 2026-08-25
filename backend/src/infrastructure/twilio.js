import twilio from "twilio";

import { config } from "dotenv";
config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const dispatchSMS = async (phoneNo, oneTimePassword) => {
     try {
          const message = await client.messages.create({
               body: `Otp for Coopit Application: \n ${oneTimePassword}`,
               from: process.env.TWILIO_PHONE_NUMBER,
               to: phoneNo,
          });

          return true;
     } catch (err) {
          console.error("Twilio error:", err.message);
          return false;
     }
};

export const fetchPhoneNumber = async (phoneNo) => {
     const response = await client.lookups.v2
          .phoneNumbers(phoneNo)
          .fetch();

     return response.valid;        //returns true or false
}