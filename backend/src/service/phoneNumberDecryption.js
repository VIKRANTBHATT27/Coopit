import { createDecipheriv } from "crypto";

const decryptPhoneNumber = (encryptedPhone, phoneIV, phoneAuthTag) => {
  const algo = "aes-256-gcm";
  const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // same key used in encryption
  const IV = Buffer.from(phoneIV, "hex"); // convert stored IV back to bytes
  const authTag = Buffer.from(phoneAuthTag, "hex");


  const decipher = createDecipheriv(algo, key, IV);
  decipher.setAuthTag(authTag);

  let decryptedPhoneNo = decipher.update(encryptedPhone, "hex", "utf-8");
  decryptedPhoneNo += decipher.final("utf-8");

  return decryptedPhoneNo;
};

export default decryptPhoneNumber;