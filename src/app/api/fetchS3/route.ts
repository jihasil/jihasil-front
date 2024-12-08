import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';

const awsAccessKeyId: string = process.env.AWS_ACCESS_KEY_ID as string;
const awsSecretAccessKey: string = process.env.AWS_SECRET_ACCESS_KEY as string;
const s3Url: string = process.env.S3_URL as string;

const s3 = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
});

const command = new ListObjectsCommand({ Bucket: 'jihasil' });

export async function GET() {
    const data = await s3.send(command);
    const keys: string[] = (
      data.Contents?.filter(content => typeof content.Key === 'string')
        .map(content => `${s3Url}/${content.Key}`) || []
    ) as string[];
    return new Response(JSON.stringify(keys), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }
    )
}