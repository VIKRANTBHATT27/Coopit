// import * as google from "@googleapis/healthcare";
import { fileURLToPath } from "url";
import { google } from "googleapis";


import { config } from 'dotenv';
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "../../google-cloud-config-keys/coopit-cloud-keys.json"),
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

export const healthcareClient = google.healthcare({
    version: 'v1',
    auth
})
