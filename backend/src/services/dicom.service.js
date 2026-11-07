import { healthcareClient } from "../infrastructure/googleHealthcare.js";
import APIError from "../utils/APIError.utils.js";

import dotenv from "dotenv";
dotenv.config();

const projectId = process.env.GOOGLE_CLOUD_CONSOLE_PROJECT_ID;
const cloudRegion = process.env.GOOGLE_CLOUD_CONSOLE_LOCATION;
const datasetId = process.env.GOOGLE_CLOUD_CONSOLE_DATASET_ID;
const dicomStoreId = process.env.GOOGLE_CLOUD_CONSOLE_DICOM_STORE_ID;

const parent = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}/dicomStores/${dicomStoreId}`;

export const previewDicomInstance = async (
    studyUid,
    seriesUid,
    instanceUid,
) => {
    try {
        const dicomWebPath = `studies/${studyUid}/series/${seriesUid}/instances/${instanceUid}`;

        const instance = await healthcareClient.projects.locations.datasets.dicomStores.studies.series.instances.retrieveInstance(
            { parent, dicomWebPath },
            {
                headers: {
                    Accept: 'application/dicom+json,multipart/related'
                },
                responseType: "arraybuffer"
            }
        );

        return Buffer.from(instance.data);
    } catch (err) {
        throw new APIError(500, `Failed to preview DICOM instance\n${err.message}`);
    }
};

// export const uploadDicomInstance = async (
//     dicomStoreName = 'x-rays',
//     dicomFilePath,
// ) => {
//     try {
//         const fileBuffer = fs.readFileSync(dcmFilePath);

//         const request = {
//             parent,
//             dicomWebPath: 'studies',
//             requestBody: fileBuffer,        // Pass the Buffer, not the stream
//         };

//         const instance = await healthcareClient.projects.locations.datasets.dicomStores.studies.storeInstances(
//             request,
//             {
//                 headers: {
//                     'Content-Type': 'application/dicom',
//                     'Accept': 'application/dicom+json',
//                 }
//             }
//         );

//         console.log('Stored DICOM instance:', JSON.stringify(instance.data));

//     } catch (err) {
//         console.error(
//             "Error during uploading DICOM file\n",
//             err.response?.data || err.message,
//         );

//         throw new APIError(500, "Failed to upload DICOM instance");
//     }
// };

export const deleteDicomInstance = async (
    studyUid
) => {
    try {
        const dicomWebPath = `studies/${studyUid}`;

        const response = await healthcareClient.projects.locations.datasets.dicomStores.studies.deleteStudy(
            { parent, dicomWebPath }
        );

        if (response.status === 204) {
            console.log(`[CLOUD STORAGE] Successfully dropped study UID container: ${studyUid}`);
            return true;
        }

        return false;
    } catch (err) {
        console.error("Google Cloud Healthcare API deletion operation failed:\n", err.response?.data || err.message);

        throw new APIError(500, "Failed to clear target medical imaging resources from cloud infrastructure.");
    }
};