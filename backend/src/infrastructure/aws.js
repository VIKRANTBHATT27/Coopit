import APIError from "../utils/APIError.utils.js";
import fs from "node:fs/promises";

import {
    S3Client,
    GetObjectCommand,
    CreateBucketCommand,
    DeleteObjectCommand,
    DeleteBucketCommand,
    paginateListObjectsV2,
    PutObjectCommand,
    NoSuchKey,
    S3ServiceException,
    waitUntilObjectNotExists,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import logger from "../../config/logger.js";

import dotenv from "dotenv";
dotenv.config();

const s3Client = new S3Client({});

const bucketName = `coopit-medical-pdf`;

export const getSignedUrlFromS3 = async (s3Key) => {
    const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
    });

    try {
        const signedUrl = await getSignedUrl(s3Client, getCommand, {
            expiresIn: 300
        });

        return signedUrl;
    } catch (err) {
        if (err instanceof NoSuchKey) {
            logger.error("S3 error:", { key: s3Key, error: err.message });

            throw new APIError(404, "File not found");
        } else if (err instanceof S3ServiceException) {
            logger.error("S3 service error: ", { errName: err.name, error: err.message });

            throw new APIError(503, "AWS service unavailable");
        } else {
            logger.error("Unexpected S3 error: ", { error: err.message });

            throw new APIError(500, "INTERNAL SERVER ERROR");
        }
    }
};

export const uploadFileToS3 = async (s3Key, filePath) => {
    const putCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: await fs.readFile(filePath),
    });

    try {
        await s3Client.send(putCommand);

        return true;
    } catch (err) {
        if (err instanceof S3ServiceException && err.name === "EntityTooLarge") {
            logger.error("S3 error: ", {
                error: err.message,
                hint: "use the S3 console (160GB max) \ or the multipart upload API (5TB max)"
            });

            throw new APIError(413, 'File size greater than 5GB');
        } else if (err instanceof S3ServiceException) {
            logger.error("S3 service error: ", { errName: err.name, error: err.message });

            throw new APIError(503, 'AWS service unavailable');
        } else {
            logger.error("Unexpected S3 error: ", { error: err.message });

            throw new APIError(500, 'INTERNAL SERVER ERROR');
        }
    }
};

export const deleteFileFromS3 = async (s3Key) => {
    const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
    });

    try {
        await s3Client.send(deleteCommand);

        return true;
    } catch (err) {
        if (err instanceof S3ServiceException && err.name === "NoSuchBucket") {
            logger.error("S3 error: ", { bucketName, error: err.message })

            throw new APIError(404, `${bucketName} bucket not found`);
        } else if (err instanceof S3ServiceException) {
            logger.error("S3 service error: ", { errName: err.name, error: err.message });

            throw new APIError(503, 'AWS service unavailable');
        } else {
            logger.error("Unexpected S3 error: ", { error: err.message });

            throw new APIError(500, 'INTERNAL SERVER ERROR');
        }
    }
};
