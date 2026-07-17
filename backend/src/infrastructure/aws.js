import APIError from "../utils/APIError.utils.js";
import fs from "node:fs/promises";

import {
    S3Client,
    CreateBucketCommand,
    DeleteObjectCommand,
    DeleteBucketCommand,
    paginateListObjectsV2,
    PutObjectCommand,
    NoSuchKey,
    GetObjectCommand,
    S3ServiceException,
    waitUntilObjectNotExists,
} from "@aws-sdk/client-s3";

import dotenv from "dotenv";
dotenv.config();

const s3Client = new S3Client({});

const bucketName = `coopit-medical-pdf`;

export const getSignedUrlFromS3 = async ({ s3Key }) => {
    const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
    });

    try {
        const redirectingURL = await getSignedUrl(s3Client, getCommand, {
            expiresIn: 300
        });

        return redirectingURL;
    } catch (err) {
        if (err instanceof NoSuchKey) {
            console.error(`Error from S3 while getting object "${s3Key}" from "${bucketName}". No such key exists.`);

            throw new APIError(404, 'invalid s3Key, no file exist with this key');
        } else if (err instanceof S3ServiceException) {
            console.error(`Error from S3 while getting object from ${bucketName}. ${err.name}: ${err.message}`);

            throw new APIError(503, 'AWS service unavailable');
        } else {
            console.error(`failed during getting pdf url from aws service\n`, err.message);

            throw new APIError(500, 'INTERNAL SERVER ERROR');
        }
    }
};

export const uploadFileToS3 = async (s3Key, filePath) => {
    try {
        const putCommand = new PutObjectCommand({
            Bucket: bucketName,
            Key: s3Key,
            Body: await fs.readFile(filePath),
        });

        const response = await client.send(putCommand);
        console.log(response);

        return true;
    } catch (err) {
        if (
            err instanceof S3ServiceException &&
            err.name === "EntityTooLarge"
        ) {
            console.error(
                `Error from S3 while uploading object to ${bucketName}. \
The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \
or the multipart upload API (5TB max).`,
            );

            throw new APIError(413, 'file size greater than 5GB');
        } else if (err instanceof S3ServiceException) {
            console.error(
                `Error from S3 while uploading object to ${bucketName}.  ${err.name}: ${err.message}`,
            );
            throw new APIError(503, 'AWS service unavailable');
        } else {
            console.error(`failed during uploading pdf to AWS\n`, err.message);

            throw new APIError(500, 'INTERNAL SERVER ERROR');
        }

        return false;
    }
};

export const deleteFileFromS3 = async (s3Key) => {
    const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
    }),

    try {
        const response = await client.send(putCommand);
        console.log(response);
    } catch (err) {
        if (
            err instanceof S3ServiceException &&
            err.name === "NoSuchBucket"
        ) {
            console.error(
                `Error from S3 while deleting object from ${bucketName}. The bucket doesn't exist.`,
            );

            throw new APIError(404, `${bucketName} bucket not found`);
        } else if (err instanceof S3ServiceException) {
            console.error(
                `Error from S3 while deleting object from ${bucketName}.  ${err.name}: ${err.message}`,
            );

            throw new APIError(503, 'AWS service unavailable');
        } else {
            console.error('failed during deletion of an object from AWS\n', err.message);

            throw new APIError(500, 'INTERNAL SERVER ERROR');
        }
    }
};
