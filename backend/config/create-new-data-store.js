import 'dotenv/config';
import { google } from 'googleapis';
import fs from "fs";

const healthcareClient = google.healthcare({
    version: 'v1',
    auth: new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    }),
});

export const createDicomStore = async (dicomStoreName) => {
    try {
        const cloudRegion = process.env.GOOGLE_CLOUD_CONSOLE_LOCATION;
        const projectId = process.env.GOOGLE_CLOUD_CONSOLE_PROJECT_ID;
        const datasetId = process.env.GOOGLE_CLOUD_CONSOLE_DATASET_ID;

        const dicomStoreId = `Coopit-${dicomStoreName}`;

        const parent = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}`;

        const request = {
            parent,
            dicomStoreId,
        };

        console.log("Attempting to create store at:", parent);

        const res = await healthcareClient.projects.locations.datasets.dicomStores.create(request);
        console.log(`✅ Created DICOM store: ${dicomStoreId}`);
        console.log("Details:", res.data);

    } catch (err) {
        console.error("❌ GaxiosError:", err.response?.data?.error?.message || err.message);
    }
};

export const dicomWebStoreInstance = async (dcmFilePath) => {
    try {
        const cloudRegion = process.env.GOOGLE_CLOUD_CONSOLE_LOCATION;
        const projectId = process.env.GOOGLE_CLOUD_CONSOLE_PROJECT_ID;
        const datasetId = process.env.GOOGLE_CLOUD_CONSOLE_DATASET_ID;

        const dicomStoreId = `Coopit-${dicomStoreName}`;

        const parent = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}/dicomStores/${dicomStoreId}`;
        const dicomWebPath = 'studies';

        const binaryData = fs.createReadStream(dcmFilePath);
        const request = {
            parent,
            dicomWebPath,
            requestBody: binaryData,
        };

        const instance = await healthcareClient.projects.locations.datasets.dicomStores.storeInstances(
            request,
            {
                headers: {
                    'Content-Type': 'application/dicom',
                    Accept: 'application/dicom+json',
                }
            }
        );

        console.log('Stored DICOM instance:\n', JSON.stringify(instance.data));
    } catch (err) {
        console.error("❌ GaxiosError:", err.response?.data?.error?.message || err.message);
    }
};

