import { configDotenv } from "dotenv";
configDotenv();

import { google } from "googleapis";

// No need for configDotenv() or dotenv.config() anymore!

const testGCPConnection = async () => {
     // Check if it's working
     console.log("Key Path:", process.env.GOOGLE_APPLICATION_CREDENTIALS);

     try {
          const auth = await google.auth.getClient({
               scopes: ['https://www.googleapis.com/auth/cloud-platform'],
          });
          const projectId = await google.auth.getProjectId();
          console.log(`✅ Success! Coopit is connected to Project: ${projectId}`);
     } catch (err) {
          console.log("❌ CONNECTION FAILED");
          console.log(err.message);
     }
};

testGCPConnection();