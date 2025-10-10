import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const bucketName = process.env.AMAZON_S3_BUCKET_NAME;
const accessKeyId = process.env.AMAZON_S3_ACCESS_KEY;
const secretAccessKey = process.env.AMAZON_S3_SECRET_KEY;
const region = process.env.AMAZON_S3_REGION;

const s3Client = new S3Client({
  region: region ?? '',
  credentials: {
    accessKeyId: accessKeyId ?? '',
    secretAccessKey: secretAccessKey ?? '',
  },
});

export const generatePublicUrl = (fileName: string): string => {
  return `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
};

const uploadToS3 = async (file: Buffer, fileName: string, mimeType: string) => {
  const params = new PutObjectCommand({
    Bucket: bucketName,
    Body: file,
    Key: fileName,
    ContentType: mimeType,
  });

  return await s3Client.send(params);
};

export default {
  uploadToS3,
  generatePublicUrl,
  s3Client,
};
