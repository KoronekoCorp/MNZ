import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GetS3URL(file: string) {
    const s3 = new S3Client({
        endpoint: process.env.s3_endpoint,
        region: "global",
        credentials: {
            'accessKeyId': process.env.s3_access_key,
            'secretAccessKey': process.env.s3_secret_key,
        }
    })

    return getSignedUrl(s3, new GetObjectCommand({
        Bucket: process.env.s3_bucket,
        Key: file,
    }), { expiresIn: 3600 });
}