import type { ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";
import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { StreamingBlobPayloadInputTypes } from "@smithy/types";

class S3 {
    s3: S3Client
    Bucket: string
    constructor(s3: S3Client, Bucket: string) {
        this.s3 = s3
        this.Bucket = Bucket
    }

    async list(folder: string | number) {
        const cmd = new ListObjectsV2Command({
            Bucket: this.Bucket, Prefix: `${folder}/`, MaxKeys: 1000,
        })
        let out: ListObjectsV2CommandOutput | undefined

        do {
            const tmp = await this.s3.send(cmd)
            if (out) {
                out.Contents = out.Contents?.concat(tmp.Contents ?? [])
            } else {
                out = tmp
            }
            cmd.input.ContinuationToken = tmp.NextContinuationToken
        } while (cmd.input.ContinuationToken)
        out.Contents = out.Contents?.filter(i => i.Size !== 0)
        return out
    }

    async download(path: string, signal?: AbortSignal) {
        return this.s3.send(new GetObjectCommand({
            Bucket: this.Bucket,
            Key: path
        }), { abortSignal: signal })
    }

    async upload(path: string, body: StreamingBlobPayloadInputTypes, signal?: AbortSignal) {
        return this.s3.send(new PutObjectCommand({
            Bucket: this.Bucket,
            Key: path,
            Body: body,
            ContentType: "application/json"
        }), { abortSignal: signal })
    }


    async listAll() {
        const cmd = new ListObjectsV2Command({
            Bucket: this.Bucket, Delimiter: "/", MaxKeys: 1000,
        })
        let out: ListObjectsV2CommandOutput | undefined
        do {
            const tmp = await this.s3.send(cmd)
            if (out) {
                out.CommonPrefixes = out.CommonPrefixes?.concat(tmp.CommonPrefixes ?? [])
            } else {
                out = tmp
            }
            cmd.input.ContinuationToken = tmp.NextContinuationToken
        } while (cmd.input.ContinuationToken)
        if (out.CommonPrefixes) {
            return out.CommonPrefixes.map(i => parseInt(i.Prefix as string))
        } else {
            return []
        }
    }
}

const s3 = new S3Client({
    endpoint: process.env.s3_endpoint,
    region: "global",
    credentials: {
        'accessKeyId': process.env.s3_access_key,
        'secretAccessKey': process.env.s3_secret_key,
    }
})

export const tos3 = new S3(new S3Client({
    endpoint: "https://s3.tebi.io",
    credentials: { accessKeyId: process.env.toaccessKeyId as string, secretAccessKey: process.env.tosecretAccessKey as string },
    region: "global"
}), process.env.toBucket as string)



export async function GetS3URL(file: string) {
    return getSignedUrl(s3, new GetObjectCommand({
        Bucket: process.env.s3_bucket,
        Key: file,
    }), { expiresIn: 3600 });
}