import { configDotenv } from 'dotenv';
import * as google from "@googleapis/healthcare";
import fs from "fs";
configDotenv();


const healthcareClient = google.healthcare({
    version: 'v1',
    auth: new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    }),
});

// const healthcareClient = google.healthcare('v1');

/*export const createDicomStore = async (dicomStoreName) => {
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
*/

// store
const dicomWebStoreInstance = async ( 
    dicomStoreName="x-rays",
    dcmFilePath="C:/Users/Lenovo/OneDrive/Desktop/CODING FOLDER/project/backend/public/uploaded-dicom-files/file-1/series-000002/image-000001.dcm"
) => {
    try {
        const cloudRegion = process.env.GOOGLE_CLOUD_CONSOLE_LOCATION;
        const projectId = process.env.GOOGLE_CLOUD_CONSOLE_PROJECT_ID;
        const datasetId = process.env.GOOGLE_CLOUD_CONSOLE_DATASET_ID;
        
        const dicomStoreId = `Coopit-${dicomStoreName}`;
        
        // const auth = await google.auth.getClient({
        //     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        // });
        // google.options({ auth });
        
        const parent = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}/dicomStores/${dicomStoreId}`;
        

        const binaryData = fs.createReadStream(dcmFilePath);
        const request = {
            parent,
            dicomWebPath: 'studies',
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

        console.log(instance);
        
        console.log('Stored DICOM instance:\n', JSON.stringify(instance.data));
    } catch (err) {
        console.error("❌ GaxiosError:", err.response?.data?.error?.message || err.message);
    }
};

dicomWebStoreInstance();

// view
// export const dicomWebSearchForInstances = async (dicomStoreName) => {
//     try {
//         const cloudRegion = process.env.GOOGLE_CLOUD_CONSOLE_LOCATION;
//         const projectId = process.env.GOOGLE_CLOUD_CONSOLE_PROJECT_ID;
//         const datasetId = process.env.GOOGLE_CLOUD_CONSOLE_DATASET_ID;

//         const dicomStoreId = `Coopit-${dicomStoreName}`;

//         const parent = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}/dicomStores/${dicomStoreId}`;
//         const dicomWebPath = 'instances';

//         const request = {
//             parent,
//             dicomWebPath
//         };

//         const instances = await healthcare.projects.locations.datasets.dicomStores.searchForInstances(
//             request,
//             {
//                 headers: {
//                     Accept: 'application/dicom+json,multipart/related'
//                 },
//             }
//         );

//         console.log(`Found ${instances.data.length} instances:`);
//         console.log(JSON.stringify(instances.data));
//     } catch (err) {
//         console.error("❌ GaxiosError:", err.response?.data?.error?.message || err.message);
//     }
// };
