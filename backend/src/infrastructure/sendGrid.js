import sgMail from '@sendgrid/mail';

import { config } from "dotenv";
config();

const {
     SENDGRID_API_KEY,
     VERIFYIED_SENDGRID_EMAILID
} = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const createMessage = (emailId, otpCode) => ({
     to: emailId,
     from: VERIFYIED_SENDGRID_EMAILID,
     subject: 'verifying emailId for Coopit',
     text: ` your one time password for verifying your emailId is ${otpCode}`,
     html: `<p>your one time password for verifying your emailId is <strong>${otpCode}</strong></p>`,
});

const sendMail = async (emailId, otpCode) => {
     try {
          const msg = createMessage(emailId, otpCode);

          await sgMail.send(msg);

          return true;
     } catch (err) {
          console.error("failed sending a email\n", err.message);
          
          return false;
     }
};

export default sendMail;