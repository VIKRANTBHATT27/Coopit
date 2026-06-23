import crypto from "crypto";

import { config } from "dotenv";
config();

const SECRET_KEY = Buffer.from(process.env.PHONE_ENCRYPTION_KEY, 'hex');

export const hashPhone = (phoneNo) => 
     crypto.createHash('sha256').update(phoneNo).digest('hex');

export const encryptPhoneFn = (phone) => {
     const iv = crypto.randomBytes(16);
     const cipher = crypto.createCipheriv('aes-256-gcm', SECRET_KEY, iv);
     
     let encryptedPhone = cipher.update(phone, 'utf8', 'hex');
     encryptedPhone += cipher.final('hex');

     return {
          encryptedPhone,
          iv: iv.toString('hex'),
          authTag: cipher.getAuthTag().toString('hex')
     }
}

export const decryptPhoneFn = (encryptedPhone, iv, authTag) => {
     const decipher = crypto.createDecipheriv('aes-256-gcm', SECRET_KEY, Buffer.from(iv, 'hex'));
     decipher.setAuthTag(Buffer.from(authTag, 'hex'));

     let decryptedPhone = decipher.update(encryptedPhone, 'hex', 'utf8');
     decryptedPhone += decipher.final('utf8');

     return decryptedPhone;
}