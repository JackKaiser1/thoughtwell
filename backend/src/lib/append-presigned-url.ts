import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { type SketchMetadataRecord } from "../db/schema.js";
import { externalS3 } from "../index.js";
import { S3Bucket } from "../api/api-constants.js";

export type PresignedSketchMetadataRecords = SketchMetadataRecord & { presignedURL: string };

export async function appendPresignedURL(sketchMetadata: SketchMetadataRecord[]): Promise<PresignedSketchMetadataRecords[]> {
    const presignedSketchMetadataRecords: PresignedSketchMetadataRecords[] = [];

    for (const record of sketchMetadata) {
        const command = new GetObjectCommand({ Bucket: S3Bucket, Key: record.sketchKey });
        const presignedURL = await getSignedUrl(externalS3, command, { expiresIn: 3600 });
        const presignedSketchMetadataRecord = {
            ...record,
            presignedURL: presignedURL
        }

        presignedSketchMetadataRecords.push(presignedSketchMetadataRecord);
    }

    return presignedSketchMetadataRecords;
}