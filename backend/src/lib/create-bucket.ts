import { type S3Client, BucketAlreadyOwnedByYou, CreateBucketCommand} from "@aws-sdk/client-s3";

export async function createBucket(s3Client: S3Client, bucketName: string): Promise<void> {
    try {
        await s3Client.send(
            new CreateBucketCommand({
                Bucket: bucketName
            }),
        );
    } catch (err) {
        if (err instanceof BucketAlreadyOwnedByYou) {
            console.log("Bucket already created");
        } else {
            throw err;
        }
    }
}