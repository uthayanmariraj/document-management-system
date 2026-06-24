import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const bucketName = process.env.S3_BUCKET_NAME || ""

export async function uploadToS3(fileBuffer: Buffer, filename: string, mimeType: string): Promise<string> {
    const uniqueKey = `${Date.now()}_${filename.replace(/\s+/g, "_")}`;
    const command  = new PutObjectCommand({
        Bucket: bucketName,
        Key: uniqueKey,
        Body: fileBuffer,
        ContentType: mimeType,
    })

    await s3Client.send(command);

    return uniqueKey
}

//helper to download with same name
export async function getS3SignedUrl(storageKey: string, originalFilename: string): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: storageKey,
        ResponseContentDisposition: `attachment; filename="${encodeURIComponent(originalFilename)}"`,
    })

    return await getSignedUrl(s3Client, command, { expiresIn: 900 });
}

export async function deleteFromS3(storageKey: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: storageKey,
  });

  await s3Client.send(command);
}

