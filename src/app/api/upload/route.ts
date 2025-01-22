import { NextRequest } from "next/server";

import { bucket, cfUrl, postMediaPrefix, s3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const POST = async (req: NextRequest): Promise<Response> => {
  const { filename, contentType } = await req.json();

  const key = `${postMediaPrefix}/${filename}`;

  try {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });

    const body = {
      presignedUrl: await getSignedUrl(s3Client, command, {
        expiresIn: 60 * 60 * 24,
      }),
      fileUrl: `${cfUrl}/${bucket}/${postMediaPrefix}/${filename}`,
      fileKey: `${bucket}/${postMediaPrefix}/${filename}`,
    };

    return new Response(JSON.stringify(body), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
    });
  }
};
