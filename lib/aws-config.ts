import { S3Client } from '@aws-sdk/client-s3';

export function getBucketConfig() {
  return {
    bucketName: process.env.AWS_BUCKET_NAME ?? '',
    folderPrefix: process.env.AWS_FOLDER_PREFIX ?? '',
  };
}

export function isS3StorageEnabled(): boolean {
  return Boolean(process.env.AWS_BUCKET_NAME?.trim());
}

export function createS3Client() {
  return new S3Client({});
}
