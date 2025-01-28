import { NextRequest } from "next/server";

import { auth } from "@/auth";
import { bucket, cfUrl, postMediaPrefix, s3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const POST = async (req: NextRequest): Promise<Response> => {
  const session = await auth();
  if (!session?.user) {
    return new Response("로그인하시거나 개발자에게 연락하세요", {
      status: 403,
    });
  }

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
