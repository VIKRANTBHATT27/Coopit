import { healthcareClient } from '../services/googleHealthcare.service.js';
import APIError from '../utils/APIError.utils.js';
import dicomParser from 'dicom-parser';
import AdmZip from 'adm-zip';

export const extractAndUploadDICOM = async (req, res, next) => {
     try {
          const zipFilePath = req.file.path;

          const zip = new AdmZip(zipFilePath);

          const dicomFiles = zip.getEntries().filter(entry =>
               !entry.isDirectory && entry.entryName.toLowerCase().endsWith('.dcm')
          );

          if (!dicomFiles)
               throw new APIError(400, "no DICOM files are founded in the zip");

          const cloudRegion = process.env.GOOGLE_CLOUD_CONSOLE_LOCATION;
          const projectId = process.env.GOOGLE_CLOUD_CONSOLE_PROJECT_ID;
          const datasetId = process.env.GOOGLE_CLOUD_CONSOLE_DATASET_ID;

          const dicomStoreId = req.query?.dicomStoreId;

          const parent = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}/dicomStores/${dicomStoreId}`;

          const uploadPromises = dicomFiles.map(
               async (entry) => {
                    const fileBuffer = entry.getData();

                    const dataset = dicomParser.parseDicom(fileBuffer);

                    const studyUid = dataset.string('x0020000d');
                    const seriesUid = dataset.string('x0020000e');
                    const instanceUid = dataset.string('x00080018');  // sopInstanceUid 
                    const modality = dataset.string('x00080060');
                    const bodyPartExamined = dataset.string('x00180015');

                    const dicomFileMetaData = {
                         studyUid,
                         seriesUid,
                         instanceUid,
                         modality,
                         bodyPartExamined
                    };

                    const uploadResult = await healthcareClient.projects.locations.datasets.dicomStores.dicomWeb.storeInstances({
                         parent,
                         dicomWebPath: 'studies',
                         requestBody: fileBuffer,
                         headers: { 'Content-Type': 'application/dicom' }
                    });

                    return {
                         metaData: dicomFileMetaData,
                         uploadResult
                    };
               }
          );

          const result = await Promise.allSettled(uploadPromises);

          req.dicomResults = result;
          req.dicomFiles = dicomFiles;

          return next();
     } catch (err) {
          console.error("DICOM file upload middleware error\n", err.message);

          return next(
               new APIError(
                    500,
                    "Error during extract of zip and uploading Dicoms"
               )
          );
     }
};

export const uploadDicomToGoogleCloud = async (req, res, next) => {
     if (!req.file || !req.file.originalname.toLowerCase().endsWith('.dcm'))
          throw new APIError(400, "Given file is not a valid DICOM file");


     try {
          const filePath = req.file.path;
          const fileBuffer = fs.readFileSync(filePath);

          const dataset = dicomParser.parseDicom(fileBuffer);
          req.dicomFileMetaData = {
               studyUid: dataset.string('x0020000d'),
               seriesUid: dataset.string('x0020000e'),
               instanceUid: dataset.string('x00080018'),
               modality: dataset.string('x00080060'),
               bodyPartExamined: dataset.string('x00180015')
          };

          const cloudRegion = process.env.GOOGLE_CLOUD_CONSOLE_LOCATION;
          const projectId = process.env.GOOGLE_CLOUD_CONSOLE_PROJECT_ID;
          const datasetId = process.env.GOOGLE_CLOUD_CONSOLE_DATASET_ID;
          const dicomStoreId = process.env.GOOGLE_CLOUD_CONSOLE_DICOM_STORE_ID;

          const parent = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}/dicomStores/${dicomStoreId}`;

          await healthcareClient.projects.locations.datasets.dicomStores.studies.storeInstances({
               parent: parent,
               requestBody: fileBuffer,
               headers: {
                    'Content-Type': 'multipart/related; type="application/dicom"',
               },
          });

          return next();
     } catch (err) {
          console.error(
               "Error uploading DICOM to Google Cloud\n",
               err.response?.data || err.message,
          );

          return next(
               new APIError(500, "Failed to upload DICOM file")
          );
     }
};