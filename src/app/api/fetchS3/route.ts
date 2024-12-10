import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3';

const s3Url: string = process.env.S3_URL as string;

const s3 = new S3Client({
  region: 'ap-northeast-2',
});

const command = new ListObjectsCommand({ Bucket: 'jihasil' });

export async function GET() {
  try {
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
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify(error), {
      status: 500
    })
  }
}