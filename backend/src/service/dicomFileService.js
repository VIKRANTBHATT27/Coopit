import fs from "fs";
import util from "util";
import * as google from "@googleapis/healthcare";
import { configDotenv } from "dotenv";

configDotenv();

const healthcareClient = google.healthcare({
  version: 'v1',
  auth: new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  }),
});


const writeFile = util.promisify(fs.writeFile);

export const dicomWebRetrieveInstance = async (
  fileName = 'instance_file.dcm',
  studyUid,
  seriesUid,
  instanceUid
) => {

  const cloudRegion = process.env.GOOGLE_CLOUD_CONSOLE_LOCATION;
  const projectId = process.env.GOOGLE_CLOUD_CONSOLE_PROJECT_ID;
  const datasetId = process.env.GOOGLE_CLOUD_CONSOLE_DATASET_ID;
  const dicomStoreId = process.env.GOOGLE_CLOUD_CONSOLE_DICOM_STORE_ID;

  const parent = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}/dicomStores/${dicomStoreId}`;
  const dicomWebPath = `studies/${studyUid}/series/${seriesUid}/instances/${instanceUid}`;
  const request = { parent, dicomWebPath };

  const instance =
    await healthcareClient.projects.locations.datasets.dicomStores.studies.series.instances.retrieveInstance(
      request,
      {
        headers: { Accept: 'application/dicom; transfer-syntax=*' },
        responseType: 'arraybuffer',
      }
    );
  const fileBytes = Buffer.from(instance.data);

  res.setHeader('Content-Type', 'application/dicom');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.setHeader('Content-Length', fileBytes.length);
  res.send(fileBytes);

  await writeFile(fileName, fileBytes);
  console.log(
    `Retrieved DICOM instance and saved to ${fileName} in current directory`
  );
};

export const dicomWebDeleteStudy = async (studyUid) => {
  const cloudRegion = process.env.GOOGLE_CLOUD_CONSOLE_LOCATION;
  const projectId = process.env.GOOGLE_CLOUD_CONSOLE_PROJECT_ID;
  const datasetId = process.env.GOOGLE_CLOUD_CONSOLE_DATASET_ID;
  const dicomStoreId = process.env.GOOGLE_CLOUD_CONSOLE_DICOM_STORE_ID;
  
  const parent = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}/dicomStores/${dicomStoreId}`;
  const dicomWebPath = `studies/${studyUid}`;
  const request = {parent, dicomWebPath};

  await healthcareClient.projects.locations.datasets.dicomStores.studies.delete(
    request
  );
  console.log('Deleted DICOM study');
};

export const previewDicomInstance = async (res, studyUid, seriesUid, instanceUid) => {
    const cloudRegion = process.env.GOOGLE_CLOUD_CONSOLE_LOCATION;
    const projectId = process.env.GOOGLE_CLOUD_CONSOLE_PROJECT_ID;
    const datasetId = process.env.GOOGLE_CLOUD_CONSOLE_DATASET_ID;
    const dicomStoreId = process.env.GOOGLE_CLOUD_CONSOLE_DICOM_STORE_ID;

    const parent = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}/dicomStores/${dicomStoreId}`;
    const dicomWebPath = `studies/${studyUid}/series/${seriesUid}/instances/${instanceUid}`;

    const instance = await healthcareClient.projects.locations.datasets.dicomStores.studies.series.instances.retrieveInstance(
        { parent, dicomWebPath },
        {
            headers: { Accept: 'application/dicom; transfer-syntax=*' },
            responseType: 'arraybuffer',
        }
    );

    return Buffer.from(instance.data);
};