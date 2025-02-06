import { nanoid } from "nanoid";
import { NextRequest } from "next/server";

import { bucket, cfUrl, postMediaPrefix, s3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const POST = async (req: NextRequest): Promise<Response> => {
  const fileId = nanoid(21);
  const { filename, contentType } = await req.json();

  const key = `${postMediaPrefix}/${fileId}/${filename}`;

  try {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });

    const body = {
      presignedUrl: await getSignedUrl(s3Client, command, {
        expiresIn: 60 * 60,
      }),
      fileUrl: `${cfUrl}/${bucket}/${key}`,
      fileKey: `${bucket}/${key}`,
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
