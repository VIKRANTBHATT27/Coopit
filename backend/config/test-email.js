import sgMail from "@sendgrid/mail";
import { config } from "dotenv";
config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const msg = {
     to: '0105it231148@oriental.ac.in',
     from: process.env.VERIFYIED_SENDGRID_EMAILID,
     subject: 'Sending with SendGrid is Fun',
     text: 'and easy to do anywhere, even with Node.js',
     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

const sendMail = async () => {
     try {
          await sgMail.send(msg);
          console.log("Email sent successfully");
     } catch (err) {
          console.log("failed sending a email\n", err.message);
     }
};

sendMail();