import AdmZip from 'adm-zip';
import * as google from "@googleapis/healthcare";

const healthcareClient = google.healthcare({
    version: 'v1',
    auth: new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    }),
});

export const extractAndUploadDICOMs = async (req, res, next) => {
     if (!req.file)
          return res.status(400).json({ err: "no zip file provided" });

     const zipFilePath = req.file.path;
     
     try {
          const zip = new AdmZip(zipFilePath);
          const dicomFiles = zip.getEntries().filter(entry =>
               !entry.isDirectory && entry.entryName.toLowerCase().endsWith('.dcm')
          );

          if (!dicomFiles)
               return res.status(400).json({ err: "no DICOM files is found in the zip" });

          const cloudRegion = process.env.GOOGLE_CLOUD_CONSOLE_LOCATION;
          const projectId = process.env.GOOGLE_CLOUD_CONSOLE_PROJECT_ID;
          const datasetId = process.env.GOOGLE_CLOUD_CONSOLE_DATASET_ID;
          
          const dicomStoreId = req.query?.dicomStoreId;

          const parent = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}/dicomStores/${dicomStoreId}`;
          
          const uploadPromises = dicomFiles.map(async (entry) => {
               const fileBuffer = entry.getData();
     
               return healthcareClient.projects.locations.datasets.dicomStores.dicomWeb.storeInstances({
                    parent,
                    dicomWebPath: 'studies',
                    requestBody: fileBuffer,
                    headers: { 'Content-Type': 'application/dicom' }
               });
          });

          const result = await Promise.allSettled(uploadPromises);

          console.log(result);

          req.dicomResults = result;
          req.dicomFiles = dicomFiles;

          return next();

     } catch (err) {
          console.error("DICOM file upload middleware error: ", err.message);
          return res.status(500).json({ err: "Failed to process DICOM files" });
     }
};