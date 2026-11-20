import crypto from "node:crypto";
import APIError from "./ApiError.utilis.js";

const secretKey = Buffer.from(process.env.MFA_ENCRYPTION_KEY, "hex");

export const encryptSecret = (plaintext) => {
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv("aes-256-gcm", secretKey, iv);

    let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
    ciphertext += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${ciphertext}`;
}

export const decryptSecret = (encryptedPayload) => {
    const [ivHex, authTagHex, encryptedHex] = encryptedPayload.split(':');

    if (!ivHex || !authTagHex || !encryptedHex) {
        throw new APIError('Invalid encrypted payload format.');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv("aes-256-gcm", secretKey, iv);

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}