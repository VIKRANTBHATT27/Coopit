import twilio from "twilio";
import logger from "../../config/logger.js"

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
        logger.error("Twilio error:", { error: err.message });

        return false;
    }
};

export const fetchPhoneNumber = async (phoneNo) => {
    try {
        const response = await client.lookups.v2
            .phoneNumbers("+918225033780")
            .fetch({ fields: "sim_swap,call_forwarding" });

        console.log(response);

        return response.valid;        //returns true or false
    } catch (err) {
        // console.error("Twilio Error Code:", err.code);
        // console.error("HTTP Status:", err.status);
        // console.error("Error Message:", err.message);
        // console.error("More Info Link:", err.moreInfo);

        logger.error("Twilio lookup error:", { error: err.message });

        // console.log("workign");

        return false;
    }
}